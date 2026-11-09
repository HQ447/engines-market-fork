import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FamilyPreviewRouter from "@/components/static-pages-comp/FamilyPreviewRouter";
import {
  getLiveStaticFamilyPage,
  getLiveStaticFamilyParams,
} from "@/lib/liveStaticFamilyPage";
import { getStaticPageMetadata } from "@/lib/staticPageMetadata";

type PageProps = { params: Promise<{ slug: string[] }> };

export const dynamicParams = true;

export function generateStaticParams() {
  return getLiveStaticFamilyParams("insights");
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getLiveStaticFamilyPage("insights", slug);
  return page ? getStaticPageMetadata(page) : { title: "Page not found", robots: { index: false, follow: false } };
}

export default async function InsightsArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const page = getLiveStaticFamilyPage("insights", slug);
  if (!page) notFound();
  return <FamilyPreviewRouter page={page} />;
}
