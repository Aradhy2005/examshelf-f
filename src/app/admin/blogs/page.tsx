"use client";

import { useState } from "react";
import { db, storage } from "@/lib/firebase";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function AdminBlogsPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [unitId, setUnitId] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [previewFiles, setPreviewFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const uploadImage = async (file: File, path: string) => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  // Auto-generate slug
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleSubmit = async () => {
    if (!title || !slug || !content) return;

    setLoading(true);
    setSuccess("");

    try {
      let coverUrl = "";
      if (coverFile) {
        coverUrl = await uploadImage(
          coverFile,
          `blogs/${slug}/cover.jpg`
        );
      }

      const previewUrls: string[] = [];

      for (const file of previewFiles) {
        const url = await uploadImage(
          file,
          `blogs/${slug}/${file.name}`
        );
        previewUrls.push(url);
      }

      await setDoc(doc(collection(db, "blogs"), slug), {
        title,
        slug,
        excerpt,
        content,
        coverImage: coverUrl,
        previewImages: previewUrls,
        subjectId,
        unitId,
        published: true,
        createdAt: serverTimestamp(),
      });

      setSuccess("✅ Blog published successfully!");
      setTitle("");
      setSlug("");
      setExcerpt("");
      setContent("");
      setSubjectId("");
      setUnitId("");
      setCoverFile(null);
      setPreviewFiles([]);

    } catch (error) {
      console.error(error);
      setSuccess("❌ Error publishing blog");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen px-6 py-12 text-white bg-gradient-to-b from-[#0a0a0a] to-black">
      <div className="max-w-3xl mx-auto bg-white/5 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/10">

        <h1 className="text-3xl font-bold mb-1">📝 Create Blog</h1>
        <p className="text-gray-400 mb-6">
          Write exam guides, important questions & preparation tips.
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
          placeholder="Most Important OOPS Concepts"
        />

        {/* SLUG */}
        <label className="label mt-4">Slug</label>
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="input"
          placeholder="aktu-oops-important-concepts"
        />

        {/* EXCERPT */}
        <label className="label mt-4">Excerpt</label>
        <input
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className="input"
          placeholder="Short description shown in blog preview"
        />

        {/* SUBJECT */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="label">Subject ID</label>
            <input
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="input"
              placeholder="oops"
            />
          </div>

          <div>
            <label className="label">Unit ID (optional)</label>
            <input
              value={unitId}
              onChange={(e) => setUnitId(e.target.value)}
              className="input"
              placeholder="unit-1"
            />
          </div>
        </div>

        {/* CONTENT */}
        <label className="label mt-6">Blog Content (Markdown)</label>
        <textarea
          rows={12}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="input font-mono text-sm"
          placeholder={`## Why OOPS is Important

Object Oriented Programming is one of the most important subjects.

### Important Concepts
- Encapsulation
- Inheritance
- Polymorphism

### 🔓 Want Full Notes?
Unlock full unit on ExamShelf.
`}
        />

        {/* COVER IMAGE */}
        <label className="label mt-6">Cover Image</label>
        <input
          type="file"
          onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
          className="file-input"
        />

        {/* PREVIEW IMAGES */}
        <label className="label mt-4">Preview Images</label>
        <input
          type="file"
          multiple
          onChange={(e) =>
            setPreviewFiles(Array.from(e.target.files || []))
          }
          className="file-input"
        />

        {/* BUTTON */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-8 bg-gradient-to-r from-purple-600 to-indigo-600 py-3 rounded-xl font-semibold text-lg hover:opacity-90 transition"
        >
          {loading ? "Publishing..." : "Publish Blog"}
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
