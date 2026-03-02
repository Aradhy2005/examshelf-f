"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import Link from "next/link";

export default function ManageNotesPage() {
  const [notes, setNotes] = useState<any[]>([]);

  const loadNotes = async () => {
    const snap = await getDocs(collection(db, "notes"));
    setNotes(snap.docs.map((d) => d.data()));
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return;

    await deleteDoc(doc(db, "notes", slug));
    loadNotes();
  };

  useEffect(() => {
    loadNotes();
  }, []);

  return (
    <main className="min-h-screen px-6 py-16 text-white max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-10">Manage Notes</h1>

      <div className="space-y-6">
        {notes.map((note) => (
          <div
            key={note.slug}
            className="bg-white/5 border border-white/10 p-6 rounded-xl flex justify-between items-center"
          >
            <div>
              <h2 className="text-xl font-semibold">{note.title}</h2>
              <p className="text-gray-400 text-sm">{note.slug}</p>
            </div>

            <div className="flex gap-4">
              <Link
                href={`/admin/notes/edit/${note.slug}`}
                className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-500"
              >
                Edit
              </Link>

              <button
                onClick={() => handleDelete(note.slug)}
                className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}