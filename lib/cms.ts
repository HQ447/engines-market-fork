// lib/cms.ts

const RAW_CMS_URL = process.env.CMS_API_URL || "https://cms.enginefinders.co.uk";
const CMS_API_URL = RAW_CMS_URL.replace(/\/api\/v1\/?$/, "");
const CMS_SITE_SLUG = process.env.CMS_SITE_SLUG || "enginesmarket";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  html?: string;
  contentJson?: any;
  readingTimeMinutes: number;
  publishedAt: string;
  updatedAt?: string;
  seoMetadata?: {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    ogImage?: string;
    noIndex?: boolean;
    schemaType?: string;
    customSchemaJson?: string | Record<string, any>;
    featuredImage?: {
      url: string;
      altText?: string;
    };
  };
  jsonLd?: Record<string, any>;
  author?: {
    name: string;
    avatarUrl?: string;
  };
  categories?: Array<{ name: string; slug: string }>;
  tags?: Array<{ name: string; slug: string }>;
}

/**
 * Fetches paginated published blog posts for Engines Market
 */
export async function getBlogPosts(page = 1, limit = 12): Promise<{ items: BlogPost[]; total: number }> {
  try {
    const res = await fetch(
      `${CMS_API_URL}/api/v1/sites/${CMS_SITE_SLUG}/posts?page=${page}&limit=${limit}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.warn(`CMS API returned status ${res.status}`);
      return { items: [], total: 0 };
    }

    const data = await res.json();
    return { items: data.items || [], total: data.total || 0 };
  } catch (error) {
    console.error("Failed to fetch blog posts from CMS:", error);
    return { items: [], total: 0 };
  }
}

/**
 * Fetches a single published blog post by slug
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(
      `${CMS_API_URL}/api/v1/sites/${CMS_SITE_SLUG}/posts/${slug}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      if (res.status !== 404) {
        console.warn(`CMS API single post returned status ${res.status}`);
      }
      return null;
    }

    const data = await res.json();
    return data.post || null;
  } catch (error) {
    console.error(`Failed to fetch post "${slug}" from CMS:`, error);
    return null;
  }
}