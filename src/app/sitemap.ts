import { MetadataRoute } from "next";

const PROJECT_ID = "examshelf-71b78";
const BASE_URL = "https://www.examshelf.in";

/* ---------- Generic Fetch Function ---------- */

async function getCollectionSlugs(collectionName: string) {
  const res = await fetch(
    `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${collectionName}`,
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

      return published !== false ? slug : null;
    })
    .filter(Boolean);
}

/* ---------- Sitemap ---------- */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogSlugs, noteSlugs, subjectSlugs] = await Promise.all([
    getCollectionSlugs("blogs"),
    getCollectionSlugs("notes"),
    getCollectionSlugs("subjects"),
  ]);

  const blogUrls = blogSlugs.map((slug: string) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const noteUrls = noteSlugs.map((slug: string) => ({
    url: `${BASE_URL}/notes/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const subjectUrls = subjectSlugs.map((slug: string) => ({
    url: `${BASE_URL}/subjects/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/subjects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/notes`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...blogUrls,
    ...noteUrls,
    ...subjectUrls,
  ];
}