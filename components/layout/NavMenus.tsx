"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  navMenus,
  type BrandNavItem,
  type NavGroup,
  type NavMenu,
} from "@/lib/navData";

export { navMenus };

const COLUMN_PREVIEW_COUNT = 10;

const linkClass =
  "block text-sm font-semibold text-[#122033] no-underline transition hover:text-[#15803d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15803d]";
const mutedLinkClass =
  "block text-sm font-bold text-[#15803d] no-underline hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15803d]";
const topButtonClass =
  "inline-flex items-center gap-1.5 px-3 text-sm font-semibold text-white no-underline transition hover:text-[#86efac] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#86efac]";

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className={`h-3.5 w-3.5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M5 7l5 5 5-5" />
    </svg>
  );
}

function CaretRight() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="h-3.5 w-3.5 shrink-0 opacity-60"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M7 5l5 5-5 5" />
    </svg>
  );
}

function BrandFlyout({
  brand,
  openLeft,
  onNavigate,
}: {
  brand: BrandNavItem;
  openLeft: boolean;
  onNavigate?: () => void;
}) {
  const models = brand.models ?? [];
  const variants = brand.variants ?? [];
  const hasChildren = models.length > 0 || variants.length > 0;

  return (
    <div
      className={`absolute top-0 z-[70] max-h-[min(70vh,32rem)] w-[min(92vw,28rem)] overflow-y-auto rounded border border-slate-200 bg-white p-3 shadow-[0_12px_28px_rgba(13,27,46,0.16)] ${
        openLeft ? "right-full mr-1" : "left-full ml-1"
      }`}
    >
      <Link href={brand.href} className={`${mutedLinkClass} mb-2`} onClick={onNavigate}>
        {brand.label} Overview
      </Link>

      {!hasChildren ? (
        <p className="text-xs text-slate-500">No model or variant pages listed yet.</p>
      ) : (
        <div className={`grid gap-3 ${models.length && variants.length ? "grid-cols-2" : "grid-cols-1"}`}>
          {models.length ? (
            <div>
              <p className="mb-1.5 text-[0.68rem] font-bold uppercase tracking-wide text-slate-500">
                Models ({models.length})
              </p>
              <ul className="grid gap-0.5">
                {models.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={`${linkClass} py-1 text-[0.82rem]`} onClick={onNavigate}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {variants.length ? (
            <div>
              <p className="mb-1.5 text-[0.68rem] font-bold uppercase tracking-wide text-slate-500">
                Variants ({variants.length})
              </p>
              <ul className="grid gap-0.5">
                {variants.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={`${linkClass} py-1 text-[0.82rem]`} onClick={onNavigate}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

function BrandsPanel({
  brands,
  footerLink,
  onNavigate,
}: {
  brands: BrandNavItem[];
  footerLink?: { label: string; href: string };
  onNavigate?: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [activeHref, setActiveHref] = useState(brands[0]?.href ?? "");
  const visible = expanded || brands.length <= COLUMN_PREVIEW_COUNT ? brands : brands.slice(0, COLUMN_PREVIEW_COUNT);
  const activeBrand = brands.find((brand) => brand.href === activeHref) ?? brands[0];
  const activeIndex = visible.findIndex((brand) => brand.href === activeHref);

  return (
    <>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-3 lg:grid-cols-4">
        {visible.map((brand, index) => {
          const isActive = activeHref === brand.href;
          const openLeft = index % 4 >= 2;
          return (
            <div
              key={brand.href}
              className="relative"
              onMouseEnter={() => setActiveHref(brand.href)}
              onFocusCapture={() => setActiveHref(brand.href)}
            >
              <div
                className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm font-semibold ${
                  isActive ? "bg-[#ecfdf3] text-[#15803d]" : "text-[#122033] hover:bg-slate-50"
                }`}
              >
                <Link
                  href={brand.href}
                  className="min-w-0 flex-1 no-underline hover:text-[#15803d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15803d]"
                  onClick={onNavigate}
                >
                  {brand.label}
                </Link>
                <span className="shrink-0" aria-hidden="true">
                  <CaretRight />
                </span>
              </div>
              {isActive && activeBrand ? (
                <BrandFlyout brand={activeBrand} openLeft={openLeft || activeIndex % 4 >= 2} onNavigate={onNavigate} />
              ) : null}
            </div>
          );
        })}
      </div>

      {brands.length > COLUMN_PREVIEW_COUNT ? (
        <button
          type="button"
          className={`mt-4 ${mutedLinkClass} text-left`}
          onClick={() => setExpanded((current) => !current)}
        >
          {expanded ? "Show less" : `View all (${brands.length})`}
        </button>
      ) : null}

      {footerLink ? (
        <div className="mt-4 border-t border-slate-200 pt-3">
          <Link href={footerLink.href} className={mutedLinkClass} onClick={onNavigate}>
            {footerLink.label}
          </Link>
        </div>
      ) : null}
    </>
  );
}

function EnginesPanel({ groups, onNavigate }: { groups: NavGroup[]; onNavigate?: () => void }) {
  const [query, setQuery] = useState("");
  const [expandedTitles, setExpandedTitles] = useState(() => new Set<string>());
  const normalized = query.trim().toLowerCase();

  const filteredGroups = useMemo(() => {
    if (!normalized) return groups;
    return groups
      .map((group) => ({
        ...group,
        links: group.links.filter(
          (link) =>
            link.label.toLowerCase().includes(normalized) || link.href.toLowerCase().includes(normalized),
        ),
      }))
      .filter((group) => group.links.length > 0);
  }, [groups, normalized]);

  function toggleColumn(title: string) {
    setExpandedTitles((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  }

  return (
    <div>
      <label className="mb-3 block">
        <span className="sr-only">Search engines</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search engines…"
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-[#122033] outline-none ring-[#15803d] placeholder:text-slate-400 focus:border-[#15803d] focus:ring-1"
        />
      </label>

      {filteredGroups.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filteredGroups.map((group) => {
            const links = group.links || [];
            // While searching, show full matches; otherwise preview 10 with expand
            const searching = Boolean(normalized);
            const isExpanded = expandedTitles.has(group.title);
            const canExpand = !searching && links.length > COLUMN_PREVIEW_COUNT;
            const visibleLinks = searching || isExpanded || !canExpand ? links : links.slice(0, COLUMN_PREVIEW_COUNT);

            return (
              <div key={group.title}>
                <p className="mb-2 text-[0.7rem] font-bold uppercase tracking-wide text-slate-500">
                  {group.title}
                  <span className="ml-1 font-semibold normal-case tracking-normal text-slate-400">({links.length})</span>
                </p>
                <ul className="grid gap-1.5">
                  {visibleLinks.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className={linkClass} onClick={onNavigate}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                {canExpand ? (
                  <button
                    type="button"
                    className={`mt-3 ${mutedLinkClass} text-left`}
                    onClick={() => toggleColumn(group.title)}
                  >
                    {isExpanded ? "Show less" : `View all (${links.length})`}
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-slate-500">No engines match “{query.trim()}”.</p>
      )}
    </div>
  );
}

function ColumnsPanel({ menu, onNavigate }: { menu: Extract<NavMenu, { kind: "columns" }>; onNavigate?: () => void }) {
  const [expandedTitles, setExpandedTitles] = useState(() => new Set<string>());
  const groups = menu.groups ?? [];

  function toggleColumn(title: string) {
    setExpandedTitles((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  }

  const gridClass =
    groups.length >= 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <>
      <div className={`grid gap-4 ${gridClass}`}>
        {groups.map((group) => {
          const links = group.links || [];
          const isExpanded = expandedTitles.has(group.title);
          const canExpand = links.length > COLUMN_PREVIEW_COUNT;
          const visibleLinks = isExpanded || !canExpand ? links : links.slice(0, COLUMN_PREVIEW_COUNT);

          return (
            <div key={group.title}>
              <p className="mb-2 text-[0.7rem] font-bold uppercase tracking-wide text-slate-500">{group.title}</p>
              <ul className="grid gap-1.5">
                {visibleLinks.map((link) => (
                  <li key={`${group.title}-${link.href}`}>
                    <Link href={link.href} className={linkClass} onClick={onNavigate}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              {canExpand ? (
                <button
                  type="button"
                  className={`mt-3 ${mutedLinkClass} text-left`}
                  onClick={() => toggleColumn(group.title)}
                >
                  {isExpanded ? "Show less" : `View all (${links.length})`}
                </button>
              ) : group.viewAll ? (
                <Link href={group.viewAll.href} className={`mt-3 ${mutedLinkClass}`} onClick={onNavigate}>
                  {group.viewAll.label}
                </Link>
              ) : null}
            </div>
          );
        })}
      </div>
    </>
  );
}

function PanelBody({ menu, onNavigate }: { menu: NavMenu; onNavigate?: () => void }) {
  if (menu.kind === "brands") {
    return <BrandsPanel brands={menu.brands} footerLink={menu.footerLink} onNavigate={onNavigate} />;
  }
  if (menu.kind === "engines") {
    return <EnginesPanel groups={menu.groups} onNavigate={onNavigate} />;
  }
  return <ColumnsPanel menu={menu} onNavigate={onNavigate} />;
}

export function DesktopNavMenus() {
  const [openId, setOpenId] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const baseId = useId();
  const openMenu = navMenus.find((menu) => menu.id === openId) || null;
  const panelId = openMenu ? `${baseId}-${openMenu.id}-panel` : undefined;

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpenId(null);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenId(null);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative hidden flex-1 lg:block">
      <ul className="flex items-center justify-center gap-1 xl:gap-2">
        {navMenus.map((menu) => {
          const isOpen = openId === menu.id;
          return (
            <li key={menu.id}>
              <button
                type="button"
                className={topButtonClass}
                aria-expanded={isOpen}
                aria-controls={isOpen ? panelId : undefined}
                onClick={() => setOpenId(isOpen ? null : menu.id)}
              >
                <span>{menu.label}</span>
                <Chevron open={isOpen} />
              </button>
            </li>
          );
        })}
      </ul>

      {openMenu ? (
        <div
          id={panelId}
          role="region"
          aria-label={openMenu.label}
          className={`absolute left-1/2 top-full z-50 mt-3 w-[min(96vw,72rem)] -translate-x-1/2 rounded-b-lg border border-slate-200 bg-white p-4 text-[#122033] shadow-[0_16px_40px_rgba(13,27,46,0.18)] ${
            openMenu.kind === "brands" ? "overflow-visible" : "max-h-[70vh] overflow-y-auto"
          }`}
        >
          <PanelBody key={openMenu.id} menu={openMenu} onNavigate={() => setOpenId(null)} />
        </div>
      ) : null}
    </div>
  );
}

type MobileFrame =
  | { type: "root" }
  | { type: "menu"; menuId: string }
  | { type: "brand"; menuId: string; brandHref: string };

export function MobileNavMenus({ onNavigate }: { onNavigate?: () => void }) {
  const [stack, setStack] = useState<MobileFrame[]>([{ type: "root" }]);
  const current = stack[stack.length - 1];

  function push(frame: MobileFrame) {
    setStack((prev) => [...prev, frame]);
  }

  function pop() {
    setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }

  function goLink() {
    onNavigate?.();
    setStack([{ type: "root" }]);
  }

  if (current.type === "root") {
    return (
      <ul className="grid gap-2">
        {navMenus.map((menu) => (
          <li key={menu.id} className="overflow-hidden rounded-[12px] border border-white/10 bg-white/5">
            <button
              type="button"
              onClick={() => push({ type: "menu", menuId: menu.id })}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-white"
            >
              <span>{menu.label}</span>
              <Chevron open={false} />
            </button>
          </li>
        ))}
      </ul>
    );
  }

  const menu = navMenus.find((item) => item.id === current.menuId);
  if (!menu) return null;

  if (current.type === "menu" && menu.kind === "brands") {
    return (
      <div className="rounded-[12px] border border-white/10 bg-white/5 p-4">
        <button type="button" onClick={pop} className="mb-3 text-sm font-bold text-[#86efac]">
          ← {menu.label}
        </button>
        <div className="grid gap-0">
          {menu.brands.map((brand) => (
            <div key={brand.href} className="flex items-stretch border-b border-white/10">
              <Link
                href={brand.href}
                className="min-w-0 flex-1 py-2.5 pr-2 text-sm font-semibold text-slate-200"
                onClick={goLink}
              >
                {brand.label}
              </Link>
              <button
                type="button"
                aria-label={`Open ${brand.label} models and variants`}
                className="flex shrink-0 items-center justify-center px-3 py-2.5 text-white"
                onClick={() => push({ type: "brand", menuId: menu.id, brandHref: brand.href })}
              >
                <Chevron open={false} />
              </button>
            </div>
          ))}
        </div>
        {menu.footerLink ? (
          <Link href={menu.footerLink.href} className="mt-3 block text-sm font-bold text-[#86efac]" onClick={goLink}>
            {menu.footerLink.label}
          </Link>
        ) : null}
      </div>
    );
  }

  if (current.type === "brand" && menu.kind === "brands") {
    const brand = menu.brands.find((item) => item.href === current.brandHref);
    if (!brand) return null;
    const models = brand.models ?? [];
    const variants = brand.variants ?? [];

    return (
      <div className="rounded-[12px] border border-white/10 bg-white/5 p-4">
        <button type="button" onClick={pop} className="mb-3 text-sm font-bold text-[#86efac]">
          ← {brand.label}
        </button>
        <Link href={brand.href} className="mb-3 block text-sm font-bold text-[#86efac]" onClick={goLink}>
          {brand.label} Overview
        </Link>
        {models.length ? (
          <div className="mb-4">
            <p className="mb-1 text-[0.7rem] font-bold uppercase tracking-wide text-slate-400">
              Models ({models.length})
            </p>
            <ul className="grid gap-1">
              {models.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="block py-1.5 text-sm text-slate-200" onClick={goLink}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {variants.length ? (
          <div>
            <p className="mb-1 text-[0.7rem] font-bold uppercase tracking-wide text-slate-400">
              Variants ({variants.length})
            </p>
            <ul className="grid gap-1">
              {variants.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="block py-1.5 text-sm text-slate-200" onClick={goLink}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          !models.length ? <p className="text-sm text-slate-400">No model or variant pages listed yet.</p> : null
        )}
      </div>
    );
  }

  if (current.type === "menu" && menu.kind === "engines") {
    return <MobileEnginesMenu groups={menu.groups} label={menu.label} onPop={pop} onGoLink={goLink} />;
  }

  if (current.type === "menu" && menu.kind === "columns") {
    return <MobileColumnsMenu menu={menu} onPop={pop} onGoLink={goLink} />;
  }

  return null;
}

function MobileEnginesMenu({
  groups,
  label,
  onPop,
  onGoLink,
}: {
  groups: NavGroup[];
  label: string;
  onPop: () => void;
  onGoLink: () => void;
}) {
  const [query, setQuery] = useState("");
  const [expandedTitles, setExpandedTitles] = useState(() => new Set<string>());
  const normalized = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!normalized) return groups;
    return groups
      .map((group) => ({
        ...group,
        links: group.links.filter((link) => link.label.toLowerCase().includes(normalized)),
      }))
      .filter((group) => group.links.length > 0);
  }, [groups, normalized]);

  function toggleColumn(title: string) {
    setExpandedTitles((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  }

  return (
    <div className="rounded-[12px] border border-white/10 bg-white/5 p-4">
      <button type="button" onClick={onPop} className="mb-3 text-sm font-bold text-[#86efac]">
        ← {label}
      </button>
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search engines…"
        className="mb-3 w-full rounded-md border border-white/15 bg-white/10 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-400 focus:border-[#86efac]"
      />
      <div className="grid gap-4">
        {filtered.map((group) => {
          const links = group.links || [];
          const searching = Boolean(normalized);
          const isExpanded = expandedTitles.has(group.title);
          const canExpand = !searching && links.length > COLUMN_PREVIEW_COUNT;
          const visibleLinks = searching || isExpanded || !canExpand ? links : links.slice(0, COLUMN_PREVIEW_COUNT);

          return (
            <div key={group.title}>
              <p className="mb-1 text-[0.7rem] font-bold uppercase tracking-wide text-slate-400">
                {group.title}
                <span className="ml-1 font-semibold normal-case tracking-normal text-slate-500">({links.length})</span>
              </p>
              <ul className="grid gap-1">
                {visibleLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="block py-1.5 text-sm text-slate-200" onClick={onGoLink}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              {canExpand ? (
                <button
                  type="button"
                  className="mt-2 text-left text-sm font-bold text-[#86efac]"
                  onClick={() => toggleColumn(group.title)}
                >
                  {isExpanded ? "Show less" : `View all (${links.length})`}
                </button>
              ) : null}
            </div>
          );
        })}
        {!filtered.length ? <p className="text-sm text-slate-400">No engines match.</p> : null}
      </div>
    </div>
  );
}

function MobileColumnsMenu({
  menu,
  onPop,
  onGoLink,
}: {
  menu: Extract<NavMenu, { kind: "columns" }>;
  onPop: () => void;
  onGoLink: () => void;
}) {
  const [expandedTitles, setExpandedTitles] = useState(() => new Set<string>());

  function toggleColumn(title: string) {
    setExpandedTitles((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  }

  return (
    <div className="rounded-[12px] border border-white/10 bg-white/5 p-4">
      <button type="button" onClick={onPop} className="mb-3 text-sm font-bold text-[#86efac]">
        ← {menu.label}
      </button>
      <div className="grid gap-4">
        {menu.groups.map((group) => {
          const links = group.links || [];
          const isExpanded = expandedTitles.has(group.title);
          const canExpand = links.length > COLUMN_PREVIEW_COUNT;
          const visibleLinks = isExpanded || !canExpand ? links : links.slice(0, COLUMN_PREVIEW_COUNT);

          return (
            <div key={group.title}>
              <p className="mb-1 text-[0.7rem] font-bold uppercase tracking-wide text-slate-400">{group.title}</p>
              <ul className="grid gap-1">
                {visibleLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="block py-1.5 text-sm text-slate-200" onClick={onGoLink}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              {canExpand ? (
                <button
                  type="button"
                  className="mt-2 text-left text-sm font-bold text-[#86efac]"
                  onClick={() => toggleColumn(group.title)}
                >
                  {isExpanded ? "Show less" : `View all (${links.length})`}
                </button>
              ) : group.viewAll ? (
                <Link href={group.viewAll.href} className="mt-2 block text-sm font-bold text-[#86efac]" onClick={onGoLink}>
                  {group.viewAll.label}
                </Link>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
