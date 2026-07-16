import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import Reveal from "@/components/Reveal";

type EditorialSplitProps = {
  index: string;
  eyebrow: string;
  title: ReactNode;
  caption: string;
  cta?: { href: string; label: string };
  image: { src: StaticImageData; alt: string };
  /** true → image on the right, text on the left */
  flip?: boolean;
  /** dark (ink) background instead of bone */
  dark?: boolean;
};

/**
 * Contained two-column editorial section: a portrait campaign image at its
 * natural aspect ratio next to a text column. `flip` swaps the columns via
 * DOM order (image right, text left). Stacks image-first on small screens.
 */
export default function EditorialSplit({
  index,
  eyebrow,
  title,
  caption,
  cta,
  image,
  flip = false,
  dark = false,
}: EditorialSplitProps) {
  const imageCol = (
    <div className={`sm:col-span-5 ${flip ? "max-sm:order-first" : ""}`}>
      <Image
        src={image.src}
        alt={image.alt}
        sizes="(min-width: 1152px) 480px, (min-width: 640px) 42vw, 100vw"
        className="h-auto w-full"
      />
    </div>
  );

  const textCol = (
    <div className="flex flex-col justify-center sm:col-span-7">
      <Reveal>
        <p
          className={`mb-4 font-mono text-[11px] tracking-[0.3em] ${
            dark ? "text-bone/40" : "text-ink/40"
          }`}
        >
          ({index}) — {eyebrow}
        </p>
        <h2 className="max-w-xl font-display text-4xl uppercase leading-[0.95] sm:text-5xl">
          {title}
        </h2>
        <p
          className={`mt-6 max-w-md font-mono text-xs leading-loose tracking-wider ${
            dark ? "text-bone/70" : "text-ink/70"
          }`}
        >
          {caption}
        </p>
        {cta && (
          <Link
            href={cta.href}
            className={`mt-8 inline-block w-max border px-8 py-3 font-mono text-[11px] tracking-[0.25em] transition-colors ${
              dark
                ? "border-bone text-bone hover:bg-bone hover:text-ink"
                : "border-ink text-ink hover:bg-ink hover:text-bone"
            }`}
          >
            {cta.label} →
          </Link>
        )}
      </Reveal>
    </div>
  );

  return (
    <section
      className={`border-b ${
        dark ? "border-ink bg-ink text-bone" : "border-ink/15 bg-bone text-ink"
      }`}
    >
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:grid-cols-12 sm:items-center sm:gap-12 sm:px-8 sm:py-20">
        {flip ? (
          <>
            {textCol}
            {imageCol}
          </>
        ) : (
          <>
            {imageCol}
            {textCol}
          </>
        )}
      </div>
    </section>
  );
}
