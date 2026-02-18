"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

export default function LatestBlogs() {
  const [blogs, setBlogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const snap = await getDocs(collection(db, "blogs"));
      setBlogs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetchBlogs();
  }, []);

  return (
    <section className="mt-40 max-w-6xl mx-auto px-6">
      <h2 className="text-3xl font-semibold mb-10">Latest Articles</h2>

      <div className="grid md:grid-cols-3 gap-8">
        {blogs.map(blog => (
          <Link key={blog.id} href={`/blog/${blog.slug}`}>
            <div className="bg-white/5 p-6 rounded-2xl hover:border-purple-500/40 border border-white/10 transition">
              <h3 className="font-semibold">{blog.title}</h3>
              <p className="text-sm text-gray-400 mt-2">{blog.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
