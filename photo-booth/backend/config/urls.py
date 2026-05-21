from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('photos.urls')),
]

# DEBUG 모드가 아니더라도 /tmp/media (또는 설정된 MEDIA_ROOT)를 서빙하도록 설정
# (Cloud Run 임시 저장소 사용을 위한 특수 설정)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
