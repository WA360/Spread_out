from django.db import models
from django.contrib.auth.models import User  # Assuming you're using Django's built-in User model

class PDFFile(models.Model):
    filename = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # 새로운 외래키
    url = models.URLField(max_length=500)  # 새로운 URL 필드

class PageConnection(models.Model):
    pdf_file = models.ForeignKey(PDFFile, on_delete=models.CASCADE)
    source_page = models.IntegerField()
    target_page = models.IntegerField()
    similarity = models.FloatField()


"""
db migration
python manage.py makemigrations
python manage.py migrate
"""
