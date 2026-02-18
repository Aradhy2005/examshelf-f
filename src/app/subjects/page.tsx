"use client";

import { useEffect, useState, useMemo, Suspense } from "react"; // Added Suspense
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; 
import { 
  BookOpen, Search, Filter, Sparkles, 
  ArrowUpRight, ShieldCheck, Zap, Layers 
} from "lucide-react";

// --- Types ---
type Subject = {
  id: string;
  name: string;
  university: string;
  course: string;
  semester?: number | null;
  salePrice?: number;
  price?: number;
};

type Unit = {
  id: string;
  subjectId: string;
  price: number;
};

// 1. Move all your logic into this Content component
function SubjectsContent() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [allUnits, setAllUnits] = useState<Unit[]>([]);
  const [unlockedUnits, setUnlockedUnits] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [semesterFilter, setSemesterFilter] = useState<string>("all");
  
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const selectedYear = searchParams.get("year");

  const yearSemesters: Record<string, number[]> = {
    "1": [1, 2], "2": [3, 4], "3": [5, 6], "4": [7, 8],
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const qSub = query(collection(db, "subjects"), where("published", "==", true));
        const snapSub = await getDocs(qSub);
        const subList = snapSub.docs.map(doc => ({ id: doc.id, ...doc.data() } as Subject));
        
        const snapUnits = await getDocs(collection(db, "units"));
        const unitList = snapUnits.docs.map(doc => ({ id: doc.id, ...doc.data() } as Unit));

        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUnlockedUnits(userDoc.data().unlockedUnits || []);
          }
        }

        setSubjects(subList);
        setAllUnits(unitList);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const filteredSubjects = useMemo(() => {
    return subjects.filter((sub) => {
      const matchesSearch = sub.name.toLowerCase().includes(search.toLowerCase());
      const matchesSemester = semesterFilter === "all" || sub.semester?.toString() === semesterFilter;
      const matchesYear = !selectedYear || yearSemesters[selectedYear]?.includes(sub.semester || 0);
      return matchesSearch && matchesSemester && matchesYear;
    });
  }, [subjects, search, semesterFilter, selectedYear]);

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-32">
      <header className="max-w-3xl mb-16 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-[0.2em] uppercase text-purple-400">
          <Zap size={10} className="fill-current" /> Active Curriculum 2026
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]">Curated <span className="text-gray-500">Subjects</span></h1>
        <p className="text-lg text-gray-400 font-medium leading-relaxed">Engineered for high-performance students. Access verified units and notes.</p>
      </header>

      <div className="sticky top-6 z-50 mb-12">
        <div className="bg-[#0d1117]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-2 shadow-2xl flex flex-col md:flex-row items-center gap-2">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={18} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search index..." className="w-full bg-transparent border-0 py-4 pl-12 pr-4 text-sm focus:ring-0 placeholder:text-gray-600" />
          </div>
          <div className="h-6 w-px bg-white/10 hidden md:block" />
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {filteredSubjects.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center text-gray-500 font-mono">[SYSTEM_ERROR]: No records found.</motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubjects.map((sub, i) => (
              <SubjectCard 
                key={sub.id} 
                sub={sub} 
                index={i} 
                allUnits={allUnits} 
                unlockedUnits={unlockedUnits} 
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <footer className="mt-32 p-1 border-t border-white/5 pt-20">
        <div className="bg-gradient-to-b from-white/[0.03] to-transparent rounded-[3rem] border border-white/10 p-12 text-center overflow-hidden relative">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-purple-500/10 blur-[100px]" />
          <h2 className="text-3xl font-bold mb-4 tracking-tight">Request Missing Intel</h2>
          <p className="text-gray-500 max-w-md mx-auto mb-10">Don't see your subject? Our content team can prioritize your university curriculum within 48 hours.</p>
          <Link href="/request" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-all">Request Subject <ArrowUpRight size={18} /></Link>
        </div>
      </footer>
    </div>
  );
}

// 2. THE MAIN PAGE EXPORT WITH SUSPENSE
export default function SubjectsPage() {
  return (
    <main className="relative min-h-screen bg-[#02040a] text-white selection:bg-purple-500/30">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px]" />
      </div>

      <Suspense fallback={<LoadingSkeleton />}>
        <SubjectsContent />
      </Suspense>
    </main>
  );
}

// --- Keep SubjectCard and Sub-components as they were ---
function SubjectCard({ sub, index, allUnits, unlockedUnits }: { sub: Subject, index: number, allUnits: Unit[], unlockedUnits: string[] }) {
  const dynamicPrice = useMemo(() => {
    const basePrice = sub.salePrice ?? sub.price ?? 0;
    const purchasedUnitsForThisSubject = allUnits.filter(unit => 
      unit.subjectId === sub.id && unlockedUnits.includes(unit.id)
    );
    const alreadyPaidAmount = purchasedUnitsForThisSubject.reduce((sum, unit) => sum + (unit.price || 0), 0);
    return Math.max(basePrice - alreadyPaidAmount, 0);
  }, [sub, allUnits, unlockedUnits]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      className="group relative flex flex-col bg-[#0d1117] border border-white/5 rounded-[2rem] p-8 transition-all hover:border-purple-500/50 hover:shadow-[0_0_40px_rgba(168,85,247,0.15)] overflow-hidden"
    >
      <div className="flex justify-between items-start mb-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20 w-fit">
            <ShieldCheck size={10} /> VERIFIED
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white leading-tight">{sub.name}</h2>
        </div>
        <div className="p-3 bg-white/5 rounded-2xl border border-white/10 group-hover:bg-purple-500 group-hover:text-white transition-colors">
          <Layers size={20} />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-10">
        <Badge text={sub.university} />
        <Badge text={sub.course} />
        {sub.semester && <Badge text={`Sem ${sub.semester}`} highlight />}
      </div>

      <div className="space-y-3 mb-10">
        <FeatureItem text="5 Comprehensive Units" />
        <FeatureItem text="PYQ Pattern Analysis" />
      </div>

      <div className="mt-auto flex items-end justify-between border-t border-white/5 pt-6">
        <div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
            {dynamicPrice === 0 ? "Full Access Unlocked" : "Remaining for Full Pass"}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white tracking-tighter">
              ₹{dynamicPrice}
            </span>
            {dynamicPrice > 0 && <span className="text-[9px] font-bold text-purple-400 tracking-tighter uppercase">Dynamic Deduction</span>}
          </div>
        </div>
        
        <Link 
          href={`/subjects/${sub.id}`} 
          className="flex items-center justify-center w-12 h-12 rounded-full bg-white text-black hover:bg-purple-500 hover:text-white transition-all"
        >
          <ArrowUpRight size={20} />
        </Link>
      </div>
    </motion.div>
  );
}

function Badge({ text, highlight = false }: { text: string, highlight?: boolean }) {
  return (
    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border tracking-wide uppercase ${
      highlight 
      ? "bg-purple-500/10 border-purple-500/30 text-purple-400" 
      : "bg-white/5 border-white/10 text-gray-500"
    }`}>
      {text}
    </span>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
      <Sparkles size={12} className="text-purple-500" />
      {text}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#02040a] flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
      <span className="mt-6 text-[10px] font-bold tracking-[0.5em] text-gray-600 uppercase">Synchronizing Index</span>
    </div>
  );
}

// 3. FORCE DYNAMIC RENDER
export const dynamic = "force-dynamic";