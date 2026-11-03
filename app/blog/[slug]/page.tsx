import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPostBySlug, resolvePostImage } from "@/lib/cms";
import { blogConfig } from "@/lib/blog.config";
import { EngineQuoteWidget } from "@/components/blog/engine-quote-widget";
import { RelatedGuidesWidget } from "@/components/blog/related-guides-widget";
import "../blog.css";

export const revalidate = 3600;

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return { title: `${slug.replace(/-/g, " ")} | ${blogConfig.siteName}` };
  }

  const metaTitle = post.seoMetadata?.metaTitle || `${post.title} | ${blogConfig.siteName}`;
  const metaDescription = post.seoMetadata?.metaDescription || post.excerpt;
  const canonicalUrl =
    post.canonicalUrl ||
    post.seoMetadata?.canonicalUrl ||
    `${blogConfig.siteUrl}/blog/${slug}`;

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: post.seoMetadata?.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: post.seoMetadata?.metaTitle || metaTitle,
      description: metaDescription,
      url: canonicalUrl,
      type: "article",
      images: post.featuredImage?.url ? [{ url: post.featuredImage.url }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoMetadata?.metaTitle || metaTitle,
      description: metaDescription,
      images: post.featuredImage?.url ? [post.featuredImage.url] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) notFound();

  const articleHtml = post.html || "<p>Article content is being generated...</p>";
  const featuredImageUrl = resolvePostImage(post);
  const featuredImageAlt =
    post.featuredImage?.alt || post.seoMetadata?.featuredImage?.altText || post.title;

  const { theme, copy } = blogConfig;

  return (
    <div
      className="cms-blog-root mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
      style={
        {
          "--blog-primary": theme.primaryColor,
          "--blog-primary-hover": theme.primaryHover,
          "--blog-accent": theme.accentColor,
          "--blog-accent-hover": theme.accentHover,
          "--blog-font": theme.fontFamily,
          fontFamily: theme.fontFamily,
        } as React.CSSProperties
      }
    >
      {/* JSON-LD Schema */}
      {post.jsonLdScript ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: post.jsonLdScript }}
        />
      ) : post.jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(post.jsonLd) }}
        />
      ) : null}

      {/* Breadcrumb Navigation */}
      <nav className="mb-6 text-xs text-slate-500">
        <Link href="/" className="hover:underline hover:text-slate-900">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:underline hover:text-slate-900">
          Blog
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900 font-medium truncate max-w-sm inline-block align-bottom">
          {post.title}
        </span>
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
              <span>
                By <strong className="text-slate-900 font-semibold">{post.author?.name || blogConfig.defaultAuthor}</strong>
              </span>
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

          {/* Featured Image */}
          {featuredImageUrl && (
            <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
              <img
                src={featuredImageUrl}
                alt={featuredImageAlt}
                className="w-full h-auto object-cover max-h-[480px]"
                loading="eager"
              />
            </div>
          )}

          {/* Rendered Semantic Content with Custom Typography & Tables */}
          <div
            className="cms-content prose prose-neutral max-w-none prose-headings:scroll-mt-20 prose-img:rounded-2xl"
            dangerouslySetInnerHTML={{ __html: articleHtml }}
          />

          {/* Bottom Conversion CTA */}
          {copy.bottomCta?.enabled && (
            <div
              className="cms-cta-block mt-12 rounded-2xl p-8 text-center text-white shadow-xl relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, #0F172A 0%, ${theme.primaryColor} 100%)`,
                borderColor: theme.primaryColor,
              }}
            >
              <div className="cms-cta-content">
                <h3>{copy.bottomCta.title}</h3>
                <p>{copy.bottomCta.subtitle}</p>
                <a
                  href={copy.bottomCta.buttonHref}
                  className="cms-cta-btn inline-flex items-center gap-1.5 font-bold shadow-md transition"
                  style={{
                    backgroundColor: theme.widgetButtonBg,
                  }}
                >
                  <span>{copy.bottomCta.buttonText}</span>
                </a>
              </div>
            </div>
          )}

          {/* Back to Blog List */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <Link
              href="/blog"
              className="inline-flex items-center text-sm font-semibold hover:underline gap-1.5"
              style={{ color: theme.primaryColor }}
            >
              <span>← Back to all articles</span>
            </Link>
          </div>
        </article>

        {/* Right Sticky Sidebar (Desktop 28% / Stacks bottom on mobile) */}
        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 self-start">
          <EngineQuoteWidget siteName={blogConfig.siteName} />
          <RelatedGuidesWidget currentSlug={slug} />
        </aside>
      </div>
    </div>
  );
}
