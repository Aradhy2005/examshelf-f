"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import dynamic from "next/dynamic";

// DYNAMIC IMPORT TO BYPASS TURBOPACK BUILD ERRORS
const PdfViewer = dynamic(() => import("@/components/PdfViewer"), {
  ssr: false,
  loading: () => (
    <div className="h-screen flex flex-col items-center justify-center bg-[#02040a]">
      <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full bg-purple-600 animate-[shimmer_1.5s_infinite]" />
      </div>
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  ),
});

export default function UnitViewerPage() {
  const { unitId } = useParams<{ unitId: string }>();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [unitTitle, setUnitTitle] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  // 1. DATA LOAD & PERMISSION
  useEffect(() => {
    const init = async () => {
      if (authLoading) return;
      if (!user) {
        router.replace(`/login?redirect=/units/${unitId}`);
        return;
      }

      try {
        const [uSnap, unitSnap] = await Promise.all([
          getDoc(doc(db, "users", user.uid)),
          getDoc(doc(db, "units", unitId))
        ]);

        if (!unitSnap.exists()) return router.replace("/");

        const data = unitSnap.data();
        const unlocked = uSnap.data()?.unlockedUnits || [];
        const unlockedSubs = uSnap.data()?.unlockedSubjects || [];

        if (!unlocked.includes(unitId) && !unlockedSubs.includes(data.subjectId)) {
          return router.replace(`/subjects/${data.subjectId}`);
        }

        setUnitTitle(data.title || "Restricted Material");
        
        await updateDoc(doc(db, "users", user.uid), {
          lastOpenedUnit: unitId,
          lastOpenedAt: Date.now(),
        });

        const url = await getDownloadURL(ref(storage, data.pdfPath));
        setPdfUrl(url);
        setIsAuthorized(true);
      } catch (err) {
        console.error("Shield Error:", err);
        alert("Access denied. Please purchase the unit.");
        router.replace("/");
      }
    };
    init();
  }, [user, authLoading, unitId, router]);

  // 2. 🛡️ SCREENSHOT & PRINT PROTECTION ENGINE
  useEffect(() => {
    // Blur content if user switches windows (standard during screenshot tools)
    const handleBlur = () => {
      document.getElementById("shield-root")!.style.filter = "blur(30px) grayscale(100%)";
    };
    const handleFocus = () => {
      document.getElementById("shield-root")!.style.filter = "none";
    };

    // Block keyboard theft
    const preventTheft = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "p" || e.key === "s" || e.key === "u")) {
        e.preventDefault();
      }
      if (e.key === "PrintScreen") {
        navigator.clipboard.writeText(""); // Clear clipboard
        alert("Screenshots are strictly prohibited.");
      }
    };

    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("keydown", preventTheft);
    document.addEventListener("contextmenu", (e) => e.preventDefault());

    // Anti-Print Injection
    const style = document.createElement('style');
    style.innerHTML = `@media print { body { display: none !important; } }`;
    document.head.appendChild(style);

    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("keydown", preventTheft);
    };
  }, []);

  if (!isAuthorized || !pdfUrl) return null;

  return (
    <main id="shield-root" className="min-h-screen bg-[#02040a] flex flex-col transition-all duration-500">
      {/* CINEMATIC HEADER */}
      <header className="flex items-center justify-between px-10 py-6 bg-black/60 border-b border-white/5 backdrop-blur-3xl sticky top-0 z-[100]">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-gray-400"
          >
            &larr;
          </button>
          <div className="h-8 w-[1px] bg-white/10" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-0.5">
               <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse shadow-[0_0_10px_purple]" />
               <span className="text-[9px] text-purple-400 font-black uppercase tracking-[0.4em]">Secure Access</span>
            </div>
            <h1 className="text-sm font-semibold text-white tracking-wide">{unitTitle}</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex flex-col items-end border-r border-white/10 pr-6">
            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Active Subscriber</span>
            <span className="text-xs text-gray-400">{user?.email}</span>
          </div>
          <button 
             onClick={() => router.back()}
             className="bg-red-500/10 hover:bg-red-600 hover:text-white text-red-500 text-[10px] font-bold px-5 py-2 rounded-lg transition-all border border-red-500/20"
          >
            EXIT
          </button>
        </div>
      </header>

      {/* CORE VIEWPORT */}
      <div className="flex-1 relative overflow-x-hidden">
        <PdfViewer fileUrl={pdfUrl} userIdentifier={user?.email || "ENCRYPTED_USER"} />
      </div>
    </main>
  );
}