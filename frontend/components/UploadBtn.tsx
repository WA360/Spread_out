"use client";

import React, { useState } from "react";

const UploadBtn: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      setFileUrl(URL.createObjectURL(selectedFile));
    }
  };

  return (
    <div>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      {fileUrl && (
        <embed
          src={fileUrl}
          type="application/pdf"
          width="100%"
          height="600px"
        />
      )}
    </div>
  );
};

export default UploadBtn;
