import Image from "next/image";
import Link from "next/link";
import { formatPrice, type Product } from "@/lib/products";
import ProductVisual from "./ProductVisual";

export default function ProductCard({ product }: { product: Product }) {
  const soldOut = product.availableSizes.length === 0;
  const [mainPhoto, hoverPhoto] = product.photos ?? [];

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-[8px] bg-smoke">
        {product.badge && (
          <span
            className={`absolute left-3 top-3 z-10 px-2 py-1 font-mono text-[10px] tracking-[0.2em] ${
              product.badge === "NEW"
                ? "bg-ink text-bone"
                : product.badge === "SOLD OUT"
                  ? "bg-bone text-ink line-through"
                  : "bg-tag text-bone"
            }`}
          >
            {product.badge}
          </span>
        )}
        {mainPhoto ? (
          <>
            <Image
              src={mainPhoto.src}
              alt={mainPhoto.alt}
              fill
              sizes="(min-width: 1024px) 33vw, 50vw"
              className={`object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] ${
                soldOut ? "opacity-50" : ""
              }`}
            />
            {hoverPhoto && (
              <Image
                src={hoverPhoto.src}
                alt={hoverPhoto.alt}
                fill
                sizes="(min-width: 1024px) 33vw, 50vw"
                className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            )}
          </>
        ) : (
          <ProductVisual
            art={product.art}
            className={`h-full w-full p-6 transition-transform duration-500 ease-out group-hover:-rotate-2 group-hover:scale-105 ${
              soldOut ? "opacity-50" : ""
            }`}
          />
        )}
        <span className="absolute inset-x-0 bottom-0 z-10 translate-y-full bg-ink py-2 text-center font-mono text-[11px] tracking-[0.25em] text-bone transition-transform duration-300 group-hover:translate-y-0">
          {soldOut ? "SOLD OUT" : "VIEW →"}
        </span>
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <h3 className="font-display text-base uppercase tracking-wide">
            {product.name}
          </h3>
          <p className="mt-0.5 font-mono text-[11px] tracking-wider text-ink/50">
            {product.color}
          </p>
        </div>
        <p className="font-mono text-sm">
          {product.compareAt && (
            <span className="mr-2 text-ink/40 line-through">
              {formatPrice(product.compareAt)}
            </span>
          )}
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
