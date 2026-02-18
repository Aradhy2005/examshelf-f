import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import ReactMarkdown from "react-markdown";

export default async function BlogPage({ params }: any) {
  const { slug } = await params;

  const snap = await getDoc(doc(db, "blogs", slug));

  if (!snap.exists()) {
    return <div className="text-white p-10">Blog not found</div>;
  }

  const blog = snap.data();

  return (
    <main className="min-h-screen px-6 py-24 text-white max-w-3xl mx-auto">

      {blog.coverImage && (
        <img src={blog.coverImage} className="rounded-2xl mb-8" />
      )}

      <h1 className="text-4xl md:text-5xl font-bold leading-tight">
        {blog.title}
      </h1>

      <p className="text-gray-400 mt-4">{blog.excerpt}</p>

      <hr className="border-white/10 my-8" />

      {/* MARKDOWN CONTENT */}
      <article className="blog-content">
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
