"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    subjects: 0,
    units: 0,
    blogs: 0,
    notes: 0,
    users: 0,
  });

  const [recentBlogs, setRecentBlogs] = useState<any[]>([]);
  const [recentNotes, setRecentNotes] = useState<any[]>([]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const subjectsSnap = await getDocs(collection(db, "subjects"));
        const unitsSnap = await getDocs(collection(db, "units"));
        const blogsSnap = await getDocs(collection(db, "blogs"));
        const notesSnap = await getDocs(collection(db, "notes"));
        const usersSnap = await getDocs(collection(db, "users"));

        setStats({
          subjects: subjectsSnap.size,
          units: unitsSnap.size,
          blogs: blogsSnap.size,
          notes: notesSnap.size,
          users: usersSnap.size,
        });

        // Recent blogs
        const blogQuery = query(
          collection(db, "blogs"),
          orderBy("createdAt", "desc"),
          limit(5)
        );
        const blogRecentSnap = await getDocs(blogQuery);
        setRecentBlogs(blogRecentSnap.docs.map(doc => doc.data()));

        // Recent notes
        const notesQuery = query(
          collection(db, "notes"),
          orderBy("createdAt", "desc"),
          limit(5)
        );
        const notesRecentSnap = await getDocs(notesQuery);
        setRecentNotes(notesRecentSnap.docs.map(doc => doc.data()));

      } catch (error) {
        console.error("Dashboard error:", error);
      }
    };

    loadStats();
  }, []);

  return (
    <main className="min-h-screen px-6 py-16 text-white">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold mb-10">Admin Dashboard</h1>

        {/* QUICK ACTIONS */}
        <div className="flex flex-wrap gap-4 mb-10">
          <Link href="/admin/subjects">
            <button className="px-6 py-3 bg-purple-600 rounded-xl font-semibold hover:bg-purple-500">
              ➕ Add Subject
            </button>
          </Link>

          <Link href="/admin/blogs">
            <button className="px-6 py-3 bg-indigo-600 rounded-xl font-semibold hover:bg-indigo-500">
              ✍️ Add Blog
            </button>
          </Link>

          <Link href="/admin/notes">
            <button className="px-6 py-3 bg-emerald-600 rounded-xl font-semibold hover:bg-emerald-500">
              📘 Add Note
            </button>
          </Link>

          <Link href="/admin/notes/manage">
  <button className="px-6 py-3 bg-gray-700 rounded-xl font-semibold hover:bg-gray-600">
    ⚙ Manage Notes
  </button>
</Link>
        </div>

        {/* CORE STATS */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <StatCard title="Subjects" value={stats.subjects} />
          <StatCard title="Units" value={stats.units} />
          <StatCard title="Blogs" value={stats.blogs} />
          <StatCard title="Notes" value={stats.notes} />
          <StatCard title="Users" value={stats.users} />
        </div>

        {/* RECENT BLOGS */}
        <Section title="Recent Blogs">
          {recentBlogs.length === 0
            ? "No blogs yet"
            : recentBlogs.map((blog, i) => (
                <Row key={i} label={blog.title} />
              ))}
        </Section>

        {/* RECENT NOTES */}
        <Section title="Recent Notes">
          {recentNotes.length === 0
            ? "No notes yet"
            : recentNotes.map((note, i) => (
                <Row key={i} label={note.title} />
              ))}
        </Section>

      </div>
    </main>
  );
}

function StatCard({ title, value }: any) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
      <p className="text-gray-400 text-sm">{title}</p>
      <h2 className="text-3xl font-bold mt-2">{value}</h2>
    </div>
  );
}

function Section({ title, children }: any) {
  return (
    <div className="mb-12">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="space-y-2 text-gray-300 text-sm">{children}</div>
    </div>
  );
}

function Row({ label }: any) {
  return (
    <div className="py-2 border-b border-white/10">
      {label}
    </div>
  );
}