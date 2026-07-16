import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import Reveal from "@/components/Reveal";

type LookbookBlockProps = {
  index: string;
  eyebrow: string;
  title: ReactNode;
  caption?: string;
  cta?: { href: string; label: string };
  align?: "left" | "right";
  tall?: boolean;
  image?: { src: StaticImageData; alt: string };
};

/**
 * Full-bleed lifestyle/lookbook block with the editorial text overlaid on the
 * image. The section takes the image's natural aspect ratio; a minimum height
 * keeps the overlay readable on small screens (the image is then cropped via
 * object-cover — never distorted). Falls back to a hatched placeholder
 * surface without an image.
 */
export default function LookbookBlock({
  index,
  eyebrow,
  title,
  caption,
  cta,
  align = "left",
  tall = false,
  image,
}: LookbookBlockProps) {
  const alignClasses =
    align === "right" ? "items-end text-right" : "items-start";

  const editorial = (
    <Reveal>
      <p className="mb-3 font-mono text-[11px] tracking-[0.3em] text-bone/60">
        ({index}) — {eyebrow}
      </p>
      <h2 className="max-w-2xl font-display text-4xl uppercase leading-[0.95] text-bone sm:text-6xl">
        {title}
      </h2>
      {caption && (
        <p
          className={`mt-4 max-w-md font-mono text-xs leading-loose tracking-wider text-bone/70 ${
            align === "right" ? "ml-auto" : ""
          }`}
        >
          {caption}
        </p>
      )}
      {cta && (
        <Link
          href={cta.href}
          className="mt-6 inline-block border border-bone px-8 py-3 font-mono text-[11px] tracking-[0.25em] text-bone transition-colors hover:bg-bone hover:text-ink"
        >
          {cta.label} →
        </Link>
      )}
    </Reveal>
  );

  if (image) {
    return (
      <section
        className="relative flex min-h-[480px] w-full overflow-hidden border-b border-ink/15"
        style={{ aspectRatio: `${image.src.width} / ${image.src.height}` }}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="100vw"
          className="object-cover"
        />

        {/* scrim so overlay type stays legible over the image */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/20 to-transparent" />

        {/* editorial overlay */}
        <div
          className={`relative flex w-full flex-col justify-end p-6 sm:p-12 ${alignClasses}`}
        >
          {editorial}
        </div>
      </section>
    );
  }

  return (
    <section
      className={`relative flex w-full overflow-hidden border-b border-ink/15 bg-smoke ${
        tall ? "min-h-[92vh]" : "min-h-[70vh]"
      }`}
    >
      <div className="placeholder-hatch absolute inset-0 flex items-center justify-center">
        <span className="rounded-full border border-ink/25 px-4 py-1 font-mono text-[10px] tracking-[0.3em] text-ink/40">
          IMAGE PLACEHOLDER
        </span>
      </div>

      {/* scrim so overlay type stays legible over the image */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/20 to-transparent" />

      {/* editorial overlay */}
      <div
        className={`relative flex w-full flex-col justify-end p-6 sm:p-12 ${alignClasses}`}
      >
        {editorial}
      </div>
    </section>
  );
}
