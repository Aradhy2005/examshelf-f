import { MetadataRoute } from "next";

const PROJECT_ID = "examshelf-71b78";

async function getBlogs() {
  const res = await fetch(
    `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/blogs`,
    { next: { revalidate: 3600 } } // cache 1 hour
  );

  if (!res.ok) return [];

  const data = await res.json();
  if (!data.documents) return [];

  return data.documents
    .map((doc: any) => {
      const fields = doc.fields;

      const slug = doc.name.split("/").pop();
      const published = fields?.published?.booleanValue;

      return published ? slug : null;
    })
    .filter(Boolean);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.examshelf.in";

  const blogSlugs = await getBlogs();

  const blogUrls = blogSlugs.map((slug: string) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/subjects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...blogUrls,
  ];
}