"use client";

import { useEffect, useState } from "react";
import { FaExclamation, FaFacebookF, FaGoogle } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { SiTrustpilot } from "react-icons/si";
import type { ModelPageData } from "@/types/model";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { buildStaticReviewsSection } from "@/lib/staticReviews";

type Props = { data: ModelPageData };

const REVIEW_SOURCES = ["google", "facebook", "trustpilot"] as const;
type ReviewSource = (typeof REVIEW_SOURCES)[number];

function splitReviewsHeading(value: string) {
  const match = value.match(/^(.*?)(\s+Across the UK)$/i);
  return match
    ? { primary: match[1].trim(), accent: match[2].trim() }
    : { primary: value, accent: "" };
}

function ReviewSourceBadge({ source }: { source: ReviewSource }) {
  if (source === "facebook") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#1877f2]">
        <FaFacebookF className="h-5 w-5" aria-hidden="true" />
        Facebook
      </span>
    );
  }

  if (source === "trustpilot") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#00b67a]">
        <SiTrustpilot className="h-5 w-5" aria-hidden="true" />
        Trustpilot
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#5b7190]">
      <FaGoogle className="h-5 w-5" aria-hidden="true" />
      Google
    </span>
  );
}

function ReviewCard({
  review,
  source,
}: {
  review: ReturnType<typeof buildStaticReviewsSection>["reviews"][number];
  source: ReviewSource;
}) {
  return (
    <article className="relative overflow-hidden rounded-[18px] border border-[#e2edf6] bg-white px-5 py-5 shadow-[0_12px_28px_rgba(20,74,116,0.08)] sm:px-6">
      <div className="flex items-start justify-between gap-4">
        <span className="text-[25px] leading-none tracking-[2px] text-[#ffb400]">
          ★★★★★
        </span>
        <span
          className="font-serif text-[48px] font-bold leading-[0.65] text-[#c7e2f4]"
          aria-hidden="true"
        >
          &rdquo;
        </span>
      </div>
      <p className="mt-4 text-[16px] italic leading-[1.52] text-[#142c4b] sm:text-[17px]">
        &ldquo;{review.text}&rdquo;
      </p>
      <div className="mt-5 flex items-center gap-3 border-t border-[#e7eff5] pt-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#e3effa] text-[18px] font-extrabold text-[#123861]">
          {review.name.charAt(0)}
        </span>
        <strong className="min-w-0 flex-1 truncate text-[16px] text-[#0d3159]">
          {review.name}
        </strong>
        <span className="h-9 w-px shrink-0 bg-[#d9e6f0]" aria-hidden="true" />
        <ReviewSourceBadge source={source} />
      </div>
    </article>
  );
}

function ChevronButton({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  const Icon = direction === "prev" ? FiChevronLeft : FiChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`absolute top-1/2 z-[2] hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-[#e0ecf5] bg-white text-[#082f5e] shadow-[0_8px_22px_rgba(19,71,113,0.12)] transition hover:border-[#64b9f2] lg:grid lg:h-12 lg:w-12 ${direction === "prev" ? "left-0 lg:-left-6" : "right-0 lg:-right-6"}`}
      aria-label={direction === "prev" ? "Previous reviews" : "Next reviews"}
    >
      <Icon className="h-6 w-6" aria-hidden="true" />
    </button>
  );
}

function RatingCircle({ value, count }: { value: number; count: number }) {
  const circumference = 2 * Math.PI * 47.5;
  const dashOffset = circumference * (1 - value / 5);

  return (
    <div className="flex shrink-0 flex-col items-center text-center">
      <div className="relative h-[106px] w-[106px] sm:h-[118px] sm:w-[118px] lg:h-[148px] lg:w-[148px]">
        <svg
          className="absolute inset-0 h-full w-full -rotate-90"
          viewBox="0 0 100 100"
          aria-hidden="true"
        >
          <circle
            cx="50"
            cy="50"
            r="47.5"
            fill="none"
            stroke="#e5f2fa"
            strokeWidth="5"
          />
          <circle
            cx="50"
            cy="50"
            r="47.5"
            fill="none"
            stroke="#9ccfec"
            strokeWidth="5"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
          />
        </svg>
        <div className="absolute inset-[5px] flex flex-col items-center justify-center rounded-full bg-white p-2 lg:inset-[6px]">
          <div className="flex flex-col items-center gap-1 lg:gap-1.5">
            <p
              className="font-[var(--font-urbanist)] text-[35px] font-extrabold leading-none text-[#092b58] lg:text-[44px]"
              style={{ lineHeight: 1 }}
            >
              {value.toFixed(1)}
            </p>
            <p
              className="whitespace-nowrap text-[18px] leading-none tracking-[1px] text-[#ffb400] lg:text-[21px]"
              style={{ lineHeight: 1 }}
            >
              ★★★★★
            </p>
            <p
              className="text-[11px] font-medium leading-none text-[#59718f] lg:text-[12px]"
              style={{ lineHeight: 1 }}
            >
              out of 5
            </p>
          </div>
        </div>
      </div>
      <p className="mt-2 max-w-[130px] text-[11px] font-medium leading-[1.25] text-[#59718f] sm:text-[12px] lg:max-w-[150px] lg:text-[13px]">
        {count.toLocaleString()} verified reviews
      </p>
    </div>
  );
}

export default function NewDocModelReviews({ data }: Props) {
  const reviews = buildStaticReviewsSection(data.model.name);
  const reviewCount = reviews.reviews.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [experienceOpen, setExperienceOpen] = useState(false);
  const headingLines = reviews.headingLines?.length
    ? reviews.headingLines
    : [reviews.h2];
  const reviewsHeading = splitReviewsHeading(reviews.h2);

  const desktopReviews = Array.from(
    { length: Math.min(3, reviewCount) },
    (_, offset) => {
      const index = (currentIndex + offset) % reviewCount;
      return {
        review: reviews.reviews[index],
        source: REVIEW_SOURCES[index % REVIEW_SOURCES.length],
      };
    },
  );

  useEffect(() => {
    if (reviewCount < 2) return;

    const mobileQuery = window.matchMedia("(max-width: 1023px)");
    let timer: ReturnType<typeof setInterval> | undefined;

    const updateAutoSlide = () => {
      if (timer) clearInterval(timer);
      timer = mobileQuery.matches
        ? setInterval(
            () => setCurrentIndex((index) => (index + 1) % reviewCount),
            3500,
          )
        : undefined;
    };

    updateAutoSlide();
    mobileQuery.addEventListener("change", updateAutoSlide);

    return () => {
      if (timer) clearInterval(timer);
      mobileQuery.removeEventListener("change", updateAutoSlide);
    };
  }, [reviewCount]);

  if (!reviewCount) return null;

  const currentReview = reviews.reviews[currentIndex];
  const goTo = (index: number) =>
    setCurrentIndex((index + reviewCount) % reviewCount);
  const goNext = () => goTo(currentIndex + 1);
  const goPrev = () => goTo(currentIndex - 1);

  return (
    <Section className="relative isolate overflow-hidden bg-white !px-4 !py-5 sm:!px-6 sm:!py-8 lg:!px-8 lg:!py-10">
      <Container className="relative z-10 !max-w-7xl !px-0">
        <div className="mb-4 inline-flex w-fit rounded-full border border-[#1289d5]/40 bg-[linear-gradient(135deg,#042f5a,#075b94)] px-3.5 py-1.5 text-[13px] font-bold uppercase text-white shadow-[0_0_20px_rgba(26,145,232,0.25)]">
          {reviews.tag}
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_106px] items-center gap-4 sm:grid-cols-[minmax(0,1fr)_118px] lg:grid-cols-[minmax(0,1.45fr)_1px_minmax(250px,0.68fr)_1px_142px] lg:gap-7">
          <h2
            style={{
              fontFamily:
                '"Bebas Neue", "Urbanist", ui-sans-serif, system-ui, sans-serif',
              letterSpacing: "0.01em",
            }}
            className="col-start-1 max-w-[1020px] font-[var(--font-urbanist)] !text-[40px] font-extrabold leading-[1.04] tracking-normal !tracking-[-0.02em] text-[#0d1b2e] sm:!tracking-[0.01em] sm:!text-[41px] lg:col-auto lg:!text-[46px]"
          >
            {headingLines.length > 1 ? (
              headingLines.map((line, index) => (
                <span
                  key={line}
                  className={`block ${index === headingLines.length - 1 ? "text-[#15803d]" : ""}`}
                >
                  {line}
                </span>
              ))
            ) : (
              <>
                <span>{reviewsHeading.primary}</span>{" "}
                {reviewsHeading.accent ? (
                  <span className="text-[#15803d]">
                    {reviewsHeading.accent}
                  </span>
                ) : null}
              </>
            )}
          </h2>
          <span
            className="hidden h-[122px] w-px bg-[#bdcfe0] lg:block"
            aria-hidden="true"
          />
          <p className="col-start-1 max-w-[380px] text-[13px] leading-[1.6] text-slate-500 sm:text-[14px] lg:col-auto lg:text-[15px]">
            {reviews.rating.summary}
          </p>
          <span
            className="hidden h-[122px] w-px bg-[#d9e6f0] lg:block"
            aria-hidden="true"
          />
          <div className="col-start-2 row-span-2 row-start-1 lg:col-auto lg:row-auto">
            <RatingCircle
              value={reviews.rating.value}
              count={reviews.rating.count}
            />
          </div>
        </div>

        <div className="relative mt-6 lg:mt-7">
          <ChevronButton direction="prev" onClick={goPrev} />
          <ChevronButton direction="next" onClick={goNext} />

          <div className="hidden grid-cols-3 gap-4 lg:grid">
            {desktopReviews.map(({ review, source }, index) => (
              <ReviewCard
                key={`${review.name}-${index}`}
                review={review}
                source={source}
              />
            ))}
          </div>

          <div className="mx-2 sm:mx-3 lg:hidden">
            <ReviewCard
              review={currentReview}
              source={REVIEW_SOURCES[currentIndex % REVIEW_SOURCES.length]}
            />
          </div>
        </div>

        <div className="mt-5 flex justify-center gap-2">
          {reviews.reviews.map((review, index) => (
            <button
              key={`${review.name}-${index}`}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Review ${index + 1}`}
              className={`h-2.5 w-2.5 rounded-full transition ${index === currentIndex ? "scale-125 bg-[#1687e8]" : "bg-[#d7e5f1]"}`}
            />
          ))}
        </div>

        <div className="mt-5">
          {experienceOpen ? (
            <article className="mb-4 rounded-[12px] border border-[#2a6dd6] bg-white px-4 py-4 shadow-[0_0_12px_rgba(42,109,214,0.2)]">
              <div className="flex items-start gap-3">
                <span className="relative inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-[16px] border border-[#dbe4ef] bg-[#f8fafc] shadow-[0_6px_18px_rgba(13,27,46,0.08)]">
                  <img
                    src="/icons/engine-market/colored-experience-positive.png"
                    alt=""
                    aria-hidden="true"
                    className="absolute -bottom-0.5 -left-0.5 h-9 w-9 object-contain"
                    loading="lazy"
                  />
                  <img
                    src="/icons/engine-market/colored-experience-negative.png"
                    alt=""
                    aria-hidden="true"
                    className="absolute -right-0.5 -top-0.5 h-8 w-8 object-contain"
                    loading="lazy"
                  />
                </span>
                <div>
                  <p className="font-[var(--font-urbanist)] text-[14px] font-bold text-[#0d1b2e]">
                    {reviews.ui?.leaveReviewTitle ??
                      "Had a good / bad experience? Please leave a review"}
                  </p>
                  <p className="mt-1 text-[12.5px] leading-[1.55] text-slate-500">
                    <a
                      href="mailto:ef2crm@gmail.com?subject=EnginesMarket%20review"
                      className="font-semibold text-[#0d1b2e] underline"
                    >
                      {reviews.leaveReviewCta.linkText.replace(
                        /\s*-+>\s*$/,
                        "",
                      )}{" "}
                      →
                    </a>{" "}
                    -{" "}
                    {reviews.leaveReviewCta.text.replace(
                      /^Had a great experience\?\s*/i,
                      "",
                    )}
                  </p>
                </div>
              </div>
            </article>
          ) : null}

          <div className="flex min-h-14 items-center justify-end gap-3">
            <a
              href="mailto:ef2crm@gmail.com?subject=EnginesMarket%20review"
              className="rounded-full bg-white px-5 py-3 text-[13px] font-extrabold text-[#1261c8] shadow-[0_8px_20px_rgba(20,74,116,0.12)]"
            >
              {reviews.leaveReviewCta.linkText.replace(/\s*-+>\s*$/, "")}
            </a>
            <button
              type="button"
              onClick={() => setExperienceOpen((open) => !open)}
              aria-expanded={experienceOpen}
              aria-label="Show review experience options"
              className={`grid h-12 w-12 place-items-center rounded-full border-2 border-white text-[30px] font-black text-white shadow-[0_8px_20px_rgba(20,74,116,0.2)] transition sm:h-14 sm:w-14 ${experienceOpen ? "bg-[#1687e8]" : "bg-[#061a33]"}`}
            >
              <FaExclamation
                className="h-5 w-5 sm:h-7 sm:w-7"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
