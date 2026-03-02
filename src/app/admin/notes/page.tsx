"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function AdminNotesPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [university, setUniversity] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [content, setContent] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  // Auto slug generator
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleSubmit = async () => {
    if (!title || !slug || !pdfUrl) {
      setSuccess("❌ Title, Slug and PDF URL required");
      return;
    }

    setLoading(true);
    setSuccess("");

    try {
      await setDoc(doc(db, "notes", slug), {
        title,
        slug,
        description,
        university,
        subjectId,
        youtubeUrl,
        content,
        pdfUrl,
        createdAt: serverTimestamp(),
        published: true,
      });

      setSuccess("✅ Note added successfully!");

      setTitle("");
      setSlug("");
      setDescription("");
      setUniversity("");
      setSubjectId("");
      setYoutubeUrl("");
      setContent("");
      setPdfUrl("");
    } catch (error) {
      console.error(error);
      setSuccess("❌ Error adding note");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen px-6 py-12 text-white bg-gradient-to-b from-[#0a0a0a] to-black">
      <div className="max-w-3xl mx-auto bg-white/5 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/10">

        <h1 className="text-3xl font-bold mb-2">📘 Add Free Note</h1>
        <p className="text-gray-400 mb-6">
          Add structured free notes with SEO content + Drive link.
        </p>

        {/* TITLE */}
        <label className="label">Title</label>
        <input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setSlug(generateSlug(e.target.value));
          }}
          className="input"
          placeholder="AKTU OOPS Unit 1 Notes"
        />

        {/* SLUG */}
        <label className="label mt-4">Slug</label>
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="input"
          placeholder="aktu-oops-unit-1-notes"
        />

        {/* UNIVERSITY */}
        <label className="label mt-4">University</label>
        <input
          value={university}
          onChange={(e) => setUniversity(e.target.value)}
          className="input"
          placeholder="AKTU / DU / VTU"
        />

        {/* SUBJECT ID (for linking premium notes) */}
        <label className="label mt-4">Subject ID (optional)</label>
        <input
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
          className="input"
          placeholder="oops"
        />

        {/* YOUTUBE LINK */}
        <label className="label mt-4">YouTube Video Link (optional)</label>
        <input
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          className="input"
          placeholder="https://youtube.com/watch?v=..."
        />

        {/* DESCRIPTION */}
        <label className="label mt-4">Short Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input"
          rows={3}
          placeholder="Short intro shown at top"
        />

        {/* LONG CONTENT (SEO SECTION) */}
        <label className="label mt-6">Full Content (Markdown)</label>
        <textarea
          rows={14}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="input font-mono text-sm"
          placeholder={`## Introduction

Explain full unit here...

### Important Topics
- Encapsulation
- Inheritance
- Polymorphism

### Frequently Asked Questions
Answer here...
`}
        />

        {/* PDF URL */}
        <label className="label mt-6">Google Drive PDF Link</label>
        <input
          value={pdfUrl}
          onChange={(e) => setPdfUrl(e.target.value)}
          className="input"
          placeholder="https://drive.google.com/..."
        />

        {/* BUTTON */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-8 bg-gradient-to-r from-purple-600 to-indigo-600 py-3 rounded-xl font-semibold text-lg hover:opacity-90 transition"
        >
          {loading ? "Adding..." : "Add Note"}
        </button>

        {success && (
          <p className="mt-4 text-center text-sm text-green-400">
            {success}
          </p>
        )}

      </div>
    </main>
  );
}