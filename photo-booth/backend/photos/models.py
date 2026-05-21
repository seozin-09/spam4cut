from django.db import models
import qrcode
from io import BytesIO
from django.core.files import File
from PIL import Image
import uuid
import os

class Photo(models.Model):
    image = models.ImageField(upload_to='photos/')
    qr_code = models.ImageField(upload_to='qr_codes/', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Photo {self.id} - {self.created_at}"

    def save(self, *args, **kwargs):
        # 1. 파일 이름 중복 방지를 위해 UUID 사용 (옵션)
        # 2. 처음 저장 시 ID 생성
        is_new = self.pk is None
        super().save(*args, **kwargs)
        
        # 3. QR 코드가 없고 이미지가 있는 경우에만 생성
        if not self.qr_code and self.image:
            # 실제 모바일 기기 접속을 위해 로컬 IP 주소 사용
            local_ip = "10.125.93.230" 
            photo_url = f"http://{local_ip}:8000/api/photos/{self.id}/view/"
            
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_L,
                box_size=10,
                border=4,
            )
            qr.add_data(photo_url)
            qr.make(fit=True)

            img = qr.make_image(fill_color="black", back_color="white")
            
            buffer = BytesIO()
            img.save(buffer, format='PNG')
            
            # 파일 이름에 ID나 UUID를 섞어 중복 방지
            filename = f'qr_code_{self.id}_{uuid.uuid4().hex[:8]}.png'
            self.qr_code.save(filename, File(buffer), save=False)
            
            # 다시 저장 (업데이트) - 업데이트 시에는 ID가 이미 있으므로 IntegrityError 방지
            super().save(update_fields=['qr_code'])
