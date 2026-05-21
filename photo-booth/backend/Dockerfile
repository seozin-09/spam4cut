# Python 공식 이미지 사용
FROM python:3.11-slim

# 환경 변수 설정
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PORT 8080

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 설치
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# 프로젝트 코드 복사
COPY . /app/

# 정적 파일 수집
RUN python manage.py collectstatic --noinput

# Gunicorn을 사용하여 서버 실행
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 config.wsgi:application
