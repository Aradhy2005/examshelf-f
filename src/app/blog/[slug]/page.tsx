import ReactMarkdown from "react-markdown";
import Image from "next/image";
import Link from "next/link";

const PROJECT_ID = "examshelf-71b78";

/* ============================= */
/* 🔹 FIRESTORE PARSER (IMPORTANT) */
/* ============================= */
const parseValue = (value: any): any => {
  if (value.stringValue) return value.stringValue;
  if (value.integerValue) return Number(value.integerValue);
  if (value.doubleValue) return value.doubleValue;
  if (value.booleanValue !== undefined) return value.booleanValue;
  if (value.timestampValue) return value.timestampValue;

  if (value.arrayValue?.values) {
    return value.arrayValue.values.map(parseValue);
  }

  if (value.mapValue?.fields) {
    return Object.fromEntries(
      Object.entries(value.mapValue.fields).map(([k, v]) => [k, parseValue(v)])
    );
  }

  return null;
};

/* ============================= */
/* 🔹 FETCH BLOG */
/* ============================= */
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
      parseValue(value),
    ])
  );

  return blog;
}

/* ============================= */
/* 🔹 SEO METADATA */
/* ============================= */
export async function generateMetadata({ params }: any) {
  const { slug } = await params;

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
      canonical: `https://www.examshelf.in/blog/${slug}`,
    },
  };
}

/* ============================= */
/* 🔹 BLOG PAGE */
/* ============================= */
export default async function BlogPage({ params }: any) {
  const { slug } = await params;

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

      {/* Cover Image */}
      {blog.coverImage && (
        <Image
          src={blog.coverImage}
          alt={blog.title}
          width={1200}
          height={630}
          className="rounded-2xl mb-8"
        />
      )}

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold leading-tight">
        {blog.title}
      </h1>

      {/* Excerpt */}
      <p className="text-gray-400 mt-4">{blog.excerpt}</p>

      {/* Video */}
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

      {/* Markdown Content */}
      <article className="blog-content prose prose-invert max-w-none">
        <ReactMarkdown>{blog.content}</ReactMarkdown>
      </article>

      {/* ✅ PREVIEW IMAGES */}
      {blog.previewImages?.length > 0 && (
        <div className="mt-12 space-y-4">
          <h2 className="text-2xl font-semibold">Preview Notes</h2>
          {blog.previewImages.map((img: string, i: number) => (
            <Image
              key={i}
              src={img}
              alt="Preview"
              width={900}
              height={600}
              className="rounded-xl"
            />
          ))}
        </div>
      )}

      {/* ✅ DOWNLOAD BUTTON AUTO */}
      {blog.unitId && blog.subjectId && (
  <a
    href={`/subjects/${blog.subjectId}`}
    className="block mt-14 text-center bg-gradient-to-r from-purple-600 to-indigo-600 py-4 rounded-xl text-lg font-semibold hover:opacity-90 transition shadow-lg"
  >
    📥 Download Full Notes PDF
  </a>
)}

    </main>
  );
}