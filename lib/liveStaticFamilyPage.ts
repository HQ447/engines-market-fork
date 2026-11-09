import {
  getStaticFamilyParams,
  getStaticPageByRoute,
  type StaticPageRecord,
} from "@/lib/staticPagePreview";

export type LiveStaticFamily = "prices" | "symptoms" | "services" | "insights";

export type LiveStaticFamilyParams = {
  slug: string[];
};

export function getLiveStaticFamilyPage(
  family: LiveStaticFamily,
  slug: string[],
): StaticPageRecord | undefined {
  return getStaticPageByRoute(`/${family}/${slug.join("/")}`, family);
}

export function getLiveStaticFamilyParams(family: LiveStaticFamily): LiveStaticFamilyParams[] {
  return getStaticFamilyParams(family, `/${family}`);
}
