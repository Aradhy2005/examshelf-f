"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";

export default function EditNotePage() {
  const { slug } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadNote = async () => {
      const snap = await getDoc(doc(db, "notes", slug as string));
      if (snap.exists()) {
        const data = snap.data();
        setTitle(data.title || "");
        setDescription(data.description || "");
        setContent(data.content || "");
        setPdfUrl(data.pdfUrl || "");
      }
    };

    loadNote();
  }, [slug]);

  const handleUpdate = async () => {
    setLoading(true);

    await updateDoc(doc(db, "notes", slug as string), {
      title,
      description,
      content,
      pdfUrl,
    });

    setLoading(false);
    router.push("/admin/notes/manage");
  };

  return (
    <main className="min-h-screen px-6 py-16 text-white max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-10">Edit Note</h1>

      <div className="space-y-6">

        <input
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />

        <textarea
          className="input"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />

        <textarea
          className="input font-mono"
          rows={12}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Markdown content"
        />

        <input
          className="input"
          value={pdfUrl}
          onChange={(e) => setPdfUrl(e.target.value)}
          placeholder="PDF URL"
        />

        <button
          onClick={handleUpdate}
          disabled={loading}
          className="px-6 py-3 bg-purple-600 rounded-xl"
        >
          {loading ? "Updating..." : "Update Note"}
        </button>
      </div>
    </main>
  );
}