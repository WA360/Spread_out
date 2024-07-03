"use client";

import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

const PDFReader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setFile(file);
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div className="container mx-auto p-4">
      <input
        type="file"
        onChange={onFileChange}
        className="mb-4 p-2 border border-gray-300 rounded"
        accept=".pdf"
      />
      {file && (
        <Document
          file={file}
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
