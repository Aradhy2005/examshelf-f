"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { motion } from "framer-motion";

type Subject = {
  id: string;
  name: string;
  year: number;
  semester?: number | null;
  originalPrice?: number;
  salePrice?: number;
  pdfPath?: string;
};

export default function AdminSubjectsPage() {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  // 🔐 admin guard
  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/login");
    else if (role !== "admin") router.replace("/");
  }, [user, role, loading, router]);

  const fetchSubjects = async () => {
    const snap = await getDocs(collection(db, "subjects"));
    setSubjects(
      snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Subject, "id">),
      }))
    );
  };

  useEffect(() => {
    if (role === "admin") fetchSubjects();
  }, [role]);

  const handleAddSubject = async () => {
    if (!id || !name || !year || !salePrice) {
      setError("Please fill required fields");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const subjectData: any = {
        name,
        university: "aktu",
        course: "btech",
        year: Number(year),
        semester: semester ? Number(semester) : null,
        originalPrice: originalPrice ? Number(originalPrice) : null,
        salePrice: Number(salePrice),
        price: Number(salePrice), // backward compatibility
        published: true,
        createdAt: serverTimestamp(),
      };

      // upload subject pdf (optional)
      if (pdfFile) {
        const storageRef = ref(storage, `subjects/${id}/${pdfFile.name}`);
        await uploadBytes(storageRef, pdfFile);
        subjectData.pdfPath = `subjects/${id}/${pdfFile.name}`;
      }

      await setDoc(doc(db, "subjects", id), subjectData);

      setId("");
      setName("");
      setYear("");
      setSemester("");
      setOriginalPrice("");
      setSalePrice("");
      setPdfFile(null);

      fetchSubjects();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  return (
    <main className="min-h-screen px-6 py-16 text-white relative overflow-hidden">

      {/* glow background */}
      <div className="absolute inset-0 -z-10 flex justify-center">
        <div className="w-[900px] h-[600px] bg-purple-600/10 blur-[140px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-bold mb-10">Subject Manager</h1>

        {/* ADD SUBJECT CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.05] border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-xl"
        >
          <h2 className="text-xl font-semibold mb-6">Add Subject</h2>

          {error && <p className="text-red-400 mb-4">{error}</p>}

          <div className="grid md:grid-cols-2 gap-4">
            <Input placeholder="Subject ID" value={id} onChange={setId} />
            <Input placeholder="Subject Name" value={name} onChange={setName} />
            <Input placeholder="Year (1-4)" value={year} onChange={setYear} />
            <Input placeholder="Semester (optional)" value={semester} onChange={setSemester} />
            <Input placeholder="Original Price" value={originalPrice} onChange={setOriginalPrice} />
            <Input placeholder="Sale Price" value={salePrice} onChange={setSalePrice} />
          </div>

          {/* PDF upload */}
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
            className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-sm mt-4"
          />

          {pdfFile && (
            <p className="text-green-400 text-xs mt-1">
              Selected: {pdfFile.name}
            </p>
          )}

          <button
            onClick={handleAddSubject}
            disabled={saving}
            className="mt-6 px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 font-medium shadow-lg hover:scale-[1.02] transition"
          >
            {saving ? "Saving..." : "Add Subject"}
          </button>
        </motion.div>

        {/* SUBJECT LIST */}
        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {subjects.map((sub, i) => (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-[#0f172a]/90 border border-white/10 rounded-2xl p-6 hover:border-purple-400/40 transition shadow-lg"
            >
              <h3 className="font-semibold text-lg text-purple-300">
                {sub.name}
              </h3>

              <p className="text-gray-400 text-sm mt-1">
                Year {sub.year}
                {sub.semester && ` • Sem ${sub.semester}`}
              </p>

              <div className="mt-3 flex items-center gap-2">
                {sub.originalPrice && (
                  <span className="line-through text-gray-500 text-sm">
                    ₹{sub.originalPrice}
                  </span>
                )}
                <span className="text-red-400 font-bold text-lg">
                  ₹{sub.salePrice}
                </span>
              </div>

              {sub.pdfPath && (
                <p className="text-green-400 text-xs mt-2">
                  Full Subject PDF ✓
                </p>
              )}

              <button
                onClick={() => router.push(`/admin/units/${sub.id}`)}
                className="mt-5 text-purple-400 hover:text-purple-300 text-sm"
              >
                Manage Units →
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}

function Input({ placeholder, value, onChange }: any) {
  return (
    <input
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  );
}
