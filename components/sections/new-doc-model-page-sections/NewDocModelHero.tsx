"use client";

import Image from "next/image";
import { useMemo, useState, type FormEvent } from "react";
import type { ModelPageData } from "@/types/model";
import { GoShieldCheck } from "react-icons/go";
import { FaTruckFast } from "react-icons/fa6";
import { IoShieldCheckmark } from "react-icons/io5";

import { FaTools } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";

type Props = { data: ModelPageData };

const tickerIcons = [
  "/icons/engine-market/light-green-instant-quote.png",
  "/icons/engine-market/light-green-pound.png",
  "/icons/engine-market/light-green-warranty.png",
  "/icons/engine-market/light-green-supply-fit.png",
] as const;

function UkFlagIcon() {
  return (
    <svg
      viewBox="0 0 22 14"
      className="h-3.5 w-[22px] rounded-[2px]"
      aria-hidden="true"
    >
      <rect width="22" height="14" fill="#012169" />
      <path d="M0 0 22 14M22 0 0 14" stroke="#fff" strokeWidth="3.5" />
      <path d="M0 0 22 14M22 0 0 14" stroke="#C8102E" strokeWidth="2" />
      <path d="M11 0v14M0 7h22" stroke="#fff" strokeWidth="4.5" />
      <path d="M11 0v14M0 7h22" stroke="#C8102E" strokeWidth="2.8" />
    </svg>
  );
}

function QuoteArrow() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d="M4 10h11M11 5l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 shrink-0"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 3 20 6v5c0 5-3.35 8.44-8 10-4.65-1.56-8-5-8-10V6l8-3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="m8.5 12 2.2 2.15 4.8-4.8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function badgeIcon(label: string) {
  const value = label.toLowerCase();

  if (value.includes("warranty")) {
    return <IoShieldCheckmark />;
  }

  if (
    value.includes("delivery") ||
    value.includes("nationwide") ||
    value.includes("uk-wide")
  ) {
    return <FaTruckFast />;
  }
  if (value.includes("suppliers")) {
    return <FaUsers />;
  }

  return <FaTools />;
}

function displayModelName(data: ModelPageData) {
  const name = data.model.name
    .replace(new RegExp(`^${data.brand.name}\\s+`, "i"), "")
    .trim();

  return name || data.model.name;
}

function normalizeText(text: string) {
  return text
    .replaceAll("â€“", "-")
    .replaceAll("â€”", "-")
    .replace(/[–—]/g, "-");
}

function getHighlightDetail(detail?: string) {
  return normalizeText(detail ?? "").replace(/^\s*(?:->|→)\s*/, "");
}

function renderHeroHeading(title: string) {
  const text = normalizeText(title);
  const dashIndex = text.indexOf("-");

  if (dashIndex === -1) {
    return text;
  }

  return (
    <>
      {text.slice(0, dashIndex + 1)}{" "}
      <span className="text-[#087d59]">{text.slice(dashIndex + 1).trim()}</span>
    </>
  );
}

export default function NewDocModelHero({ data }: Props) {
  const [registration, setRegistration] = useState("");
  const [hasImageError, setHasImageError] = useState(false);

  const hero = data.sections.hero;
  const modelName = displayModelName(data);
  const imageSrc =
    data.assets.mainImage || data.assets.smallImage || data.assets.heroBg;

  const engineHighlights = hero.highlights?.slice(0, 3) ?? [];

  const tickerItems = useMemo(() => {
    const segments = hero.ticker
      .split(/[·•]/)
      .map((segment) => segment.replace(/^\s*[●•]\s*/, "").trim())
      .filter(Boolean);

    return segments.length ? segments : hero.trustBadges.filter(Boolean);
  }, [hero.ticker, hero.trustBadges]);

  const tickerLoop = useMemo(
    () => [...tickerItems, ...tickerItems],
    [tickerItems],
  );

  function openQuoteCheckout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    window.dispatchEvent(
      new CustomEvent("engine-market:open-quote", {
        detail: {
          regNumber: registration.trim(),
          source: "hero-registration",
        },
      }),
    );
  }

  return (
    <section className="overflow-hidden bg-[#f7f9fc]">
      <div className="relative isolate mx-auto overflow-hidden bg-[#f7f9fc]">
        <div
          aria-hidden="true"
          className="absolute inset-0 h-auto w-full bg-cover bg-[62%_center] bg-no-repeat brightness-305 sm:bg-[60%_center] sm:brightness-100 lg:bg-right"
          style={{
            backgroundImage:
              "url('/images/shared/variant-hero-background.png')",
          }}
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,249,252,0.8)_0%,rgba(247,249,252,0.68)_50%,rgba(247,249,252,0.78)_100%)] lg:bg-[linear-gradient(90deg,#f7f9fc_0%,#f7f9fc_41%,rgba(247,249,252,0.9)_50%,rgba(247,249,252,0.12)_75%,rgba(8,22,42,0.02)_100%)]"
        />

        <div
          aria-hidden="true"
          className="absolute -right-20 top-12 hidden h-72 w-72 rounded-full bg-[#55c3ff]/20 blur-3xl lg:block"
        />

        <div className="relative mx-auto grid max-w-[1344px] gap-2 px-3 py-2 sm:px-5 sm:py-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(390px,0.9fr)] lg:gap-0 lg:px-6 lg:py-5">
          <div className="z-10 flex max-w-[710px] flex-col">
            <span className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-[#1289d5]/40 bg-[linear-gradient(135deg,#042f5a,#075b94)] px-3.5 py-1.5 text-[14px] font-bold uppercase text-white shadow-[0_0_20px_rgba(26,145,232,0.25)] sm:mb-4 sm:text-[13px]">
              {hero.tag}
            </span>

            <h1
              style={{
                fontFamily:
                  '"Bebas Neue", "Urbanist", ui-sans-serif, system-ui, sans-serif',
                letterSpacing: "0.01em",
              }}
              className="max-w-[590px] font-[var(--font-urbanist)] !text-[46px] font-extrabold leading-[0.96] tracking-normal text-[#09264e] lg:!text-[53px]"
            >
              {renderHeroHeading(hero.h1)}
            </h1>

            <p className="mt-3 max-w-[555px] text-[14px] leading-[1.55] text-[#415670] lg:mt-4 lg:text-[15px]">
              {normalizeText(hero.subheading)}
            </p>

            <div className="mt-4 grid max-w-[650px] grid-cols-2 overflow-hidden rounded-2xl border border-[#158de2]/45 bg-[#061a33] shadow-[0_0_22px_rgba(20,140,228,0.3)] sm:mt-5 sm:grid-cols-4">
              {hero.trustBadges.slice(0, 4).map((badge, index) => (
                <div
                  key={badge}
                  className={[
                    "flex min-w-0 items-center gap-2 px-4 py-3 text-white",
                    "border-[#61c4ff]/25",
                    index < 2 ? "border-b" : "",
                    index % 2 === 1 ? "border-l" : "",
                    "sm:border-b-0",
                    index > 0 ? "sm:border-l" : "sm:border-l-0",
                  ].join(" ")}
                >
                  <span className="text-[20px] text-[#67a9fb] lg:text-[25px]">
                    {badgeIcon(badge)}
                  </span>

                  <span className="text-[11px] font-semibold leading-[1.14] lg:text-[12px]">
                    {badge}
                  </span>
                </div>
              ))}
            </div>

            {engineHighlights.length ? (
              <div className="mt-4 grid max-w-[720px] gap-3 sm:mt-5">
                {engineHighlights.map((highlight) => (
                  <article
                    key={highlight.title}
                    className="flex min-w-0 items-center gap-3 rounded-2xl border border-white/75 bg-white/75 px-3 py-3 shadow-[0_12px_28px_rgba(20,72,120,0.14)] backdrop-blur-xl sm:px-4"
                  >
                    <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-xl border-0 bg-transparent p-0">
                      {imageSrc ? (
                        <Image
                          src={imageSrc}
                          alt=""
                          width={64}
                          height={48}
                          className="h-full w-full object-contain"
                        />
                      ) : null}
                    </div>

                    <div className="min-w-0">
                      <p className="text-[13px] font-extrabold leading-tight text-[#09264e] lg:text-[14px]">
                        {highlight.title}
                      </p>

                      <p className="mt-0.5 text-[15px] font-bold leading-tight text-[#087d59] lg:text-[16px]">
                        {highlight.price}
                      </p>

                      {highlight.detail || highlight.line2 ? (
                        <p className="mt-0.5 line-clamp-2 text-[12px] leading-[1.3] text-[#52657d]">
                          {getHighlightDetail(
                            highlight.detail || highlight.line2,
                          )}
                        </p>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            ) : null}
          </div>

          <div className="relative flex flex-col items-center sm:block sm:min-h-[380px] lg:-ml-12 lg:min-h-[455px]">
            <p
              aria-hidden="true"
              className="pointer-events-none absolute left-10 top-6 z-[4] max-w-[90%] whitespace-nowrap text-left text-[60px] font-black uppercase leading-none tracking-[-0.08em] text-[#0b3a68]/[0.15] sm:left-7 sm:text-[80px] lg:left-70 lg:top-[4%] lg:max-w-[94%] lg:text-[78px] lg:text-white/[0.22]"
            >
              {modelName}
            </p>

            <div className="relative z-[2] h-[250px] w-full sm:absolute sm:inset-x-[1%] sm:h-auto sm:w-auto sm:bottom-[174px] sm:top-[8px] lg:left-[15px] lg:bottom-[140px] lg:top-4">
              {imageSrc && !hasImageError ? (
                <Image
                  src={imageSrc}
                  alt={hero.imageAlt || `${data.brand.name} ${modelName}`}
                  fill
                  priority
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 80vw, 52vw"
                  onError={() => setHasImageError(true)}
                  className="scale-[1.1] object-contain object-center drop-shadow-[0_22px_19px_rgba(1,9,25,0.5)] sm:scale-[1.28] lg:scale-[1.18] xl:scale-[1.18]"
                />
              ) : (
                <div className="absolute inset-x-[13%] bottom-[16%] top-[20%] rounded-full border border-[#6acaff]/30 bg-[#0a315d]/25 shadow-[0_0_70px_rgba(61,182,255,0.36)]" />
              )}
            </div>

            <div
              aria-hidden="true"
              className="absolute bottom-0 left-[4%] right-0 z-[1] h-9 rounded-[100%] bg-[#020b18]/50 blur-xl"
            />

            <form
              onSubmit={openQuoteCheckout}
              className="relative z-20 text-center -mt-9 w-[min(100%,356px)] rounded-2xl border border-[#67d2ff]/75 bg-[#061a33] p-4 shadow-[0_0_0_1px_rgba(101,214,255,0.15),0_18px_50px_rgba(2,19,57,0.45),0_0_34px_rgba(38,176,255,0.28)] sm:absolute sm:bottom-0 sm:left-1/2 sm:mt-0 sm:w-[390px] sm:-translate-x-1/2 sm:p-5 lg:left-[20%] lg:w-[480px] lg:translate-x-0"
            >
              <div className="relative">
                <p className="text-[14px] font-bold uppercase tracking-[0.07em] text-white lg:text-[15px]">
                  {hero.form.heading || "Find your replacement engine"}
                </p>

                <label htmlFor="new-doc-model-reg" className="sr-only">
                  {hero.registrationInput?.label ||
                    "Enter your vehicle registration"}
                </label>

                <div className="mt-3 flex h-[50px] min-w-0 overflow-hidden rounded-[9px] border-[2px] border-[#102442] bg-[#ffdd00] shadow-[0_6px_0_rgba(0,6,27,0.35)]">
                  <div className="flex w-[48px] shrink-0 flex-col items-center justify-center border-r-2 border-[#102442] bg-[#003399] px-1">
                    <UkFlagIcon />
                    <span className="mt-0.5 text-[10px] font-extrabold leading-none text-[#ffdd00]">
                      UK
                    </span>
                  </div>

                  <input
                    id="new-doc-model-reg"
                    type="text"
                    value={registration}
                    onChange={(event) =>
                      setRegistration(event.currentTarget.value.toUpperCase())
                    }
                    placeholder={
                      hero.registrationInput?.platePlaceholder ||
                      hero.form.inputPlaceholder ||
                      "REG HERE"
                    }
                    maxLength={8}
                    autoCapitalize="characters"
                    autoComplete="off"
                    spellCheck={false}
                    className="min-w-0 flex-1 bg-transparent px-3 text-center text-[14px] font-black uppercase tracking-[0.07em] text-[#10151c] outline-none placeholder:text-[#222] placeholder:opacity-75 sm:text-[15px]"
                    style={{
                      fontFamily:
                        '"Charles Wright", "Arial Black", Arial, sans-serif',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="mt-3 inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-[9px] border border-[#15803d] bg-[#15803d] px-4 py-2 text-[12px] font-extrabold leading-tight text-white shadow-[0_8px_20px_rgba(1,95,172,0.35)] transition hover:-translate-y-0.5 hover:bg-[#15803d] focus:outline-none focus:ring-2 focus:ring-[#62d9ff] focus:ring-offset-2 focus:ring-offset-[#061a33] sm:text-[14px] lg:text-[15px]"
                >
                  {hero.form.buttonText || hero.ctaLinkText}
                  <QuoteArrow />
                </button>

                {hero.form.note ? (
                  <p className="mt-3 flex items-start gap-1.5 text-[12px] leading-[1.4] text-[#c9ebf8] lg:text-[13px]">
                    <span>{normalizeText(hero.form.note)}</span>
                  </p>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      </div>

      {tickerLoop.length ? (
        <div className="overflow-hidden bg-[#061a33] text-white shadow-[inset_0_1px_rgba(105,212,255,0.32)]">
          <div className="hero-ticker-track h-[52px] ![animation-duration:36s] [animation-direction:reverse] hover:[animation-play-state:paused] sm:h-[58px]">
            {tickerLoop.map((item, index) => (
              <span
                key={`${item}-${index}`}
                className="flex h-full flex-none items-center gap-2 border-r border-white/15 px-5 text-[12px] font-medium leading-none text-white/90 sm:px-6"
              >
                <Image
                  src={tickerIcons[index % tickerIcons.length]}
                  alt=""
                  width={24}
                  height={24}
                  className="h-5 w-5 object-contain"
                />
                {normalizeText(item)}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
