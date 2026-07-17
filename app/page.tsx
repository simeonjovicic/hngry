import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import AddToCart from "@/components/AddToCart";
import NewsletterForm from "@/components/NewsletterForm";
import EditorialSplit from "@/components/EditorialSplit";
import LookbookBlock from "@/components/LookbookBlock";
import SocialIcons from "@/components/SocialIcons";
import Reveal from "@/components/Reveal";
import Teaser from "@/components/Teaser";
import { ACCESS_COOKIE, ACCESS_VALUE } from "@/lib/access";
import { formatPrice, getProduct } from "@/lib/products";
import heroSky from "@/public/img/Hngry-horizontal_2.png";
import lookStairs from "@/public/img/Hngry-horizontal_1.png";
import crewBench from "@/public/img/Hngry_3.png";

export default async function Home() {
  const store = await cookies();
  const unlocked = store.get(ACCESS_COOKIE)?.value === ACCESS_VALUE;
  if (!unlocked) return <Teaser />;

  const drop = getProduct("flyyy-9-5-tee")!;

  return (
    <>
      {/* HERO — horizontal campaign image at its natural aspect ratio */}
      <section className="relative w-full overflow-hidden border-b border-ink/15">
        <Image
          src={heroSky}
          alt="Three crew members in HNGRY tees on a rooftop against a blue sky"
          preload
          sizes="100vw"
          className="h-auto w-full"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/15 to-ink/25" />

        <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-10">
          <div className="animate-rise flex items-baseline justify-between font-mono text-[11px] tracking-[0.25em] text-bone/90">
            <span>EST. 2026 — CLOTHES FOR THE HUNGRY</span>
            <span className="hidden sm:block">DROP 001 / SUMMER 26</span>
          </div>

          <div className="animate-rise flex flex-col items-start gap-4 [animation-delay:250ms] sm:gap-6">
            <div>
              <h1 className="font-display text-3xl uppercase leading-[0.95] text-bone sm:text-6xl lg:text-7xl">
                Too flyyy
                <br />
                for a 9–5.
              </h1>
              <p className="mt-3 hidden font-mono text-[11px] tracking-[0.25em] text-bone/80 sm:block">
                HEAVYWEIGHT DROP 001 — LIVE 20.07.
              </p>
            </div>
            <div className="flex items-center gap-6">
              <Link
                href="/product/flyyy-9-5-tee"
                className="bg-bone px-6 py-3 font-mono text-xs tracking-[0.25em] text-ink transition-colors hover:bg-tag hover:text-bone sm:px-10 sm:py-4"
              >
                SHOP DROP 001
              </Link>
              <Link
                href="/product/flyyy-9-5-tee"
                className="hidden font-mono text-xs tracking-[0.25em] text-bone underline underline-offset-8 sm:block"
              >
                EXPLORE →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* (01) THE MENTALITY — text left, portrait image right */}
      <EditorialSplit
        index="01"
        eyebrow="THE MENTALITY"
        title={
          <>
            No office hours.
            <br />
            Stay hngrÿ.
          </>
        }
        caption="FOR THE ONES WHO SKIP THE MEETING AND TAKE THE STAIRS TWO AT A TIME. NEVER ASK FOR PERMISSION."
        cta={{ href: "/product/flyyy-9-5-tee", label: "GET THE TEE" }}
        image={{
          src: crewBench,
          alt: "Three crew members in HNGRY tees sitting on a bench in the city",
        }}
        flip
      />

      {/* (02) THE DROP — featured product with full buy panel */}
      <section className="border-b border-ink/15 bg-bone py-20 sm:py-28">
        <Reveal>
          <p className="text-center font-mono text-[11px] tracking-[0.3em] text-ink/40">
            (02) — THE DROP
          </p>
          <h2 className="mt-3 text-center font-display text-3xl uppercase tracking-[0.15em] sm:text-4xl">
            Featured Product
          </h2>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-5xl items-center gap-10 px-4 sm:mt-20 sm:grid-cols-2 sm:gap-14 sm:px-8 lg:gap-20">
          {/* product photo — crisp hairline frame */}
          <Reveal>
            <Link
              href={`/product/${drop.slug}`}
              className="group relative block overflow-hidden border border-ink/10 bg-smoke transition-colors duration-300 hover:border-ink/30"
            >
              {drop.badge && (
                <span className="absolute left-4 top-4 z-10 bg-ink px-2 py-1 font-mono text-[10px] tracking-[0.2em] text-bone">
                  {drop.badge}
                </span>
              )}
              <Image
                src={drop.photos![0].src}
                alt={drop.photos![0].alt}
                sizes="(min-width: 640px) 50vw, 100vw"
                className="h-auto w-full"
              />
              {drop.photos![1] && (
                <Image
                  src={drop.photos![1].src}
                  alt={drop.photos![1].alt}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
              )}
            </Link>
          </Reveal>

          {/* buy panel */}
          <Reveal delay={120}>
            <div className="mx-auto max-w-md">
              <h3 className="font-display text-3xl uppercase tracking-[0.1em] sm:text-4xl">
                {drop.name}
              </h3>
              <p className="mt-3 font-mono text-lg">
                {formatPrice(drop.price)}
                <span className="ml-3 text-[11px] tracking-[0.2em] text-ink/40">
                  {drop.color} / DROP 001
                </span>
              </p>

              <div className="my-8 border-t border-ink/10" />

              <AddToCart product={drop} />

              <div className="my-8 border-t border-ink/10" />

              <Link
                href={`/product/${drop.slug}`}
                className="inline-block font-mono text-[11px] tracking-[0.25em] text-ink/60 underline underline-offset-8 transition-colors hover:text-ink"
              >
                VIEW PRODUCT DETAILS →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* STATEMENT — double marquee, opposite directions */}
      <section className="overflow-hidden border-b border-ink bg-bone py-6">
        <p className="animate-ticker-slow flex w-max whitespace-nowrap font-display text-xl uppercase leading-none sm:text-3xl">
          <span>TOO FLYYY FOR A 9–5&nbsp;✦&nbsp;TOO FLYYY FOR A 9–5&nbsp;✦&nbsp;</span>
          <span aria-hidden>TOO FLYYY FOR A 9–5&nbsp;✦&nbsp;TOO FLYYY FOR A 9–5&nbsp;✦&nbsp;</span>
        </p>
        <p className="animate-ticker-rev mt-2 flex w-max whitespace-nowrap font-display text-xl uppercase leading-none sm:text-3xl">
          <span className="text-outline">
            STAY HNGRŸ&nbsp;✦&nbsp;STAY HNGRŸ&nbsp;✦&nbsp;STAY HNGRŸ&nbsp;✦&nbsp;
          </span>
          <span aria-hidden className="text-outline">
            STAY HNGRŸ&nbsp;✦&nbsp;STAY HNGRŸ&nbsp;✦&nbsp;STAY HNGRŸ&nbsp;✦&nbsp;
          </span>
        </p>
      </section>

      {/* (03) THE CREW — full-bleed lookbook with text overlay */}
      <LookbookBlock
        index="03"
        eyebrow="THE CREW"
        title={
          <>
            Take the stairs.
            <br />
            Two at a time.
          </>
        }
        caption="SHOT ON LOCATION, NOT IN A STUDIO. WORN BY THE ONES WHO MEAN IT."
        cta={{ href: "/product/flyyy-9-5-tee", label: "SHOP THE DROP" }}
        image={{
          src: lookStairs,
          alt: "Overhead shot of the crew on a staircase around a HNGRY tee laid on the steps",
        }}
        align="right"
      />

      {/* NEWSLETTER */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-8">
        <Reveal>
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <p className="mb-4 font-mono text-[11px] tracking-[0.3em] text-ink/40">
                NEWSLETTER — GET THE DROP FIRST
              </p>
              <h3 className="font-display text-3xl uppercase leading-tight sm:text-4xl">
                Drop 001 lands 20.07.
                <br />
                <span className="text-outline">Be there first.</span>
              </h3>
            </div>
            <div className="flex flex-col justify-end gap-5">
              <NewsletterForm />
              <p className="font-mono text-[10px] tracking-[0.25em] text-ink/40">
                NO SPAM. ONLY DROPS. UNSUBSCRIBE WHENEVER.
              </p>
              <SocialIcons />
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
