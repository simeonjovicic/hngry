"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import { ALL_SIZES, type Product, type Size } from "@/lib/products";

export default function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  const [size, setSize] = useState<Size | null>(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState(false);

  const soldOut = product.availableSizes.length === 0;

  const handleAdd = () => {
    if (!size) {
      setError(true);
      return;
    }
    add(product.slug, size, qty);
    setQty(1);
  };

  return (
    <div>
      <p className="mb-3 font-mono text-[11px] tracking-[0.25em]">
        SIZE:{" "}
        {error && !size && (
          <span className="text-tag">← PICK ONE FIRST</span>
        )}
      </p>
      <div className="flex flex-wrap gap-2">
        {ALL_SIZES.map((s) => {
          const available = product.availableSizes.includes(s);
          const selected = size === s;
          return (
            <button
              key={s}
              disabled={!available}
              onClick={() => {
                setSize(s);
                setError(false);
              }}
              className={`min-w-16 border px-4 py-3 font-mono text-xs tracking-widest transition-colors ${
                selected
                  ? "border-ink bg-ink text-bone"
                  : available
                    ? "border-ink hover:bg-ink hover:text-bone"
                    : "cursor-not-allowed border-ink/30 text-ink/30 line-through"
              }`}
            >
              {s}
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex gap-3">
        <div className="flex items-center border border-ink font-mono text-sm">
          <button
            className="px-4 py-4 transition-colors hover:bg-ink hover:text-bone"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={soldOut}
          >
            −
          </button>
          <span className="w-10 text-center">{qty}</span>
          <button
            className="px-4 py-4 transition-colors hover:bg-ink hover:text-bone"
            onClick={() => setQty((q) => q + 1)}
            disabled={soldOut}
          >
            +
          </button>
        </div>
        <button
          onClick={handleAdd}
          disabled={soldOut}
          className={`flex-1 border border-ink py-4 font-mono text-sm tracking-[0.25em] transition-colors ${
            soldOut
              ? "cursor-not-allowed opacity-40"
              : "bg-ink text-bone hover:bg-tag hover:border-tag"
          }`}
        >
          {soldOut ? "SOLD OUT" : "ADD TO BAG"}
        </button>
      </div>

      <p className="mt-4 text-center font-mono text-[10px] leading-relaxed tracking-[0.2em] text-ink/40">
        VISA / MASTERCARD / APPLE PAY / GOOGLE PAY
        <br />
        SECURE CHECKOUT VIA STRIPE
      </p>
    </div>
  );
}
