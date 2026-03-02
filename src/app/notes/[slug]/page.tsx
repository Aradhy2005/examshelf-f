import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

export default async function NotesPage(props: any) {

  const params = await props.params; // ✅ IMPORTANT
  const slug = params?.slug;

  if (!slug) {
    return (
      <div className="min-h-screen text-white p-10">
        Invalid note URL
      </div>
    );
  }

  const snap = await getDoc(doc(db, "notes", slug));

  if (!snap.exists()) {
    return (
      <div className="min-h-screen text-white p-10">
        Notes not found
      </div>
    );
  }

  const note = snap.data();

  return (
    <main className="min-h-screen px-6 py-24 text-white max-w-4xl mx-auto">

      <h1 className="text-4xl md:text-5xl font-bold">
        {note.title}
      </h1>

      {note.description && (
        <p className="text-gray-400 mt-4 text-lg">
          {note.description}
        </p>
      )}

      <article className="blog-content mt-10">
        <ReactMarkdown>{note.content}</ReactMarkdown>
      </article>

      <div className="mt-16 bg-white/5 p-8 rounded-2xl">
        <h2 className="text-2xl font-semibold mb-6">
          Related Resources
        </h2>

        <Link href="/notes" className="block text-purple-400 hover:underline">
          ➜ Explore More Free Notes
        </Link>

        <Link href="/blog" className="block text-purple-400 hover:underline">
          ➜ Read Detailed Exam Guides
        </Link>

        <Link href="/subjects" className="block text-purple-400 hover:underline">
          ➜ Get Structured Premium Notes
        </Link>
      </div>

      {note.pdfUrl && (
        <a
          href={note.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-16 text-center bg-gradient-to-r 
          from-purple-600 to-indigo-600 
          py-4 rounded-xl text-lg font-semibold"
        >
          📥 Download Free PDF
        </a>
      )}
    </main>
  );
}