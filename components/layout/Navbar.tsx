"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { DesktopNavMenus, MobileNavMenus } from "@/components/layout/NavMenus";

const CALL_NUMBER_DISPLAY = "020 3488 4649";
const CALL_NUMBER_TEL = "tel:+442034884649";
const WHATSAPP_URL = "https://wa.me/447311343662";

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.79.63 2.64a2 2 0 0 1-.45 2.11L8 9.91a16 16 0 0 0 6.09 6.09l1.44-1.29a2 2 0 0 1 2.11-.45c.85.3 1.74.51 2.64.63A2 2 0 0 1 22 16.92Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-100 bg-[#061a33] text-white shadow-md max-[1023px]:shadow-none">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:h-[78px] lg:px-8 max-[1023px]:border-b-0">
        <Link href="/" className="flex shrink-0 items-center" onClick={closeMobileMenu}>
          <Image
            src="/branding/engine-market-logo-header-tight.png"
            alt="Engines Market"
            width={3919}
            height={763}
            className="h-[38px] w-auto max-w-[230px] object-contain sm:h-[42px] sm:max-w-[255px] lg:h-[52px] lg:max-w-[320px]"
            priority
          />
        </Link>

        <DesktopNavMenus />

        <div className="hidden items-center gap-3 lg:flex">
          <a href={CALL_NUMBER_TEL} className="text-sm font-bold">
            {CALL_NUMBER_DISPLAY}
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-[#25D366] px-3 py-2 text-xs font-bold text-white"
            aria-label="Chat on WhatsApp"
          >
            <FaWhatsapp className="h-[15px] w-[15px]" aria-hidden="true" />
            WhatsApp
          </a>
        </div>

        <div className="ml-auto flex items-center gap-1.5 self-center lg:hidden">
          <a
            href={CALL_NUMBER_TEL}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white sm:h-11 sm:w-11"
            aria-label="Call Engines Market"
          >
            <PhoneIcon />
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[#25D366] text-white sm:h-11 sm:w-11"
            aria-label="Chat on WhatsApp"
          >
            <FaWhatsapp className="h-[17px] w-[17px]" aria-hidden="true" />
          </a>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 sm:h-11 sm:w-11"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen((current) => !current)}
          >
            {mobileOpen ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div
          id="mobile-nav"
          className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto overscroll-contain bg-[#0b2241] px-4 py-4 lg:hidden"
        >
          <MobileNavMenus onNavigate={closeMobileMenu} />
        </div>
      ) : null}
    </header>
  );
}
