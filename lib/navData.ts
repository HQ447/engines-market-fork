import brands from "@/data/nav/brands.json";
import engines from "@/data/nav/engines.json";
import others from "@/data/nav/others.json";
import services from "@/data/nav/services.json";

export type NavLink = {
  label: string;
  href: string;
};

export type BrandNavItem = NavLink & {
  models?: NavLink[];
  variants?: NavLink[];
};

export type NavGroup = {
  title: string;
  links: NavLink[];
  viewAll?: NavLink;
};

export type NavMenu =
  | {
      id: "brands";
      label: string;
      kind: "brands";
      brands: BrandNavItem[];
      footerLink?: NavLink;
    }
  | {
      id: "engines";
      label: string;
      kind: "engines";
      groups: NavGroup[];
    }
  | {
      id: "services" | "others";
      label: string;
      kind: "columns";
      groups: NavGroup[];
      footerLink?: NavLink;
    };

/** Top-level: Brands · Engines · Services · Others */
export const navMenus: NavMenu[] = [
  {
    id: "brands",
    label: "Brands",
    kind: "brands",
    brands: brands as BrandNavItem[],
    footerLink: { label: "View all brands", href: "/resources#brands" },
  },
  {
    id: "engines",
    label: "Engines",
    kind: "engines",
    groups: engines.groups,
  },
  {
    id: "services",
    label: "Services",
    kind: "columns",
    groups: services.groups,
  },
  {
    id: "others",
    label: "Others",
    kind: "columns",
    groups: others.groups,
  },
];
