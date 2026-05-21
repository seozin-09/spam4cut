from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404, render
from .models import Photo
from .serializers import PhotoSerializer
from django.http import HttpResponse

class PhotoViewSet(viewsets.ModelViewSet):
    queryset = Photo.objects.all()
    serializer_class = PhotoSerializer

    @action(detail=False, methods=['post'], url_path='upload')
    def upload(self, request):
        image = request.FILES.get('image')
        if not image:
            return Response({"error": "No image provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        photo = Photo.objects.create(image=image)
        serializer = self.get_serializer(photo)
        
        # 프론트엔드 요구사항에 맞춰 qr_code_url 추가
        data = serializer.data
        data['qr_code_url'] = request.build_absolute_uri(photo.qr_code.url) if photo.qr_code else None
        
        return Response(data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get'], url_path='view')
    def view_photo(self, request, pk=None):
        photo = self.get_object()
        return render(request, 'photos/view_photo.html', {'photo': photo})
