"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import PDFViewer from "@/components/PDFViewer";
import { getPDF } from "@/lib/indexedDB";

export default function PDFPage() {
  const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const params = useParams();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchPDF = async () => {
      if (params.id) {
        const data = await getPDF(params.id as string);
        setPdfData(data);
      }
    };
    fetchPDF();
  }, [params.id]);

  useEffect(() => {
    const page = searchParams.get("page");
    if (page) {
      const pageNum = parseInt(page, 10);
      if (!isNaN(pageNum)) {
        setPageNumber(pageNum);
      }
    }
  }, [searchParams]);

  if (!pdfData) return <div>Loading...</div>;

  return <PDFViewer pdfData={pdfData} pageNumber={pageNumber} />;
}
