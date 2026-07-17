import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCart from "@/components/AddToCart";
import ProductVisual from "@/components/ProductVisual";
import { formatPrice, getProduct, products } from "@/lib/products";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  return { title: product ? `${product.name} — HNGRŸ` : "HNGRŸ" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
      <Link
        href="/"
        className="font-mono text-[11px] tracking-[0.25em] underline-offset-4 hover:underline"
      >
        ← BACK TO HOME
      </Link>

      <div className="mt-8 grid gap-12 lg:grid-cols-2">
        <div>
          <div className="relative bg-smoke">
            {product.badge && (
              <span className="absolute left-4 top-4 z-10 bg-ink px-2 py-1 font-mono text-[10px] tracking-[0.2em] text-bone">
                {product.badge}
              </span>
            )}
            {product.photos ? (
              <Image
                src={product.photos[0].src}
                alt={product.photos[0].alt}
                preload
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="h-auto w-full"
              />
            ) : (
              <div className="aspect-square">
                <ProductVisual art={product.art} className="h-full w-full p-10" />
              </div>
            )}
          </div>
          {product.photos && product.photos.length > 1 && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {product.photos.slice(1).map((photo) => (
                <Image
                  key={photo.alt}
                  src={photo.src}
                  alt={photo.alt}
                  sizes="(min-width: 1024px) 16vw, 33vw"
                  className="h-auto w-full bg-smoke"
                />
              ))}
            </div>
          )}
        </div>

        <div className="max-w-lg">
          <h1 className="font-display text-4xl uppercase sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-2 font-mono text-[11px] tracking-[0.25em] text-ink/50">
            {product.color} / DROP 001
          </p>
          <p className="mt-4 font-mono text-xl">
            {product.compareAt && (
              <span className="mr-3 text-ink/40 line-through">
                {formatPrice(product.compareAt)}
              </span>
            )}
            {formatPrice(product.price)}
          </p>

          <p className="mt-6 border-l-2 border-ink pl-4 text-sm leading-relaxed text-ink/80">
            {product.description}
          </p>

          <div className="mt-8">
            <AddToCart product={product} />
          </div>

          <div className="mt-10 border-t border-ink/15 pt-6">
            <p className="mb-4 font-mono text-[11px] tracking-[0.25em]">DETAILS</p>
            <ul className="space-y-2">
              {product.details.map((d) => (
                <li
                  key={d}
                  className="font-mono text-xs leading-relaxed tracking-wider text-ink/60"
                >
                  ✦ {d.toUpperCase()}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}
