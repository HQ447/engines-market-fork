import type { Metadata } from "next";
import Link from "next/link";
import { getBlogPosts } from "@/lib/cms";
import { EngineQuoteWidget } from "@/components/blog/engine-quote-widget";
import { RelatedGuidesWidget } from "@/components/blog/related-guides-widget";

export const metadata: Metadata = {
  title: "Blog & Engine Guides | Engines Market",
  description: "Expert automotive advice, engine diagnostic guides, failure solutions, and reconditioning insights from Engines Market.",
  alternates: {
    canonical: "https://enginesmarket.co.uk/blog",
  },
};

export const revalidate = 3600; // ISR cache: 1 hour

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedParams = await searchParams;
  const currentPage = Math.max(1, parseInt(resolvedParams.page || "1", 10));
  const postsPerPage = 9;

  const { items: posts, total } = await getBlogPosts(currentPage, postsPerPage);
  const totalPages = Math.ceil(total / postsPerPage) || 1;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 font-['Montserrat',sans-serif]">
      {/* Breadcrumb Navigation */}
      <nav className="mb-4 text-xs text-slate-500">
        <Link href="/" className="hover:underline hover:text-slate-900">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900 font-medium">Blog</span>
      </nav>

      {/* Page Title Banner */}
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
          Engines Market <span className="text-[#16A34A]">Blog</span>
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-3xl">
          Comprehensive engine reliability analysis, buyer guides, failure diagnosis, and expert replacement advice.
        </p>
      </header>

      {/* 12-Column Grid: 8 Cols Main Content (~72%) / 4 Cols Sticky Sidebar (~28%) */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
        {/* Left / Main Blog Archive (8 Columns) */}
        <div className="lg:col-span-8 min-w-0">
          {posts.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-12 text-center">
              <p className="text-base font-bold text-slate-900">No articles published yet</p>
              <p className="mt-1 text-xs text-slate-500">Articles published from the CMS will appear here instantly.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
              {posts.map((post) => {
                const imageUrl =
                  post.seoMetadata?.featuredImage?.url ||
                  post.seoMetadata?.ogImage ||
                  "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80";

                const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                });

                return (
                  <article
                    key={post.id}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs transition duration-200 hover:shadow-md hover:border-slate-300"
                  >
                    {/* Thumbnail Image */}
                    <Link
                      href={`/blog/${post.slug}`}
                      className="relative aspect-16/10 w-full overflow-hidden bg-slate-100 block"
                    >
                      <img
                        src={imageUrl}
                        alt={post.seoMetadata?.featuredImage?.altText || post.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </Link>

                    {/* Card Content */}
                    <div className="flex flex-1 flex-col justify-between p-4 sm:p-4.5">
                      <div>
                        <h3 className="!text-base !font-extrabold leading-snug text-slate-900 line-clamp-3 group-hover:text-[#1E3A8A] transition">
                          <Link href={`/blog/${post.slug}`}>
                            {post.title}
                          </Link>
                        </h3>
                        <p className="mt-2 text-xs text-slate-600 line-clamp-4 leading-relaxed">
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#16A34A] hover:text-[#15803D] hover:underline"
                        >
                          <span>Read More</span>
                          <span className="text-sm leading-none">»</span>
                        </Link>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {formattedDate}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-1.5 border-t border-slate-200 pt-6 text-xs font-semibold text-slate-700">
              {currentPage > 1 ? (
                <Link
                  href={`/blog?page=${currentPage - 1}`}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 hover:bg-slate-50 transition"
                >
                  « Previous
                </Link>
              ) : (
                <span className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-1.5 text-slate-300 cursor-not-allowed">
                  « Previous
                </span>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                const isActive = pageNum === currentPage;
                return (
                  <Link
                    key={pageNum}
                    href={`/blog?page=${pageNum}`}
                    className={`rounded-lg px-3 py-1.5 transition ${
                      isActive
                        ? "bg-[#1E3A8A] font-bold text-white shadow-xs"
                        : "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    {pageNum}
                  </Link>
                );
              })}

              {currentPage < totalPages ? (
                <Link
                  href={`/blog?page=${currentPage + 1}`}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 hover:bg-slate-50 transition"
                >
                  Next »
                </Link>
              ) : (
                <span className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-1.5 text-slate-300 cursor-not-allowed">
                  Next »
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right Sticky Sidebar (4 Columns) */}
        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 self-start">
          {/* Quote & Reg Lookup Widget */}
          <EngineQuoteWidget siteName="Engines Market" />

          {/* Related Guides Widget */}
          <RelatedGuidesWidget title="Recent Guides" limit={6} />
        </aside>
      </div>
    </div>
  );
}
