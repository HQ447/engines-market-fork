import type { Metadata } from "next";
import AutoInternalLinks from "@/components/internal-links/AutoInternalLinks";
import DocumentModelPage from "@/components/pages/DocumentModelPage";
import NewDocModelPage from "@/components/pages/NewDocModelPage";
import NewDocEnginePage from "@/components/pages/NewDocEnginePage";
import {
  getEnginePageData,
  getEnginePageStaticParams,
} from "@/lib/enginePageData";
import { getInternalLinkPlan } from "@/lib/internalLinkIndex";
import {
  getModelPageData,
  getModelPageStaticParams,
} from "@/lib/modelPageData";
import { SITE_URL } from "@/lib/site";
import { notFound, permanentRedirect } from "next/navigation";

type ModelPageProps = {
  params: Promise<{
    brand: string;
    model: string;
  }>;
};

export async function generateStaticParams() {
  const [modelParams, engineParams] = await Promise.all([
    getModelPageStaticParams(),
    getEnginePageStaticParams(),
  ]);

  return [...modelParams, ...engineParams];
}

export async function generateMetadata({
  params,
}: ModelPageProps): Promise<Metadata> {
  const { brand, model } = await params;
  const enginePageData = await getEnginePageData(brand, model);

  if (enginePageData) {
    return {
      title: enginePageData.seo.title,
      description: enginePageData.seo.description,
      robots: {
        index: true,
        follow: true,
      },
      alternates: {
        canonical: enginePageData.seo.canonical,
      },
      metadataBase: new URL(SITE_URL),
    };
  }

  const pageData = await getModelPageData(brand, model);

  if (!pageData) {
    return {};
  }

  return {
    title: pageData.seo.title,
    description: pageData.seo.description,
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: pageData.seo.canonical,
    },
    metadataBase: new URL(SITE_URL),
  };
}

export default async function ModelPage({ params }: ModelPageProps) {
  const { brand, model } = await params;
  const enginePageData = await getEnginePageData(brand, model);

  if (enginePageData) {
    if (
      brand !== enginePageData.brand.slug ||
      model !== enginePageData.engine.slug
    ) {
      permanentRedirect(
        `/${enginePageData.brand.slug}/${enginePageData.engine.slug}`,
      );
    }

    const internalLinkPlan = await getInternalLinkPlan({
      brandSlug: enginePageData.brand.slug,
      currentPath: enginePageData.seo.canonical,
      engineSlug: enginePageData.engine.slug,
      pageType: "engine",
    });

    return (
      <>
        <AutoInternalLinks
          targets={internalLinkPlan.targets}
          maxLinksByType={internalLinkPlan.maxLinksByType}
          maxLinksPerPage={internalLinkPlan.maxLinksPerPage}
          maxLinksPerTarget={internalLinkPlan.defaultMaxLinksPerTarget}
        />
        {enginePageData.structuredData ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(enginePageData.structuredData),
            }}
          />
        ) : null}
        <NewDocEnginePage data={enginePageData} />
      </>
    );
  }

  const pageData = await getModelPageData(brand, model);

  if (!pageData) {
    notFound();
  }

  if (brand !== pageData.brand.slug || model !== pageData.model.slug) {
    permanentRedirect(`/${pageData.brand.slug}/${pageData.model.slug}`);
  }

  const internalLinkPlan = await getInternalLinkPlan({
    brandSlug: pageData.brand.slug,
    modelSlug: pageData.model.slug,
    currentPath: pageData.seo.canonical,
    pageType: "model",
  });

  return (
    <>
      <AutoInternalLinks
        targets={internalLinkPlan.targets}
        maxLinksByType={internalLinkPlan.maxLinksByType}
        maxLinksPerPage={internalLinkPlan.maxLinksPerPage}
        maxLinksPerTarget={internalLinkPlan.defaultMaxLinksPerTarget}
      />
      <NewDocModelPage data={pageData} />
    </>
  );
}
