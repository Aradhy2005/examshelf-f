"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { db, storage } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { motion } from "framer-motion";

export default function AdminUnitsPage() {

  /* ✅ SAFE PARAM ACCESS (prevents crash) */
  const params = useParams();
  const subjectId = params?.subjectId as string;

  const [unitNumber, setUnitNumber] = useState("");
  const [title, setTitle] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [units, setUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewSlug, setPreviewSlug] = useState("");


  /* ================= FETCH UNITS ================= */
  const fetchUnits = async () => {
    if (!subjectId) return;

    const q = query(
      collection(db, "units"),
      where("subjectId", "==", subjectId)
    );

    const snap = await getDocs(q);

    setUnits(
      snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }))
    );

    setLoading(false);
  };

  useEffect(() => {
    if (!subjectId) return;   // 🛑 prevents crash
    fetchUnits();
  }, [subjectId]);

  /* ================= ADD UNIT ================= */
  const addUnit = async () => {
    if (!unitNumber || !title || !salePrice) return;

    const id = `${subjectId}-unit-${unitNumber}`;

    // create unit doc
    await setDoc(doc(db, "units", id), {
      subjectId,
      unitNumber: Number(unitNumber),
      title,
      previewSlug: previewSlug || null, 
      originalPrice: originalPrice ? Number(originalPrice) : null,
      salePrice: Number(salePrice),
      price: Number(salePrice), // backward compatibility
      published: true,
    });

    // upload pdf
    if (pdfFile) {
      const storageRef = ref(storage, `units/${id}/${pdfFile.name}`);
      await uploadBytes(storageRef, pdfFile);

      await setDoc(
        doc(db, "units", id),
        { pdfPath: `units/${id}/${pdfFile.name}` },
        { merge: true }
      );
    }

    // reset
    setUnitNumber("");
    setTitle("");
    setOriginalPrice("");
    setSalePrice("");
    setPdfFile(null);
    setPreviewSlug("");


    fetchUnits();
  };

  if (!subjectId) {
    return <p className="p-10 text-white">Loading…</p>;
  }

  if (loading) {
    return <p className="p-10 text-white">Loading units…</p>;
  }

  return (
    <main className="min-h-screen px-6 py-16 text-white relative overflow-hidden">

      {/* background glow */}
      <div className="absolute inset-0 -z-10 flex justify-center">
        <div className="w-[900px] h-[600px] bg-purple-600/10 blur-[140px] rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold mb-8">
          Units — <span className="text-purple-300">{subjectId}</span>
        </h1>

        {/* ===== ADD UNIT CARD ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.05] border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-xl"
        >
          <h2 className="text-lg font-semibold mb-6">Add Unit</h2>

          <div className="grid gap-4">

            <Input
              placeholder="Unit Number"
              value={unitNumber}
              onChange={setUnitNumber}
            />

            <input
            placeholder="Preview Slug (optional)"
             value={previewSlug}
             onChange={(e) => setPreviewSlug(e.target.value)}
             className="input"
            />


            <Input
              placeholder="Title"
              value={title}
              onChange={setTitle}
            />

            <Input
              placeholder="Original Price (optional)"
              value={originalPrice}
              onChange={setOriginalPrice}
            />

            <Input
              placeholder="Sale Price"
              value={salePrice}
              onChange={setSalePrice}
            />

            <input
              type="file"
              accept="application/pdf"
              onChange={(e) =>
                setPdfFile(e.target.files?.[0] || null)
              }
              className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-sm"
            />
          </div>

          <button
            onClick={addUnit}
            className="mt-6 px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg hover:scale-[1.02] transition"
          >
            Add Unit
          </button>
        </motion.div>

        {/* ===== UNIT LIST ===== */}
        <div className="mt-10 space-y-4">
          {units.map((u) => (
            <div
              key={u.id}
              className="bg-[#020617]/80 border border-white/10 rounded-xl p-4"
            >
              <p className="font-medium">
                Unit {u.unitNumber}: {u.title}
              </p>

              <div className="flex gap-2 text-sm mt-1">
                {u.originalPrice && (
                  <span className="line-through text-gray-500">
                    ₹{u.originalPrice}
                  </span>
                )}
                <span className="text-red-400 font-semibold">
                  ₹{u.salePrice ?? u.price}
                </span>
              </div>

              {u.pdfPath && (
                <p className="text-green-400 text-xs mt-1">
                  PDF uploaded
                </p>
              )}
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}

/* reusable input */
function Input({
  placeholder,
  value,
  onChange,
}: any) {
  return (
    <input
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  );
}
