"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import Reveal from "./Reveal";
import { products, type Category } from "@/lib/products";

const FILTERS: (Category | "ALL")[] = ["ALL", "TEES", "HOODIES"];

export default function ShopGrid() {
  const [filter, setFilter] = useState<Category | "ALL">("ALL");
  const visible = filter === "ALL" ? products : products.filter((p) => p.category === filter);

  return (
    <>
      <div className="mb-12 flex flex-wrap items-center gap-3">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`border px-6 py-2.5 font-mono text-[11px] tracking-[0.25em] transition-colors ${
              filter === f
                ? "border-ink bg-ink text-bone"
                : "border-ink/30 hover:border-ink"
            }`}
          >
            {f}
          </button>
        ))}
        <span className="ml-auto hidden font-mono text-[11px] tracking-[0.25em] text-ink/40 sm:block">
          {visible.length} {visible.length === 1 ? "PIECE" : "PIECES"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-14 lg:grid-cols-3">
        {visible.map((p, i) => (
          <Reveal key={`${filter}-${p.slug}`} delay={i * 70}>
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>
    </>
  );
}
