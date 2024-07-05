import fitz  # PyMuPDF
import logging
import boto3
from io import BytesIO
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from sentence_transformers import SentenceTransformer
import numpy as np
from .models import PDFFile, PageConnection, Chapter
from django.conf import settings
from django.contrib.auth.models import User  # Assuming you're using Django's built-in User model

logger = logging.getLogger(__name__)

class RecommendView(APIView):
    def post(self, request):
        try:
            # 파일 및 유저 ID 정보 확인
            if 'file' not in request.FILES or 'user_id' not in request.data:
                logger.error("File or user_id not found in request")
                return Response({"error": "File and user ID must be provided."}, status=status.HTTP_400_BAD_REQUEST)

            file = request.FILES['file']
            user_id = request.data['user_id']
            chapters_data = request.data.get('chapters', [])
            print("------------------1-------------------")

            # 유저 확인
            try:
                user = User.objects.get(pk=user_id)
            except User.DoesNotExist:
                logger.error(f"User with ID {user_id} does not exist.")
                return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

            file_name = file.name
            s3_client = boto3.client(
                's3',
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                region_name=settings.AWS_S3_REGION_NAME
            )
            print("------------------2-------------------")

            # S3에 파일 업로드
            try:
                # Upload the file directly from the `file` object
                s3_client.upload_fileobj(file, settings.AWS_STORAGE_BUCKET_NAME, file_name)
                file_url = f"https://{settings.AWS_STORAGE_BUCKET_NAME}.s3.{settings.AWS_S3_REGION_NAME}.amazonaws.com/{file_name}"
                logger.info(f"File {file_name} uploaded to S3 at {file_url}")
            except Exception as e:
                logger.error(f"Failed to upload file to S3: {e}")
                return Response({"error": "Failed to upload file to S3."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            print("------------------3-------------------")

            # PDFFile 객체 생성
            pdf_file = PDFFile.objects.create(filename=file_name, user=user, url=file_url)
            logger.info(f"PDFFile object created with id {pdf_file.id}")
            print(f"PDFFile object created with id: {pdf_file.id}")  # ID 출력
            print("------------------4-------------------")

            # 챕터 정보 DB에 저장
            chapters = []
            for chapter_data in chapters_data:
                chapter = Chapter.objects.create(
                    name=chapter_data['name'],
                    start_page=chapter_data['start_page'],
                    end_page=chapter_data['end_page'],
                    level=chapter_data['level'],
                    bookmarked=chapter_data.get('bookmarked', False),
                    pdf_file=pdf_file
                )
                chapters.append(chapter)
            logger.info("Chapters information saved")
            print("------------------5-------------------")

            # PDF 파일에서 텍스트 추출
            # Re-fetch the file from S3
            file_obj = s3_client.get_object(Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=file_name)
            file_content = file_obj['Body'].read()
            file_io = BytesIO(file_content)
            file_io.seek(0)  # 파일 포인터를 처음으로 되돌림

            pdf_document = fitz.open(stream=file_io, filetype="pdf")
            print("------------------6-------------------")
            pages_text = []
            for page_num in range(len(pdf_document)):
                page = pdf_document.load_page(page_num)
                pages_text.append(page.get_text())
            logger.info(f"Extracted text from {len(pages_text)} pages")
            print("------------------7-------------------")

            # Sentence-BERT 모델 로드
            model = SentenceTransformer('all-mpnet-base-v2')
            logger.info("SentenceTransformer model loaded")

            # 각 페이지를 임베딩으로 변환
            page_embeddings = [model.encode(text).tolist() for text in pages_text]
            logger.info("Page embeddings created")
            print("------------------8-------------------")

            # 유사도 임계값 설정 (예: 0.8)
            similarity_threshold = 0.8

            # 유사도 계산 함수 정의
            def cosine_similarity(vec1, vec2):
                vec1 = np.array(vec1)
                vec2 = np.array(vec2)
                return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))

            # 챕터별로 페이지 연결 생성
            for chapter in chapters:
                chapter_pages_embeddings = page_embeddings[chapter.start_page - 1:chapter.end_page]
                for i in range(len(chapter_pages_embeddings)):
                    for j in range(i + 1, len(chapter_pages_embeddings)):
                        similarity = cosine_similarity(chapter_pages_embeddings[i], chapter_pages_embeddings[j])
                        if similarity >= similarity_threshold:
                            PageConnection.objects.create(
                                pdf_file=pdf_file,
                                source_page=chapter.start_page + i,
                                target_page=chapter.start_page + j,
                                similarity=similarity
                            )
            logger.info("Chapter-based page connections created")
            print("------------------9-------------------")

            # ID를 반환하는 응답
            return Response({"message": "PDF and connections have been saved.", "pdf_file_id": pdf_file.id}, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error occurred: {e}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
