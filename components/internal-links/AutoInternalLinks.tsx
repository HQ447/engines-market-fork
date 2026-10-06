"use client";

import { useEffect } from "react";
import type { InternalLinkTarget } from "@/lib/internalLinkIndex";

type Props = {
  targets: InternalLinkTarget[];
  rootSelector?: string;
  maxLinksPerPage?: number;
  maxLinksPerTarget?: number;
  maxLinksByType?: Partial<Record<InternalLinkTarget["type"], number>>;
};

type PreparedTarget = {
  href: string;
  label: string;
  type: InternalLinkTarget["type"];
  priority: number;
  maxOccurrences?: number;
  terms: string[];
};

type PreparedTermEntry = {
  term: string;
  pattern: RegExp;
  targets: PreparedTarget[];
};

const SKIP_SELECTOR = [
  "a",
  "button",
  "input",
  "textarea",
  "select",
  "script",
  "style",
  "noscript",
  "svg",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "[data-no-auto-link]",
  "[data-auto-internal-link]",
  "[data-quote-trigger]",
].join(",");

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeTerm(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function prepareTargets(targets: InternalLinkTarget[]): PreparedTermEntry[] {
  const preparedTargets = targets
    .map((target) => ({
      ...target,
      priority: target.priority ?? 0,
      terms: target.terms
        .map(normalizeTerm)
        .filter((term) => term.length >= 2)
        .sort((left, right) => right.length - left.length),
    }))
    .filter((target) => target.terms.length > 0)
    .sort((left, right) => {
      const longestLeft = left.terms[0]?.length ?? 0;
      const longestRight = right.terms[0]?.length ?? 0;
      return longestRight - longestLeft;
    })
    .filter((target) => target.terms.length > 0);

  const termMap = new Map<string, PreparedTarget[]>();

  for (const target of preparedTargets) {
    for (const term of target.terms) {
      const key = term.toLowerCase();
      const existing = termMap.get(key) ?? [];
      existing.push(target);
      termMap.set(key, existing);
    }
  }

  return [...termMap.entries()]
    .sort((left, right) => right[0].length - left[0].length)
    .map(([term, candidates]) => ({
      term,
      pattern: new RegExp(`(^|[^A-Za-z0-9])(${escapeRegex(term)})(?=$|[^A-Za-z0-9])`, "i"),
      targets: [...candidates].sort((left, right) => {
        const priorityDelta = right.priority - left.priority;
        if (priorityDelta !== 0) {
          return priorityDelta;
        }

        return left.label.localeCompare(right.label);
      }),
    }));
}

function getTargetLimit(target: PreparedTarget, defaultMaxLinksPerTarget: number) {
  return Math.max(target.maxOccurrences ?? defaultMaxLinksPerTarget, 1);
}

function chooseTarget(
  entry: PreparedTermEntry,
  usedTargets: Map<string, number>,
  defaultMaxLinksPerTarget: number,
  termRotation: Map<string, number>,
  usedTypes: Map<PreparedTarget["type"], number>,
  maxLinksByType?: Partial<Record<PreparedTarget["type"], number>>,
) {
  const eligibleTargets = entry.targets.filter(
    (target) =>
      (usedTargets.get(target.href) ?? 0) < getTargetLimit(target, defaultMaxLinksPerTarget) &&
      (maxLinksByType?.[target.type] == null || (usedTypes.get(target.type) ?? 0) < maxLinksByType[target.type]!),
  );

  if (!eligibleTargets.length) {
    return null;
  }

  const topPriority = eligibleTargets[0]?.priority ?? 0;
  const highestPriorityTargets = eligibleTargets.filter((target) => target.priority === topPriority);
  const minimumUsage = Math.min(...highestPriorityTargets.map((target) => usedTargets.get(target.href) ?? 0));
  const usagePool = highestPriorityTargets.filter(
    (target) => (usedTargets.get(target.href) ?? 0) === minimumUsage,
  );
  const currentRotation = termRotation.get(entry.term) ?? 0;

  return {
    target: usagePool[currentRotation % usagePool.length],
    nextRotation: currentRotation + 1,
  };
}

function findMatch(
  text: string,
  entries: PreparedTermEntry[],
  usedTargets: Map<string, number>,
  maxLinksPerTarget: number,
  termRotation: Map<string, number>,
  usedTypes: Map<PreparedTarget["type"], number>,
  maxLinksByType?: Partial<Record<PreparedTarget["type"], number>>,
) {
  let best:
    | {
        entry: PreparedTermEntry;
        target: PreparedTarget;
        term: string;
        index: number;
        nextRotation: number;
      }
    | null = null;

  for (const entry of entries) {
    const match = entry.pattern.exec(text);
    if (!match) {
      continue;
    }

    const targetChoice = chooseTarget(
      entry,
      usedTargets,
      maxLinksPerTarget,
      termRotation,
      usedTypes,
      maxLinksByType,
    );
    if (!targetChoice) {
      continue;
    }

    const prefixLength = match[1]?.length ?? 0;
    const index = match.index + prefixLength;
    const matchedTerm = match[2] ?? entry.term;

    if (
      !best ||
      index < best.index ||
      (index === best.index && matchedTerm.length > best.term.length) ||
      (index === best.index &&
        matchedTerm.length === best.term.length &&
        targetChoice.target.priority > best.target.priority)
    ) {
      best = {
        entry,
        target: targetChoice.target,
        term: matchedTerm,
        index,
        nextRotation: targetChoice.nextRotation,
      };
    }
  }

  return best;
}

function shouldSkipNode(node: Text) {
  const parent = node.parentElement;
  if (!parent || !node.nodeValue?.trim()) {
    return true;
  }

  return Boolean(parent.closest(SKIP_SELECTOR));
}

function removeAutoLinksFromSkippedRegions(root: Element) {
  root
    .querySelectorAll<HTMLElement>(
      "[data-no-auto-link] a[data-auto-internal-link]",
    )
    .forEach((anchor) => {
      anchor.replaceWith(document.createTextNode(anchor.textContent ?? ""));
    });
}

function buildLink(matchText: string, target: PreparedTarget) {
  const anchor = document.createElement("a");
  anchor.href = target.href;
  anchor.textContent = matchText;
  anchor.dataset.autoInternalLink = target.type;
  anchor.className =
    "font-semibold text-[#0b7a3b] underline decoration-[#34c759]/30 underline-offset-2 transition hover:text-[#0b2347]";
  anchor.setAttribute("aria-label", `Open ${target.label}`);
  return anchor;
}

export default function AutoInternalLinks({
  targets,
  rootSelector = "main",
  maxLinksPerPage = 24,
  maxLinksPerTarget = 1,
  maxLinksByType,
}: Props) {
  useEffect(() => {
    const root = document.querySelector(rootSelector);
    if (!root || !targets.length) {
      return;
    }

    removeAutoLinksFromSkippedRegions(root);

    const preparedEntries = prepareTargets(targets);
    if (!preparedEntries.length) {
      return;
    }

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const textNodes: Text[] = [];
    let currentNode = walker.nextNode();

    while (currentNode) {
      if (currentNode instanceof Text && !shouldSkipNode(currentNode)) {
        textNodes.push(currentNode);
      }
      currentNode = walker.nextNode();
    }

    const usedTargets = new Map<string, number>();
    const termRotation = new Map<string, number>();
    const usedTypes = new Map<PreparedTarget["type"], number>();
    let insertedLinks = 0;

    for (const textNode of textNodes) {
      if (insertedLinks >= maxLinksPerPage) {
        break;
      }

      const text = textNode.nodeValue ?? "";
      const match = findMatch(
        text,
        preparedEntries,
        usedTargets,
        maxLinksPerTarget,
        termRotation,
        usedTypes,
        maxLinksByType,
      );
      if (!match) {
        continue;
      }

      const before = text.slice(0, match.index);
      const afterIndex = match.index + match.term.length;
      const after = text.slice(afterIndex);
      const fragment = document.createDocumentFragment();

      if (before) {
        fragment.appendChild(document.createTextNode(before));
      }
      fragment.appendChild(buildLink(match.term, match.target));
      if (after) {
        fragment.appendChild(document.createTextNode(after));
      }

      textNode.parentNode?.replaceChild(fragment, textNode);
      termRotation.set(match.entry.term, match.nextRotation);
      usedTargets.set(match.target.href, (usedTargets.get(match.target.href) ?? 0) + 1);
      usedTypes.set(match.target.type, (usedTypes.get(match.target.type) ?? 0) + 1);
      insertedLinks += 1;
    }
  }, [maxLinksByType, maxLinksPerPage, maxLinksPerTarget, rootSelector, targets]);

  return null;
}
