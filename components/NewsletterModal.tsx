"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import NewsletterForm from "./NewsletterForm";
import modalImg from "@/public/img/Hngry_1.png";

const SESSION_KEY = "hngry_community_seen";
const DELAY_MS = 12000; // ~12s
const SCROLL_TRIGGER = 0.45; // 45% down the page

/**
 * On Shopify, the Customer Privacy consent banner mounts as
 * `#shopify-pc__banner` pinned to the bottom-right. In this Next.js app that
 * element never exists, so this check is a harmless no-op here — it keeps the
 * popup from stacking on top of the cookie banner if this pattern is reused on
 * the storefront (the modal is centered, so it never overlaps the banner, and
 * this defers opening until the banner is dismissed).
 */
function cookieBannerVisible() {
  const el = document.getElementById("shopify-pc__banner");
  return !!el && el.offsetParent !== null;
}

export default function NewsletterModal() {
  const [open, setOpen] = useState(false);
  const openedRef = useRef(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  // trigger: whichever fires first — 12s delay OR 45% scroll
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;

    const reveal = () => {
      if (openedRef.current || cookieBannerVisible()) return;
      openedRef.current = true;
      sessionStorage.setItem(SESSION_KEY, "1");
      setOpen(true);
      cleanup();
    };

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max >= SCROLL_TRIGGER) reveal();
    };

    const timer = window.setTimeout(reveal, DELAY_MS);
    window.addEventListener("scroll", onScroll, { passive: true });

    function cleanup() {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    }
    return cleanup;
  }, []);

  // when open: lock body scroll, focus close, close on Esc
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="hngry-community-title"
    >
      {/* backdrop — vignette: darker at the edges, lighter toward the center */}
      <div
        onClick={() => setOpen(false)}
        className="absolute inset-0 [animation:hngry-modal-backdrop_0.35s_ease_both]"
        style={{ background: "rgba(8,8,8,0.85)" }}
        aria-hidden
      />

      {/* panel — split: campaign image left, form right */}
      <div className="relative flex max-h-[calc(100vh-2rem)] w-full max-w-4xl flex-col overflow-hidden border border-ink bg-bone [animation:hngry-modal-panel_0.55s_cubic-bezier(0.22,1,0.36,1)_0.28s_both] sm:min-h-[min(38rem,calc(100vh_-_2rem))] sm:flex-row">
        {/* image — top band on mobile, left column on desktop */}
        <div className="relative h-[20vh] w-full shrink-0 sm:h-auto sm:w-2/5 sm:self-stretch">
          <Image
            src={modalImg}
            alt="HNGRY crew campaign shot"
            fill
            sizes="(min-width: 640px) 40vw, 0px"
            className="object-cover"
          />
          <span className="absolute bottom-4 left-4 font-mono text-[10px] tracking-[0.25em] text-bone/90 mix-blend-difference">
            DROP 001 / SUMMER 26
          </span>
        </div>

        {/* content column */}
        <div className="relative flex flex-1 flex-col overflow-y-auto p-6 sm:justify-center sm:p-14">
          <button
            ref={closeRef}
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="absolute right-4 top-4 font-mono text-lg leading-none text-ink/50 transition-colors hover:text-ink"
          >
            ✕
          </button>

          <p className="font-mono text-base tracking-[0.3em] text-tag sm:text-lg">
            EARLY ACCESS — DROP 001
          </p>
          <h2
            id="hngry-community-title"
            className="mt-4 bg-gradient-to-br from-ink via-ink to-[#7a7a7a] bg-clip-text font-heading text-4xl uppercase leading-[0.85] text-transparent sm:text-7xl"
          >
            Join the
            <br />
            <span>Hungry.</span>
          </h2>
          <p className="mt-6 max-w-md font-mono text-base leading-relaxed tracking-wider text-ink/60 sm:text-xl">
            First dibs on every drop. No spam, just drops.
          </p>

          <div className="mt-8">
            <NewsletterForm />
          </div>

          <p className="mt-6 font-mono text-sm tracking-[0.25em] text-ink/40">
            NO SPAM. ONLY DROPS.
          </p>
        </div>
      </div>
    </div>
  );
}
