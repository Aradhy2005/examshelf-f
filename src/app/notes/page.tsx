import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import Link from "next/link";

type Note = {
  title: string;
  slug: string;
  description?: string;
  university?: string;
};

async function getNotes(): Promise<Note[]> {
  const q = query(collection(db, "notes"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((doc) => doc.data() as Note);
}

export default async function NotesPage() {
  const notes = await getNotes();

  return (
    <main className="min-h-screen px-6 py-20 text-white max-w-6xl mx-auto">

      {/* HERO SECTION */}
      <div className="max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Free University Notes
        </h1>

        <p className="text-gray-400 text-lg mb-12">
          High-quality structured notes, important questions and exam resources —
          completely free. More universities coming soon.
        </p>
      </div>

      {/* EMPTY STATE */}
      {notes.length === 0 && (
        <div className="bg-white/5 border border-white/10 p-10 rounded-2xl text-center">
          <p className="text-gray-400 text-lg">
            🚀 Free notes coming soon. Stay tuned.
          </p>
        </div>
      )}

      {/* NOTES GRID */}
      <div className="grid md:grid-cols-3 gap-8">
        {notes.map((note) => (
          <Link key={note.slug} href={`/notes/${note.slug}`}>
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 hover:scale-[1.02] transition-all duration-300 cursor-pointer group">

              <div className="mb-3 text-sm text-purple-400 font-medium">
                {note.university || "University"}
              </div>

              <h2 className="font-semibold text-lg group-hover:text-purple-300 transition">
                {note.title}
              </h2>

              {note.description && (
                <p className="text-sm text-gray-400 mt-3">
                  {note.description}
                </p>
              )}

              <div className="mt-5 text-sm text-indigo-400 font-medium">
                View Details →
              </div>

            </div>
          </Link>
        ))}
      </div>

    </main>
  );
}