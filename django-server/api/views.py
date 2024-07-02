from PyPDF2 import PdfReader
import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from sentence_transformers import SentenceTransformer
import numpy as np
from .models import PDFFile, PageConnection

logger = logging.getLogger(__name__)

class RecommendView(APIView):
    def post(self, request):
        try:
            # 파일 존재 여부 확인
            if 'file' not in request.FILES:
                logger.error("No file found in request.FILES")
                return Response({"error": "No file provided."}, status=status.HTTP_400_BAD_REQUEST)

            file = request.FILES['file']
            file_name = file.name

            # 파일 저장
            file_path = default_storage.save(file_name, ContentFile(file.read()))
            logger.info(f"File saved to {file_path}")

            # PDFFile 객체 생성
            pdf_file = PDFFile.objects.create(filename=file_name)
            logger.info(f"PDFFile object created with id {pdf_file.id}")

            # PDF 파일에서 텍스트 추출
            pdf = PdfReader(file_path)  # PdfFileReader를 PdfReader로 변경
            pages_text = []
            for page_num in range(len(pdf.pages)):
                page = pdf.pages[page_num]
                pages_text.append(page.extract_text())

            logger.info(f"Extracted text from {len(pages_text)} pages")

            # Sentence-BERT 모델 로드
            model = SentenceTransformer('all-mpnet-base-v2')
            logger.info("SentenceTransformer model loaded")

            # 각 페이지를 임베딩으로 변환
            page_embeddings = [model.encode(text).tolist() for text in pages_text]
            logger.info("Page embeddings created")

            # 유사도 임계값 설정 (예: 0.8)
            similarity_threshold = 0.8

            # 유사도 계산 함수 정의
            def cosine_similarity(vec1, vec2):
                vec1 = np.array(vec1)
                vec2 = np.array(vec2)
                return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))

            # 유사도 임계값 이상의 쌍을 저장할 리스트
            for i in range(len(page_embeddings)):
                for j in range(i + 1, len(page_embeddings)):
                    similarity = cosine_similarity(page_embeddings[i], page_embeddings[j])
                    if similarity >= similarity_threshold:
                        PageConnection.objects.create(
                            pdf_file=pdf_file,
                            source_page=i + 1,
                            target_page=j + 1,
                            similarity=similarity
                        )
            logger.info("Page connections created")

            return Response({"message": "PDF and connections have been saved."}, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error occurred: {e}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
