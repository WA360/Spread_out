import type { NextPage } from "next";
import dynamic from "next/dynamic";

const PDFReader = dynamic(() => import("../components/PDFReader"), {
  ssr: false,
});

const Home: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">PDF 리더 데모</h1>
        <PDFReader />
      </main>
    </div>
  );
};

export default Home;
