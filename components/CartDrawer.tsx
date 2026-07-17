"use client";

import Image from "next/image";
import { useCart } from "@/lib/cart";
import { formatPrice, getProduct } from "@/lib/products";
import ProductVisual from "./ProductVisual";

export default function CartDrawer() {
  const { items, subtotal, isOpen, close, remove, setQty } = useCart();

  return (
    <>
      {/* backdrop */}
      <div
        onClick={close}
        className={`fixed inset-0 z-50 bg-ink/50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-bone transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between border-b border-ink px-6 py-5">
          <h2 className="font-mono text-sm tracking-[0.2em]">
            YOUR BAG ({items.length})
          </h2>
          <button
            onClick={close}
            className="font-mono text-sm tracking-widest underline-offset-4 hover:underline"
          >
            CLOSE ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3">
              <p className="font-display text-3xl uppercase">Nothing here.</p>
              <p className="font-mono text-xs tracking-widest text-ink/60">
                STAY HNGRŸ — GO FILL IT UP.
              </p>
            </div>
          ) : (
            items.map((item) => {
              const product = getProduct(item.slug);
              if (!product) return null;
              return (
                <div
                  key={`${item.slug}-${item.size}`}
                  className="flex gap-4 border-b border-ink/15 py-5"
                >
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden bg-smoke">
                    {product.photos ? (
                      <Image
                        src={product.photos[0].src}
                        alt={product.photos[0].alt}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    ) : (
                      <ProductVisual art={product.art} className="h-full w-full" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-display text-sm uppercase tracking-wide">
                          {product.name}
                        </p>
                        <p className="mt-1 font-mono text-[11px] text-ink/60">
                          {product.color} / {item.size}
                        </p>
                      </div>
                      <p className="font-mono text-xs">{formatPrice(product.price)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-ink font-mono text-xs">
                        <button
                          className="px-3 py-1 hover:bg-ink hover:text-bone"
                          onClick={() => setQty(item.slug, item.size, item.qty - 1)}
                        >
                          −
                        </button>
                        <span className="w-8 text-center">{item.qty}</span>
                        <button
                          className="px-3 py-1 hover:bg-ink hover:text-bone"
                          onClick={() => setQty(item.slug, item.size, item.qty + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => remove(item.slug, item.size)}
                        className="font-mono text-[11px] tracking-widest text-ink/50 underline-offset-4 hover:underline"
                      >
                        REMOVE
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-ink px-6 py-5">
            <div className="mb-4 flex justify-between font-mono text-sm tracking-widest">
              <span>SUBTOTAL</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <p className="mb-3 font-mono text-[10px] tracking-wider text-ink/50">
              SHIPPING + TAXES CALCULATED AT CHECKOUT
            </p>
            <button
              className="w-full bg-ink py-4 font-mono text-sm tracking-[0.25em] text-bone transition-colors hover:bg-ink/80"
              onClick={() => alert("Stripe checkout coming next — design phase first.")}
            >
              CHECKOUT →
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
