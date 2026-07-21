"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import Reveal from "./Reveal";
import shot1 from "@/public/img/Hngry-horizontal_1.png";
import shot2 from "@/public/img/Hngry-horizontal_2.png";
import shot3 from "@/public/img/Hngry_1.png";
import shot4 from "@/public/img/Hngry_2.png";
import shot5 from "@/public/img/Hngry_3.png";
import vertical1 from "@/public/img/hngry_vertical.png";
import vertical2 from "@/public/img/hngry_vertical2.png";

interface Slide {
  src: StaticImageData;
  alt: string;
  caption?: string;
}

// Campaign shots — existing plus the new portrait ones (newsletter shot lives
// in the popup, not here).
const SOURCES: StaticImageData[] = [
  shot1,
  vertical1,
  shot2,
  vertical2,
  shot3,
  shot4,
  shot5,
];

const SLIDES: Slide[] = SOURCES.map((src) => ({
  src,
  alt: "HNGRY crew campaign shot",
}));

// Three copies so the carousel can wrap seamlessly in both directions.
const LOOP: Slide[] = [...SLIDES, ...SLIDES, ...SLIDES];

export default function Gallery({
  eyebrow = "(03) — THE FEED",
  headingLine1 = "Caught In",
  headingLine2 = "The Wild",
  subline = "The hungry, out in their element. Tag @hngry and catch your fit on the feed.",
  handle = "@HNGRY",
  followLabel = "JOIN THE FEED",
  followHref = "#",
}: {
  eyebrow?: string;
  headingLine1?: string;
  headingLine2?: string;
  subline?: string;
  handle?: string;
  followLabel?: string;
  followHref?: string;
}) {
  const trackRef = useRef<HTMLUListElement>(null);

  // width of one copy = (card + gap) * number of unique slides
  const unit = (el: HTMLElement) => {
    const card = el.querySelector<HTMLElement>("[data-slide]");
    const gap = parseFloat(getComputedStyle(el).columnGap || "0") || 0;
    const cardW = card ? card.getBoundingClientRect().width : el.clientWidth * 0.8;
    return (cardW + gap) * SLIDES.length;
  };

  // keep the scroll position inside the middle copy; wrap by exactly one copy
  // (identical content, so it's invisible)
  const wrap = (el: HTMLElement) => {
    const u = unit(el);
    if (u <= 0) return;
    if (el.scrollLeft >= 2 * u) el.scrollLeft -= u;
    else if (el.scrollLeft < u) el.scrollLeft += u;
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollLeft = unit(el); // start in the middle copy
    });

    let t: number | undefined;
    const onScroll = () => {
      window.clearTimeout(t);
      t = window.setTimeout(() => wrap(el), 150);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollByCard = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    wrap(el); // re-center before animating so it never dead-ends
    const card = el.querySelector<HTMLElement>("[data-slide]");
    const gap = parseFloat(getComputedStyle(el).columnGap || "0") || 0;
    const step = card ? card.getBoundingClientRect().width + gap : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section className="overflow-hidden border-t border-ink/10 bg-bone py-24">
      <Reveal className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <p className="mb-5 font-mono text-[11px] tracking-[0.3em] text-ink/40">
          {eyebrow}
        </p>
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
          <h2 className="font-heading text-5xl uppercase leading-[0.85] sm:text-7xl">
            {headingLine1}
            <br />
            <span className="text-outline">{headingLine2}</span>
          </h2>
          <div className="flex flex-col gap-2 sm:items-end sm:text-right">
            <span className="font-display text-3xl uppercase leading-none sm:text-4xl">
              {handle}
            </span>
            <Link
              href={followHref}
              className="w-max border-b border-ink pb-1 font-mono text-[11px] tracking-[0.25em] transition-opacity hover:opacity-55"
            >
              {followLabel} →
            </Link>
          </div>
        </div>
        <p className="mt-6 max-w-md font-mono text-xs leading-loose tracking-wider text-ink/60">
          {subline}
        </p>
      </Reveal>

      {/* static, click-through carousel that cycles endlessly — constrained to
          the content column so it never runs full-bleed */}
      <div className="relative mx-auto mt-12 max-w-[1440px] px-4 sm:px-8">
        <button
          type="button"
          aria-label="Previous"
          onClick={() => scrollByCard(-1)}
          className="absolute left-4 top-1/2 z-10 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-ink/85 text-2xl text-bone transition hover:bg-ink sm:grid"
        >
          <span className="-translate-y-px">‹</span>
        </button>

        <ul
          ref={trackRef}
          role="list"
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {LOOP.map((slide, i) => (
            <li
              key={i}
              data-slide
              className="w-[42vw] shrink-0 snap-start sm:w-[clamp(17rem,19vw,26rem)]"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-smoke">
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  sizes="(max-width: 640px) 42vw, 19vw"
                  className="object-cover"
                />
              </div>
              {slide.caption && (
                <span className="mt-3 block font-mono text-[11px] tracking-[0.2em] text-ink/45">
                  {slide.caption}
                </span>
              )}
            </li>
          ))}
        </ul>

        <button
          type="button"
          aria-label="Next"
          onClick={() => scrollByCard(1)}
          className="absolute right-4 top-1/2 z-10 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-ink/85 text-2xl text-bone transition hover:bg-ink sm:grid"
        >
          <span className="-translate-y-px">›</span>
        </button>
      </div>
    </section>
  );
}
