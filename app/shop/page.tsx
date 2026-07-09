import type { Metadata } from "next";
import Link from "next/link";
import ShopGrid from "@/components/ShopGrid";

export const metadata: Metadata = {
  title: "SHOP — HNGRŸ",
};

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-8">
      <Link
        href="/"
        className="mb-8 inline-block font-mono text-[11px] tracking-[0.25em] underline-offset-4 hover:underline"
      >
        ← BACK TO HOME
      </Link>
      <div className="mb-12">
        <p className="mb-3 font-mono text-[11px] tracking-[0.3em] text-ink/40">
          SUMMER 26 — EVERYTHING WE GOT
        </p>
        <h1 className="font-display text-6xl uppercase leading-none sm:text-8xl lg:text-9xl">
          Drop <span className="text-outline">001</span>
        </h1>
      </div>
      <ShopGrid />
    </div>
  );
}
