import type { NextPage } from "next";
import dynamic from "next/dynamic";

const PDFReader = dynamic(() => import("../components/PDFReader"), {
  ssr: false,
});

const Home: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto py-8">
        <PDFReader />
      </main>
    </div>
  );
};

export default Home;
