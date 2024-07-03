import PDFViewer from "../components/PDFViewer";

export default function Home() {
  return (
    <div>
      <h1>PDF Viewer Example</h1>
      <PDFViewer file="/public/pdf" />
    </div>
  );
}
