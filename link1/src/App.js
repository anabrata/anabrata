import React, { useRef, useState } from "react";
import { PageFlip } from "st-pageflip";
import * as pdfjsLib from "pdfjs-dist";
import "st-pageflip/dist/pageflip.css";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.10.111/pdf.worker.min.js";

function App() {
  const [pdfPages, setPdfPages] = useState([]);
  const [mode, setMode] = useState("book"); // "book" or "single"
  const pageFlipRef = useRef();

  const handlePDFUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const pages = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
      pages.push(canvas.toDataURL());
    }
    setPdfPages(pages);
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "auto", padding: "2rem" }}>
      <h1>PDF Book Viewer</h1>
      <input type="file" accept="application/pdf" onChange={handlePDFUpload} />
      <div style={{ margin: "1rem 0" }}>
        <button onClick={() => setMode("book")}>Book Mode</button>
        <button onClick={() => setMode("single")}>Single Page Mode</button>
      </div>
      {pdfPages.length > 0 && (
        <PageFlip
          width={mode === "book" ? 800 : 400}
          height={600}
          size={mode === "book" ? "stretch" : "fixed"}
          minWidth={315}
          minHeight={420}
          maxWidth={2000}
          maxHeight={1800}
          showCover={false}
          mobileScrollSupport={true}
          maxShadowOpacity={0.5}
          ref={pageFlipRef}
          useMouseEvents={true}
          className="pageflip"
          type={mode === "book" ? "book" : "single"}
        >
          {pdfPages.map((src, idx) => (
            <div key={idx} className="page">
              <img
                src={src}
                alt={`Page ${idx + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
          ))}
        </PageFlip>
      )}
    </div>
  );
}

export default App;
