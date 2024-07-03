"use client";

import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { pdfFileState } from "../app/recoil";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

const PDFReader: React.FC = () => {
  const pdfFile = useRecoilValue(pdfFileState);
  const [numPages, setNumPages] = useState<number | null>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div className="container mx-auto p-4">
      {pdfFile && (
        <Document
          file={pdfFile}
          onLoadSuccess={onDocumentLoadSuccess}
          className="border border-gray-300 rounded">
          <Page pageNumber={1} className="max-w-full h-auto" />
        </Document>
      )}
      {numPages && (
        <p className="mt-4 text-sm text-gray-600">
          총 {numPages}페이지 중 1페이지
        </p>
      )}
    </div>
  );
};

export default PDFReader;
