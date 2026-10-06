import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ComparisonGuide from "@/components/pages/ComparisonGuide";
import SharedComparisonGuide from "@/components/pages/SharedComparisonGuide";
import { usedVsRebuiltEngine } from "@/data/comparisonGuides";
import { getStaticComparisonGuide } from "@/data/staticComparisonGuides";
import { normalizeCanonical, SITE_URL } from "@/lib/site";

type PageProps = { params: Promise<{ slug: string }> };

function compareCanonical(slug: string) {
  return normalizeCanonical(`${SITE_URL}/compare/${slug}`);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  if (slug === usedVsRebuiltEngine.slug) {
    return {
      title: usedVsRebuiltEngine.title,
      description: usedVsRebuiltEngine.description,
      alternates: { canonical: compareCanonical(slug) },
    };
  }

  const guide = getStaticComparisonGuide(slug);
  if (!guide) return {};

  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: compareCanonical(guide.slug) },
  };
}

export default async function ComparisonGuidePage({ params }: PageProps) {
  const { slug } = await params;
  if (slug === usedVsRebuiltEngine.slug) return <ComparisonGuide guide={usedVsRebuiltEngine} />;
  const guide = getStaticComparisonGuide(slug);
  if (!guide) notFound();
  return <SharedComparisonGuide guide={guide} />;
}
