"use client";

import { useState, useEffect, useMemo } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// Corrected CSS paths for Next.js 16
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface Props {
  fileUrl: string;
  userIdentifier: string;
}

export default function PdfViewer({ fileUrl, userIdentifier }: Props) {
  const [numPages, setNumPages] = useState<number>(0);
  const [scale, setScale] = useState(1.1);
  const [containerWidth, setContainerWidth] = useState<number>(800);

  // Responsive container detection
  useEffect(() => {
    const updateWidth = () => {
      const el = document.getElementById("pdf-viewport");
      if (el) setContainerWidth(el.clientWidth - 48);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    <div id="pdf-viewport" className="w-full flex flex-col items-center bg-[#02040a] min-h-screen pb-24">
      
      {/* FLOATING GLASS TOOLBAR */}
      <div className="sticky top-6 z-[70] flex items-center gap-8 bg-[#0d1117]/80 backdrop-blur-2xl px-8 py-3 rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] mb-12">
        <button 
          onClick={() => setScale(s => Math.max(0.5, s - 0.1))}
          className="text-gray-400 hover:text-purple-400 transition-all active:scale-90 text-2xl"
        >
          −
        </button>
        
        <div className="flex flex-col items-center min-w-[100px]">
          <span className="text-[10px] text-purple-500 font-black tracking-widest leading-none mb-1">SCALE</span>
          <span className="text-sm font-mono text-white">{(scale * 100).toFixed(0)}%</span>
        </div>

        <button 
          onClick={() => setScale(s => Math.min(2.5, s + 0.1))}
          className="text-gray-400 hover:text-purple-400 transition-all active:scale-90 text-2xl"
        >
          +
        </button>
      </div>

      <Document
        file={fileUrl}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        loading={
          <div className="flex flex-col items-center mt-32">
            <div className="w-12 h-12 border-[3px] border-purple-500/10 border-t-purple-500 rounded-full animate-spin mb-6" />
            <p className="text-[10px] text-gray-500 tracking-[0.4em] uppercase font-bold">Establishing Secure Pipe</p>
          </div>
        }
        className="flex flex-col items-center gap-14"
      >
        {Array.from(new Array(numPages), (_, index) => (
          <div 
            key={`page_${index + 1}`} 
            className="relative group transition-all duration-700"
            onContextMenu={(e) => e.preventDefault()}
          >
            {/* 🛡️ INVISIBLE INTERACTION SHIELD */}
            <div className="absolute inset-0 z-30 bg-transparent cursor-default" />

            {/* 🏷️ PAGE-LEVEL WATERMARK */}
            <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden select-none">
                <div className="absolute inset-0 grid grid-cols-2 grid-rows-3 gap-12 opacity-[0.05]">
                   {Array.from({ length: 6 }).map((_, i) => (
                     <div key={i} className="flex items-center justify-center text-[4vw] font-black -rotate-[35deg] text-slate-900 tracking-tighter uppercase">
                        {userIdentifier.split('@')[0]}
                     </div>
                   ))}
                </div>
            </div>

            {/* THE CONTENT PAGE */}
            <div className="shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/5 rounded-sm overflow-hidden bg-white">
              <Page
                pageNumber={index + 1}
                scale={scale}
                width={containerWidth > 1100 ? 1100 : containerWidth}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                loading={<div className="bg-[#0d1117] h-[1000px] w-full animate-pulse" />}
              />
            </div>

            {/* PAGE METADATA */}
            <div className="mt-4 flex justify-between items-center px-4 opacity-20 group-hover:opacity-100 transition-opacity">
               <span className="text-[9px] text-gray-500 font-mono">HASH_{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
               <span className="text-[10px] text-purple-500 font-black uppercase tracking-[0.2em]">Page {index + 1} / {numPages}</span>
            </div>
          </div>
        ))}
      </Document>
    </div>
  );
}