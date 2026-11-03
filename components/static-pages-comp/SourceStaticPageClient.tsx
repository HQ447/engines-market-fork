"use client";

import { useEffect, useRef, type ReactNode } from "react";

type SourceScript = { src?: string; code?: string };

export default function SourceStaticPageClient({ html, scripts, customHero, hasRegistrationHero, isSymptoms, family }: { html: string; scripts: SourceScript[]; customHero?: ReactNode; hasRegistrationHero?: boolean; isSymptoms?: boolean; family?: string }) {
  const scriptNodes = useRef<HTMLScriptElement[]>([]);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".source-preview-root");
    const family = Array.from(root?.classList ?? []).find((name) => name.startsWith("source-preview-family-"))?.replace("source-preview-family-", "");
    const removeDecorativeEmoji = family === "services" || family === "prices" || family === "compare";
    const pillSelector = ".section-label, .sec-eyebrow, .section-eyebrow, .fc-eyebrow, .hero-eyebrow, .badge-pill, .category-pill, .cb-eyebrow, .cta-eyebrow, .final-cta-eyebrow, .section-kicker, .eyebrow";
    root?.querySelectorAll<HTMLElement>(pillSelector).forEach((pill) => {
      const walker = document.createTreeWalker(pill, NodeFilter.SHOW_TEXT);
      const textNodes: Text[] = [];
      let current: Node | null;
      while ((current = walker.nextNode())) textNodes.push(current as Text);
      textNodes.forEach((node) => {
        let value = node.textContent ?? "";
        if (removeDecorativeEmoji) value = value.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\uFE0F]/gu, "");
        value = value.replace(/^\s*[-–—]\s*|\s*[-–—]\s*$/g, " ").replace(/\s[-–—]\s/g, " ").replace(/\s{2,}/g, " ");
        node.textContent = value;
      });
    });
    if (removeDecorativeEmoji) {
      const walker = root ? document.createTreeWalker(root, NodeFilter.SHOW_TEXT) : null;
      const textNodes: Text[] = [];
      let current: Node | null;
      while (walker && (current = walker.nextNode())) textNodes.push(current as Text);
      textNodes.forEach((node) => { node.textContent = (node.textContent ?? "").replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\uFE0F]/gu, ""); });
    }
    if (family === "compare") {
      root?.querySelectorAll<HTMLElement>("nav, .nav-bar, .nav-inner, .nav-wrap").forEach((element) => {
        (element.closest("header, .nav-bar, .nav-wrap") ?? element).remove();
      });
    }

    document.querySelectorAll<HTMLElement>(
      ".source-preview-root .nav-breadcrumbs, .source-preview-root .hero-breadcrumbs, .source-preview-root .breadcrumbs, .source-preview-root .breadcrumb, .source-preview-root [aria-label*='Breadcrumb' i]",
    ).forEach((element) => element.remove());

    document.querySelectorAll<HTMLInputElement>(
      ".source-preview-root input.reg-input, .source-preview-root input.reg-input-responsive, .source-preview-root input[id*='reg-input']",
    ).forEach((input) => {
      input.placeholder = "REG HERE";
      input.setAttribute("aria-label", "Vehicle registration");
    });
    document.querySelectorAll<HTMLInputElement>(
      ".source-preview-root .hero-reg-input",
    ).forEach((input) => {
      input.placeholder = "REG HERE";
      input.setAttribute("aria-label", "Vehicle registration");
    });

    const heroHeadings = document.querySelectorAll<HTMLElement>(
      ".source-preview-root .hero h1, .source-preview-root .legal-hero h1, .source-preview-root .page-hero h1",
    );
    heroHeadings.forEach((heading) => {
      if (heading.querySelector("em, strong, span")) return;
      const textNode = Array.from(heading.childNodes).find(
        (node): node is Text => node.nodeType === Node.TEXT_NODE && Boolean(node.textContent?.trim()),
      );
      const text = textNode?.textContent?.trim() ?? "";
      const words = text.split(/\s+/);
      if (!textNode || words.length < 2) return;
      const accentWords = words.slice(-2).join(" ");
      const prefix = text.slice(0, text.length - accentWords.length).replace(/\s+$/, "");
      const fragment = document.createDocumentFragment();
      if (prefix) fragment.append(`${prefix} `);
      const accent = document.createElement("span");
      accent.className = "source-hero-accent";
      accent.textContent = accentWords;
      fragment.append(accent);
      textNode.replaceWith(fragment);
    });

    const sectionHeadings = document.querySelectorAll<HTMLElement>(
      ".source-preview-root main h2, .source-preview-root .content-section h2, .source-preview-root .section-card-title",
    );
    sectionHeadings.forEach((heading) => {
      if (heading.querySelector("em, strong, span, a")) return;
      const textNode = Array.from(heading.childNodes).find(
        (node): node is Text => node.nodeType === Node.TEXT_NODE && Boolean(node.textContent?.trim()),
      );
      const text = textNode?.textContent?.trim() ?? "";
      const words = text.split(/\s+/);
      if (!textNode || words.length < 2) return;
      const accentWords = words.slice(-2).join(" ");
      const prefix = text.slice(0, text.length - accentWords.length).replace(/\s+$/, "");
      const fragment = document.createDocumentFragment();
      if (prefix) fragment.append(`${prefix} `);
      const accent = document.createElement("span");
      accent.className = "source-section-accent";
      accent.textContent = accentWords;
      fragment.append(accent);
      textNode.replaceWith(fragment);
    });

    const nodes: HTMLScriptElement[] = [];
    for (const script of scripts) {
      const node = document.createElement("script");
      if (script.src) {
        node.src = script.src;
        node.async = false;
      } else if (script.code) {
        node.text = script.code;
      }
      document.body.appendChild(node);
      nodes.push(node);
    }
    scriptNodes.current = nodes;
    return () => {
      for (const node of scriptNodes.current) node.remove();
      scriptNodes.current = [];
    };
  }, [scripts]);

  const className = `source-preview-root${hasRegistrationHero ? " source-preview-has-registration" : ""}${isSymptoms ? " source-preview-symptoms" : ""}${family ? ` source-preview-family-${family}` : ""}`;
  if (!customHero) return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
  return <div className={className}>{customHero}<div className="source-preview-html" dangerouslySetInnerHTML={{ __html: html }} /></div>;
}
