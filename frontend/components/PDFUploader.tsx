"use client";

import { useState } from "react";
import { savePDF } from "@/lib/indexedDB";
import { useRouter } from "next/router";

export default function PDFUploader() {
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const id = await savePDF(file.name, e.target?.result as ArrayBuffer);
        router.push(`/pdf/${id}`);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="mb-4">
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="mb-2"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded">
        Upload PDF
      </button>
    </div>
  );
}
