"use client";

import Image from "next/image";
import { useState } from "react";
import {
  FiAlertTriangle,
  FiArrowRight,
  FiCheck,
  FiMessageCircle,
  FiMinus,
  FiPlus,
} from "react-icons/fi";
import type { ModelPageData } from "@/types/model";
import ModelMobileAccordion from "./ModelMobileAccordion";

type Props = { data: ModelPageData };

function getHeadingLines(data: ModelPageData["sections"]["faq"]) {
  if (data.headingLines?.length) return data.headingLines;

  const accent = "Frequently Asked Questions";

  if (data.h2.includes(accent)) {
    const lead = data.h2
      .replace(accent, "")
      .replace(/\s+-\s*$/, "")
      .trim();

    return [lead, accent];
  }

  return [data.h2];
}

export default function NewDocModelFaq({ data }: Props) {
  const faq = data.sections.faq;

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const headingLines = getHeadingLines(faq);
  const vehicleImage =
    data.assets.mainImage || data.assets.smallImage || data.assets.heroBg;
  const ui = faq.ui ?? {};

  return (
    <section
      className="relative overflow-hidden bg-white px-4 py-3 sm:px-6 sm:py-5 lg:px-8 lg:py-7"
      aria-labelledby="model-faq-title"
    >
      <ModelMobileAccordion
        title={headingLines[0] ?? faq.h2}
        icon={<FiMessageCircle className="h-5 w-5" aria-hidden="true" />}
        buttonClassName="mt-[-0.25rem] mb-3 sm:mt-0 sm:mb-0"
      >
        <div className="relative mx-auto w-full max-w-7xl">
          {/* FAQ heading / intro area */}
          <div className="relative isolate overflow-hidden">
            {vehicleImage ? (
              <>
                <div
                  className="pointer-events-none absolute inset-0 z-0 md:hidden"
                  aria-hidden="true"
                >
                  <Image
                    src={vehicleImage}
                    alt=""
                    fill
                    sizes="100vw"
                    className="translate-x-[8%] object-contain object-right-center opacity-[0.23] sm:translate-x-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-white via-white/75 to-white/20" />
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white" />
                </div>
                <div
                  className="pointer-events-none absolute right-4 top-[-24px] z-0 hidden h-[220px] w-[430px] overflow-hidden md:block"
                  aria-hidden="true"
                >
                  <Image
                    src={vehicleImage}
                    alt=""
                    fill
                    sizes="430px"
                    className="translate-x-[8%] object-contain object-right-center opacity-90 drop-shadow-[0_19px_22px_rgba(14,51,80,0.18)] sm:translate-x-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-transparent lg:hidden" />
                  <div className="absolute inset-y-0 right-0 w-[10%] bg-gradient-to-l from-white/5 to-transparent lg:hidden" />
                </div>
              </>
            ) : null}

            <div className="relative z-10 max-w-[760px]">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#042f5a,#075b94)] px-3 py-1.5 text-[13px] font-extrabold uppercase tracking-[0.08em] text-white shadow-[0_10px_24px_rgba(8,47,85,0.16)]">
                {faq.tag}
              </div>

              <h2
                id="model-faq-title"
                style={{
                  fontFamily:
                    '"Bebas Neue", "Urbanist", ui-sans-serif, system-ui, sans-serif',
                  letterSpacing: "0.01em",
                }}
                className="font-[var(--font-urbanist)] !text-[40px] font-extrabold leading-[1.1] tracking-normal !tracking-[-0.02em] text-[#0b3158] sm:!tracking-[0.01em] sm:!text-[41px] lg:!text-[46px]"
              >
                {headingLines.map((line, index) => (
                  <span
                    key={`${line}-${index}`}
                    className={`block ${
                      headingLines.length > 1 &&
                      index === headingLines.length - 1
                        ? "text-[#15803d]"
                        : ""
                    }`}
                  >
                    {line}
                  </span>
                ))}
              </h2>

              <p className="mt-2 max-w-[760px] text-[14px] leading-[1.55] text-[#315579] lg:text-[15px]">
                {faq.intro.replace(/^\*\*\s*/, "")}
              </p>
            </div>
          </div>

          {/* FAQ items */}
          <div className="mt-3 grid items-start gap-3.5 md:grid-cols-2 md:gap-4">
            {faq.items.map((item, index) => {
              const isOpen = openIndex === index;
              const answerId = `model-faq-answer-${index + 1}`;

              return (
                <article
                  key={item.question}
                  className={`overflow-hidden rounded-[12px] border bg-white/[0.92] shadow-[0_12px_27px_rgba(20,62,98,0.08)] transition-colors ${
                    isOpen ? "border-[#a8d6e9]" : "border-[#d8e7f2]"
                  }`}
                >
                  <button
                    className="grid w-full grid-cols-[42px_minmax(0,1fr)_30px] items-center gap-3 bg-transparent p-4 text-left text-[14px] font-extrabold leading-[1.25] text-[#0b3158] transition hover:bg-[#f4f9fc] lg:text-[15px]"
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                  >
                    <span className="grid h-[34px] w-[34px] place-items-center rounded-full bg-[#061a33] text-[13px] font-extrabold text-white">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span>{item.question}</span>

                    <span
                      className="grid h-[28px] w-[28px] place-items-center rounded-full bg-[#e7f1f7] text-[#174c74]"
                      aria-hidden="true"
                    >
                      {isOpen ? (
                        <FiMinus className="h-4 w-4" />
                      ) : (
                        <FiPlus className="h-4 w-4" />
                      )}
                    </span>
                  </button>

                  <div
                    id={answerId}
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                    aria-hidden={!isOpen}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <div className="border-t border-[#e1edf5] px-4 pb-4 pt-3.5">
                        <p className="text-[14px] leading-[1.55] text-[#294d6d] lg:text-[15px]">
                          {item.answer}
                        </p>

                        {item.keyPoints?.length ? (
                          <div className="mt-3.5 rounded-[8px] bg-[#f0f8fc] p-3.5">
                            {ui.keyPointsLabel ? (
                              <p className="mb-2 text-[14px] font-extrabold text-[#173f63]">
                                {ui.keyPointsLabel}
                              </p>
                            ) : null}

                            <ul className="grid gap-[7px]">
                              {item.keyPoints.map((point) => (
                                <li
                                  key={point}
                                  className="flex items-start gap-2 text-[14px] leading-[1.38] text-[#294e6d]"
                                >
                                  <FiCheck className="mt-px h-[17px] w-[17px] shrink-0 rounded-full bg-[#d7f3e4] p-[2px] text-[#008c4f]" />
                                  {point}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}

                        {item.comparisonTable?.headers?.length &&
                        item.comparisonTable.rows?.length ? (
                          <div className="mt-3.5">
                            {ui.comparisonTableLabel ? (
                              <p className="mb-2 text-[14px] font-extrabold text-[#173f63]">
                                {ui.comparisonTableLabel}
                              </p>
                            ) : null}

                            <div className="overflow-x-auto rounded-[8px] border border-[#deebf3]">
                              <table className="min-w-full border-collapse text-left text-[13px] leading-[1.4] text-[#294e6d]">
                                <thead className="bg-[#f2f9fd] text-[#173f63]">
                                  <tr>
                                    {item.comparisonTable.headers.map(
                                      (header) => (
                                        <th
                                          key={header}
                                          className="whitespace-nowrap border-b border-[#deebf3] px-3 py-2.5 font-extrabold"
                                        >
                                          {header}
                                        </th>
                                      ),
                                    )}
                                  </tr>
                                </thead>

                                <tbody>
                                  {item.comparisonTable.rows.map(
                                    (row, rowIndex) => (
                                      <tr
                                        key={`${item.question}-${rowIndex}`}
                                        className={
                                          rowIndex % 2
                                            ? "bg-[#f8fcff]"
                                            : "bg-white"
                                        }
                                      >
                                        {row.map((cell, cellIndex) => (
                                          <td
                                            key={`${cell}-${cellIndex}`}
                                            className="border-b border-[#edf3f7] px-3 py-2.5 align-top last:border-b-0"
                                          >
                                            {cell}
                                          </td>
                                        ))}
                                      </tr>
                                    ),
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ) : null}

                        {item.warning ? (
                          <div className="mt-3.5 flex gap-2 rounded-[8px] border border-[#f4d399] bg-[#fff8e8] p-3 text-[14px] leading-[1.4] text-[#76541c]">
                            <FiAlertTriangle className="mt-px h-[17px] w-[17px] shrink-0 text-[#c98a12]" />

                            <div>
                              {ui.warningTitle ? (
                                <strong className="block text-[#66470f]">
                                  {ui.warningTitle}
                                </strong>
                              ) : null}

                              {item.warning}
                            </div>
                          </div>
                        ) : null}

                        <a
                          className="mt-3 inline-flex items-center gap-2 text-[14px] font-extrabold leading-[1.35] text-[#15803d] transition hover:text-[#15803d]"
                          href="#quote-form"
                          data-quote-trigger="true"
                          data-quote-context={item.question}
                          data-quote-source="faq"
                        >
                          {item.cta}
                          <FiArrowRight className="h-4 w-4 shrink-0" />
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Disclaimer */}
          {faq.disclaimer ? (
            <div className="mt-3 rounded-xl border border-[#dbe7f2] bg-white/70 px-4 py-3">
              {ui.disclaimerLabel ? (
                <p className="text-[11px] font-extrabold uppercase tracking-[0.06em] text-[#64768b]">
                  {ui.disclaimerLabel}
                </p>
              ) : null}

              <p className="mt-1 text-[12px] leading-[1.55] text-[#526b84]">
                {faq.disclaimer}
              </p>
            </div>
          ) : null}
        </div>
      </ModelMobileAccordion>
    </section>
  );
}
