import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import Link from "next/link";

async function getBlogs() {
  const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(doc => doc.data());
}

export default async function BlogPage() {
  const blogs: any[] = await getBlogs();

  return (
    <main className="min-h-screen px-6 py-20 text-white max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-10">Exam Tips & Guides</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {blogs.map(blog => (
          <Link key={blog.slug} href={`/blog/${blog.slug}`}>
            <div className="bg-white/5 p-5 rounded-xl hover:bg-white/10 transition">
              
              {blog.coverImage && (
                <img src={blog.coverImage} className="rounded-lg mb-3" />
              )}

              <h2 className="font-semibold text-lg">
                {blog.title}
              </h2>

              <p className="text-sm text-gray-400 mt-2">
                {blog.excerpt}
              </p>

            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
