import ReactMarkdown from "react-markdown";

const PROJECT_ID = "examshelf-71b78";

// 🔹 Fetch blog using Firestore REST API
async function getBlog(slug: string) {
  const res = await fetch(
    `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/blogs/${slug}`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) return null;

  const data = await res.json();
  if (!data.fields) return null;

  const blog = Object.fromEntries(
    Object.entries(data.fields).map(([key, value]: any) => [
      key,
      Object.values(value)[0],
    ])
  );

  return blog;
}

// 🔹 SEO Metadata
export async function generateMetadata({ params }: any) {
  const { slug } = await params;   // ✅ FIX

  const blog = await getBlog(slug);
  if (!blog) return {};

  return {
    title: blog.title,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      type: "article",
      images: blog.coverImage ? [blog.coverImage] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.excerpt,
      images: blog.coverImage ? [blog.coverImage] : [],
    },
    alternates: {
      canonical: `https://examshelf.com/blog/${slug}`,
    },
  };
}

// 🔹 Blog Page
export default async function BlogPage({ params }: any) {
  const { slug } = await params;   // ✅ FIX

  const blog = await getBlog(slug);

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

    const videoId =
      url.split("v=")[1]?.split("&")[0] ||
      url.split("youtu.be/")[1];

    return `https://www.youtube.com/embed/${videoId}`;
  };

  return (
    <main className="min-h-screen px-6 py-24 text-white max-w-3xl mx-auto">

      {blog.coverImage && (
        <img src={blog.coverImage} className="rounded-2xl mb-8" />
      )}

      <h1 className="text-4xl md:text-5xl font-bold">
        {blog.title}
      </h1>

      <p className="text-gray-400 mt-4">{blog.excerpt}</p>

      {blog.youtubeUrl && (
        <div className="mt-8 aspect-video">
          <iframe
            className="w-full h-full rounded-xl"
            src={getEmbedUrl(blog.youtubeUrl)}
            allowFullScreen
          />
        </div>
      )}

      <hr className="border-white/10 my-8" />

      <article className="blog-content prose prose-invert">
        <ReactMarkdown>{blog.content}</ReactMarkdown>
      </article>
    </main>
  );
}