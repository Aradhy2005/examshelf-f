"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";

export default function BlogPage() {
  const { slug } = useParams();

  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!slug) return;

      const snap = await getDoc(doc(db, "blogs", slug as string));

      if (snap.exists()) {
        setBlog(snap.data());
      }

      setLoading(false);
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="text-white p-10 text-center">
        Loading blog...
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-white p-10 text-center">
        Blog not found
      </div>
    );
  }

  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    if (url.includes("embed")) return url;

    const videoId = url.split("v=")[1]?.split("&")[0]
      || url.split("youtu.be/")[1];

    return `https://www.youtube.com/embed/${videoId}`;
  };

  return (
    <main className="min-h-screen px-6 py-24 text-white max-w-3xl mx-auto">

      {blog.coverImage && (
        <img src={blog.coverImage} className="rounded-2xl mb-8" />
      )}

      <h1 className="text-4xl md:text-5xl font-bold leading-tight">
        {blog.title}
      </h1>

      <p className="text-gray-400 mt-4">{blog.excerpt}</p>

      {/* 🎥 VIDEO */}
      {blog.youtubeUrl && (
        <div className="mt-8 aspect-video">
          <iframe
            className="w-full h-full rounded-xl"
            src={getEmbedUrl(blog.youtubeUrl)}
            title="YouTube video"
            allowFullScreen
          ></iframe>
        </div>
      )}

      <hr className="border-white/10 my-8" />

      {/* MARKDOWN */}
      <article className="blog-content prose prose-invert">
        <ReactMarkdown>{blog.content}</ReactMarkdown>
      </article>

      {/* PREVIEW IMAGES */}
      {blog.previewImages?.length > 0 && (
        <div className="mt-12 space-y-4">
          <h2 className="text-2xl font-semibold">Preview</h2>
          {blog.previewImages.map((img: string, i: number) => (
            <img key={i} src={img} className="rounded-xl" />
          ))}
        </div>
      )}

      {/* CTA */}
      {blog.subjectId && (
        <a
          href={`/subjects/${blog.subjectId}`}
          className="block mt-12 text-center bg-gradient-to-r from-purple-600 to-indigo-600 py-4 rounded-xl text-lg font-semibold hover:opacity-90 transition"
        >
          🔓 Unlock Full Notes →
        </a>
      )}

    </main>
  );
}