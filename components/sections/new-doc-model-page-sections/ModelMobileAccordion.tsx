"use client";

import { useId, useState, type ReactNode } from "react";
import { FiChevronDown } from "react-icons/fi";

type Props = {
  title: string;
  icon: ReactNode;
  buttonClassName?: string;
  children: ReactNode;
};

export default function ModelMobileAccordion({
  title,
  icon,
  buttonClassName = "",
  children,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const contentId = useId();

  return (
    <>
      <button
        type="button"
        className={`relative z-10 -my-[16px] flex w-full items-center justify-between gap-3 overflow-hidden rounded-md border-2 border-[#4caeff] bg-[#061a33] px-4 py-[13px] text-left text-white backdrop-blur-xl before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(115deg,rgba(135,220,255,0.3),transparent_34%,rgba(21,126,199,0.28)_68%,rgba(114,206,255,0.16))] before:content-[''] sm:my-0 sm:hidden ${buttonClassName}`}
        aria-expanded={expanded}
        aria-controls={contentId}
        onClick={() => setExpanded((current) => !current)}
      >
        <span className="relative z-10 flex min-w-0 items-center gap-3">
          <span className="shrink-0 border-r border-[#63c0ff]/75 pr-3 text-[#c6ecff]">
            {icon}
          </span>
          <span className="truncate text-[13px] font-extrabold uppercase tracking-[0.08em]">
            {title}
          </span>
        </span>
        <FiChevronDown
          className={`relative z-10 h-5 w-5 shrink-0 text-[#c6ecff] transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      <div
        id={contentId}
        className={expanded ? "mt-6 block sm:mt-0 sm:block" : "hidden sm:mt-0 sm:block"}
      >
        {children}
      </div>
    </>
  );
}
