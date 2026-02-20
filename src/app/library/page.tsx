"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";

type Subject = {
  id: string;
  name: string;
};

type Unit = {
  id: string;
  title: string;
  subjectId: string;
  unitNumber?: number;
};

export default function LibraryPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [subjectsMap, setSubjectsMap] = useState<Record<string, string>>({});
  const [unitsBySubject, setUnitsBySubject] = useState<Record<string, Unit[]>>({});
  const [checking, setChecking] = useState(true);
  const [lastOpened, setLastOpened] = useState<Unit | null>(null);
  const [streak, setStreak] = useState(1);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login?redirect=/library");
      return;
    }

    const fetchLibrary = async () => {
      const userSnap = await getDoc(doc(db, "users", user.uid));

      if (!userSnap.exists()) {
        setChecking(false);
        return;
      }

      const unlockedSubjects = userSnap.data().unlockedSubjects || [];
      const unlockedUnits = userSnap.data().unlockedUnits || [];
      const lastOpenedId = userSnap.data().lastOpenedUnit;

      const subjectSnap = await getDocs(collection(db, "subjects"));
      const unitSnap = await getDocs(collection(db, "units"));

      const subjects: Subject[] = subjectSnap.docs.map(d => ({
        id: d.id,
        ...(d.data() as Omit<Subject, "id">),
      }));

      const units: Unit[] = unitSnap.docs.map(d => ({
        id: d.id,
        ...(d.data() as Omit<Unit, "id">),
      }));

      const subjectMap: Record<string, string> = {};
      subjects.forEach(s => subjectMap[s.id] = s.name);

      const grouped: Record<string, Unit[]> = {};

      units.forEach(unit => {
        const unlocked =
          unlockedSubjects.includes(unit.subjectId) ||
          unlockedUnits.includes(unit.id);

        if (unlocked) {
          if (!grouped[unit.subjectId]) grouped[unit.subjectId] = [];
          grouped[unit.subjectId].push(unit);
        }
      });

      // ⭐ Resume Logic (smart)
      if (lastOpenedId) {
        const last = units.find(u => u.id === lastOpenedId);
        if (last) setLastOpened(last);
      } else if (unlockedUnits.length > 0) {
        const last = units.find(u => u.id === unlockedUnits.slice(-1)[0]);
        if (last) setLastOpened(last);
      }

      // ⭐ SMART DAILY STREAK LOGIC
const today = new Date();
const todayStr = today.toDateString();

const lastStudyDate = localStorage.getItem("lastStudyDate");
let currentStreak = Number(localStorage.getItem("streak") || 0);

if (!lastStudyDate) {
  // first study day ever
  currentStreak = 1;
} else {
  const lastDate = new Date(lastStudyDate);

  const diffDays = Math.floor(
    (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) {
    // already studied today → no change
  } else if (diffDays === 1) {
    // studied yesterday → continue streak
    currentStreak += 1;
  } else {
    // missed days → reset streak
    currentStreak = 1;
  }
}

localStorage.setItem("streak", String(currentStreak));
localStorage.setItem("lastStudyDate", todayStr);
setStreak(currentStreak);

      setSubjectsMap(subjectMap);
      setUnitsBySubject(grouped);
      setChecking(false);
    };

    fetchLibrary();
  }, [user, loading, router]);

  if (loading || checking) {
    return (
      <main className="min-h-screen flex items-center justify-center text-gray-400">
        Loading your library…
      </main>
    );
  }

  const subjectIds = Object.keys(unitsBySubject);

  return (
    <main className="min-h-screen px-6 py-24 text-white relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 -z-10 flex justify-center">
        <div className="w-[900px] h-[600px] bg-purple-600/10 blur-[140px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold">My Library</h1>
            <p className="text-gray-400 mt-2">
              Continue learning and track your progress.
            </p>
          </div>

          {/* 🔥 Streak Counter */}
          <div className="rounded-xl bg-purple-600/20 border border-purple-500/30 px-5 py-3 text-center">
            <div className="text-sm text-purple-300">Study Streak</div>
            <div className="text-xl font-bold">{streak} 🔥</div>
          </div>
        </div>

        {/* ⭐ Resume Card */}
        {lastOpened && (
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 rounded-3xl p-[1px] bg-gradient-to-r from-purple-500 to-indigo-500"
          >
            <div className="rounded-3xl bg-[#020617] p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">

              <div>
                <div className="text-purple-300 text-sm mb-1">
                  Continue Studying
                </div>

                <h3 className="text-xl font-semibold">
                  {subjectsMap[lastOpened.subjectId]}
                </h3>

                <p className="text-gray-400 text-sm mt-1">
                  Unit {lastOpened.unitNumber}: {lastOpened.title}
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push(`/units/${lastOpened.id}`)}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg hover:shadow-purple-500/40 transition"
              >
                Continue →
              </motion.button>
            </div>
          </motion.div>
        )}

        {subjectIds.length === 0 ? (
          <div className="text-center text-gray-400 mt-24">
            You haven’t unlocked anything yet.
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-10">
            {subjectIds.map((sid, i) => {
              const units = unitsBySubject[sid];

              return (
                <motion.div
                  key={sid}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-3xl bg-[#0f172a]/90 border border-white/10 p-8 shadow-lg hover:shadow-purple-500/20 transition duration-300"
                >
                  {/* Subject Header */}
                  <div className="flex items-start justify-between mb-6">
                    <h2 className="text-xl md:text-2xl font-semibold text-purple-300 leading-snug">
                      {subjectsMap[sid]}
                    </h2>

                    <button
                      onClick={() => router.push(`/subjects/${sid}`)}
                      className="text-sm text-purple-400 hover:text-purple-300"
                    >
                      Open →
                    </button>
                  </div>

                  {/* ⭐ Progress Ring */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative w-12 h-12">
                      <svg className="w-12 h-12 transform -rotate-90">
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          stroke="rgba(255,255,255,0.1)"
                          strokeWidth="4"
                          fill="none"
                        />
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          stroke="url(#grad)"
                          strokeWidth="4"
                          strokeDasharray={126}
                          strokeDashoffset={20}
                          fill="none"
                        />
                        <defs>
                          <linearGradient id="grad">
                            <stop offset="0%" stopColor="#a855f7" />
                            <stop offset="100%" stopColor="#6366f1" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>

                    <div className="text-sm text-gray-400">
                      {units.length} units unlocked
                    </div>
                  </div>

                  {/* Units */}
                  <div className="space-y-3">
                    {units.map((unit) => (
                      <motion.div
                        key={unit.id}
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center justify-between rounded-xl bg-[#020617]/80 border border-white/10 px-4 py-4 hover:border-purple-400/40 transition"
                      >
                        <div>
                          <p className="text-xs text-gray-400">
                            Unit {unit.unitNumber}
                          </p>
                          <p className="font-medium">
                            {unit.title}
                          </p>
                        </div>

                        <button
                          onClick={() => router.push(`/units/${unit.id}`)}
                          className="text-green-400 text-sm font-medium"
                        >
                          ✓ Open
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
