import Link from "next/link";

// 🔹 Replace with your Firebase Project ID
const PROJECT_ID = "examshelf-71b78";

// 🔹 Fetch blogs (server-side for SEO)
async function getBlogs() {
  const res = await fetch(
    `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/blogs`,
    { next: { revalidate: 60 } } // cache for speed
  );

  if (!res.ok) return [];

  const data = await res.json();

  if (!data.documents) return [];

  return data.documents.map((doc: any) => {
    const fields = doc.fields;

    const blog = Object.fromEntries(
      Object.entries(fields).map(([key, value]: any) => [
        key,
        Object.values(value)[0],
      ])
    );

    return blog;
  });
}

// ✅ SEO Metadata
export const metadata = {
  title: "Exam Tips & Guides",
  description:
    "Explore exam preparation tips, study strategies, and university notes guides to help you score better in your exams.",
};

export default async function BlogPage() {
  const blogs = await getBlogs();

  return (
    <main className="min-h-screen px-6 py-20 text-white max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-10">Exam Tips & Guides</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {blogs.map((blog: any) => (
          <Link key={blog.slug} href={`/blog/${blog.slug}`}>
            <article className="bg-white/5 p-5 rounded-xl hover:bg-white/10 transition">

              {blog.coverImage && (
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  className="rounded-lg mb-3"
                />
              )}

              <h2 className="font-semibold text-lg">
                {blog.title}
              </h2>

              <p className="text-sm text-gray-400 mt-2">
                {blog.excerpt}
              </p>

            </article>
          </Link>
        ))}
      </div>
    </main>
  );
}