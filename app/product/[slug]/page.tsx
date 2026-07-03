import type { Metadata } from "next";
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

  const related = products.filter((p) => p.slug !== product.slug).slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
      <Link
        href="/shop"
        className="font-mono text-[11px] tracking-[0.25em] underline-offset-4 hover:underline"
      >
        ← BACK TO SHOP
      </Link>

      <div className="mt-8 grid gap-12 lg:grid-cols-2">
        <div className="relative aspect-square bg-smoke">
          {product.badge && (
            <span className="absolute left-4 top-4 z-10 bg-ink px-2 py-1 font-mono text-[10px] tracking-[0.2em] text-bone">
              {product.badge}
            </span>
          )}
          <ProductVisual art={product.art} className="h-full w-full p-10" />
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

      <div className="mt-24">
        <h2 className="mb-8 font-display text-3xl uppercase sm:text-4xl">
          You might also want
        </h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3">
          {related.map((p) => (
            <Link key={p.slug} href={`/product/${p.slug}`} className="group block">
              <div className="aspect-square overflow-hidden bg-smoke">
                <ProductVisual
                  art={p.art}
                  className="h-full w-full p-6 transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="mt-3 flex justify-between">
                <h3 className="font-display text-sm uppercase">{p.name}</h3>
                <p className="font-mono text-xs">{formatPrice(p.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
