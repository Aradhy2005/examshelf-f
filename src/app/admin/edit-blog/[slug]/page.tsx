"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter, useParams } from "next/navigation";

export default function EditBlog() {
  const params = useParams();
  const slug = params.slug as string;

  const router = useRouter();
  const [blog, setBlog] = useState<any>(null);

  useEffect(() => {
    const loadBlog = async () => {
      const snap = await getDoc(doc(db, "blogs", slug));
      if (snap.exists()) setBlog(snap.data());
    };
    if (slug) loadBlog();
  }, [slug]);

  const saveChanges = async () => {
    await updateDoc(doc(db, "blogs", slug), blog);
    alert("Blog updated!");
    router.push(`/blog/${slug}`);
  };

  if (!blog) return <div className="text-white p-10">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto py-20 text-white">
      <h1 className="text-3xl font-bold mb-6">Edit Blog</h1>

      <input
        className="input mb-4"
        value={blog.title}
        onChange={(e) => setBlog({ ...blog, title: e.target.value })}
        placeholder="Title"
      />

      <input
        className="input mb-4"
        value={blog.excerpt}
        onChange={(e) => setBlog({ ...blog, excerpt: e.target.value })}
        placeholder="Excerpt"
      />

      <input
        className="input mb-4"
        value={blog.youtubeUrl || ""}
        placeholder="YouTube URL"
        onChange={(e) =>
          setBlog({ ...blog, youtubeUrl: e.target.value })
        }
      />

      <textarea
        className="input mb-4"
        rows={10}
        value={blog.content}
        onChange={(e) => setBlog({ ...blog, content: e.target.value })}
      />

      <button
        onClick={saveChanges}
        className="bg-purple-600 px-6 py-3 rounded-xl"
      >
        Save Changes
      </button>
    </div>
  );
}