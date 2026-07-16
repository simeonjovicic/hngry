import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import NewsletterForm from "@/components/NewsletterForm";
import EditorialSplit from "@/components/EditorialSplit";
import LookbookBlock from "@/components/LookbookBlock";
import SocialIcons from "@/components/SocialIcons";
import Reveal from "@/components/Reveal";
import Teaser from "@/components/Teaser";
import { ACCESS_COOKIE, ACCESS_VALUE } from "@/lib/access";
import { ALL_SIZES, formatPrice, getProduct } from "@/lib/products";
import heroSky from "@/public/img/Hngry-horizontal_2.png";
import lookStairs from "@/public/img/Hngry-horizontal_1.png";
import crewRooftop from "@/public/img/Hngry_1.png";
import crewStairs from "@/public/img/Hngry_2.png";
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

          <div className="animate-rise flex flex-col items-start gap-4 [animation-delay:250ms] sm:flex-row sm:items-end sm:justify-between sm:gap-8">
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
                href="/shop"
                className="bg-bone px-6 py-3 font-mono text-xs tracking-[0.25em] text-ink transition-colors hover:bg-tag hover:text-bone sm:px-10 sm:py-4"
              >
                SHOP DROP 001
              </Link>
              <Link
                href="/shop"
                className="hidden font-mono text-xs tracking-[0.25em] text-bone underline underline-offset-8 sm:block"
              >
                EXPLORE →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* (01) THE FIT — portrait image, text at the side */}
      <EditorialSplit
        index="01"
        eyebrow="THE FIT"
        title={
          <>
            Built heavyweight.
            <br />
            Worn everywhere.
          </>
        }
        caption="320GSM COTTON. BOXY CUT. PRINTS THAT DON'T WHISPER. MADE TO BE LIVED IN, NOT FOLDED AWAY."
        cta={{ href: "/shop", label: "SHOP THE FIT" }}
        image={{
          src: crewRooftop,
          alt: "Crew member in a HNGRY tee reading MY FIT IS TOO FLYYY FOR A 9-5, glass towers behind",
        }}
      />

      {/* (02) THE MENTALITY — inverted: text left, portrait image right */}
      <EditorialSplit
        index="02"
        eyebrow="THE MENTALITY"
        title={
          <>
            No office hours.
            <br />
            Stay hngrÿ.
          </>
        }
        caption="FOR THE ONES WHO SKIP THE MEETING AND TAKE THE STAIRS TWO AT A TIME. NEVER ASK FOR PERMISSION."
        cta={{ href: "/shop", label: "ENTER THE SHOP" }}
        image={{
          src: crewBench,
          alt: "Three crew members in HNGRY tees sitting on a bench in the city",
        }}
        flip
      />

      {/* (03) THE DROP — editorial split PDP for the one live product */}
      <section className="border-b border-ink/15">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:grid-cols-12 sm:items-center sm:gap-12 sm:px-8 sm:py-20">
          <div className="sm:col-span-5">
            <Image
              src={crewStairs}
              alt="Overhead shot of the crew standing around a HNGRY tee laid out on stairs"
              sizes="(min-width: 1152px) 480px, (min-width: 640px) 42vw, 100vw"
              className="h-auto w-full"
            />
          </div>

          <div className="flex flex-col justify-center sm:col-span-7">
            <Reveal>
            <p className="mb-4 font-mono text-[11px] tracking-[0.3em] text-ink/40">
              (03) — THE DROP
            </p>

            <div className="flex items-start justify-between gap-4">
              <h2 className="font-display text-4xl uppercase leading-[0.95] sm:text-5xl">
                {drop.name}
              </h2>
              {drop.badge && (
                <span className="mt-2 bg-ink px-2 py-1 font-mono text-[10px] tracking-[0.2em] text-bone">
                  {drop.badge}
                </span>
              )}
            </div>
            <p className="mt-3 font-mono text-lg">
              {formatPrice(drop.price)}
              <span className="ml-3 text-xs tracking-[0.2em] text-ink/40">
                {drop.color}
              </span>
            </p>

            <ul className="mt-8 border-t border-ink/15">
              {drop.details.map((detail) => (
                <li
                  key={detail}
                  className="border-b border-ink/15 py-3 font-mono text-xs uppercase tracking-wider text-ink/70"
                >
                  {detail}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex items-center gap-3">
              {ALL_SIZES.map((size) => {
                const available = drop.availableSizes.includes(size);
                return (
                  <span
                    key={size}
                    className={`flex h-10 w-10 items-center justify-center border font-mono text-xs ${
                      available
                        ? "border-ink text-ink"
                        : "border-ink/20 text-ink/25 line-through"
                    }`}
                  >
                    {size}
                  </span>
                );
              })}
            </div>

            <Link
              href={`/product/${drop.slug}`}
              className="mt-10 inline-block w-max bg-ink px-10 py-4 font-mono text-xs tracking-[0.25em] text-bone transition-colors hover:bg-tag"
            >
              SHOP THE TEE →
            </Link>
          </Reveal>
          </div>
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

      {/* (04) THE CREW — full-bleed lookbook with text overlay */}
      <LookbookBlock
        index="04"
        eyebrow="THE CREW"
        title={
          <>
            Take the stairs.
            <br />
            Two at a time.
          </>
        }
        caption="SHOT ON LOCATION, NOT IN A STUDIO. WORN BY THE ONES WHO MEAN IT."
        cta={{ href: "/shop", label: "SHOP THE DROP" }}
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
