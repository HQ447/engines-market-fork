import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPostBySlug } from "@/lib/cms";
import { EngineQuoteWidget } from "@/components/blog/engine-quote-widget";
import { RelatedGuidesWidget } from "@/components/blog/related-guides-widget";
import '../blog.css'

export const revalidate = 3600;

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return { title: `${slug.replace(/-/g, " ")} | Blog` };
  }

  return {
    title: post.seoMetadata?.metaTitle || `${post.title} | Blog`,
    description: post.seoMetadata?.metaDescription || post.excerpt,
    alternates: {
      canonical: post.seoMetadata?.canonicalUrl || `https://enginesmarket.co.uk/blog/${slug}`,
    },
    robots: post.seoMetadata?.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) notFound();

  const articleHtml = post.html || "<p>Article content is being generated...</p>";

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 font-['Montserrat',sans-serif]">
      {/* JSON-LD Schema */}
      {post.jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(post.jsonLd) }}
        />
      )}

      {/* Breadcrumb Navigation */}
      <nav className="mb-6 text-xs text-slate-500">
        <Link href="/" className="hover:underline hover:text-slate-900">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:underline hover:text-slate-900">Blog</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900 font-medium">{post.title}</span>
      </nav>

      {/* 12-Column Grid: 8 Cols Article (~72%) / 4 Cols Sticky Sidebar (~28%) */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
        {/* Left Column: Article */}
        <article className="lg:col-span-8 min-w-0">
          <header className="mb-8 space-y-4">
            <h1 className="cms-article-title text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 border-y border-slate-200 py-3">
              <span>By <strong className="text-slate-900 font-semibold">{post.author?.name || "Editorial Team"}</strong></span>
              <span>•</span>
              <span>{post.readingTimeMinutes || 2} min read</span>
              <span>•</span>
              <span>
                {new Date(post.publishedAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </header>

          {/* Featured Image (shown below post meta, above article body) */}
          {post.seoMetadata?.featuredImage?.url && (
            <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
              <img
                src={post.seoMetadata.featuredImage.url}
                alt={post.seoMetadata.featuredImage.altText || post.title}
                className="w-full h-auto object-cover max-h-[480px]"
                loading="eager"
              />
            </div>
          )}

          {/* Rendered Semantic Content with Custom Typography & Table */}
          <div
            className="cms-content prose prose-neutral max-w-none prose-headings:scroll-mt-20 prose-img:rounded-2xl"
            dangerouslySetInnerHTML={{ __html: articleHtml }}
          />
        </article>

        {/* Right Sticky Sidebar (Desktop 28% / Stacks bottom on mobile) */}
        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 self-start">
          <EngineQuoteWidget siteName="Engines Market" />
          <RelatedGuidesWidget currentSlug={slug} />
        </aside>
      </div>
    </div>
  );
}