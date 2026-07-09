import Link from "next/link";
import { cookies } from "next/headers";
import HeroShader from "@/components/HeroShader";
import NewsletterForm from "@/components/NewsletterForm";
import ProductVisual from "@/components/ProductVisual";
import SocialIcons from "@/components/SocialIcons";
import Reveal from "@/components/Reveal";
import Reviews from "@/components/Reviews";
import Teaser from "@/components/Teaser";
import { ACCESS_COOKIE, ACCESS_VALUE } from "@/lib/access";

export default async function Home() {
  const store = await cookies();
  const unlocked = store.get(ACCESS_COOKIE)?.value === ACCESS_VALUE;
  if (!unlocked) return <Teaser />;

  return (
    <>
      {/* HERO — fills exactly one viewport below ticker (h-8) + header (h-16) */}
      <section className="relative h-[calc(100dvh-6rem)] min-h-[540px] overflow-hidden border-b border-ink/15">
        <HeroShader />
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-5 sm:p-10">
          <div className="animate-rise flex items-baseline justify-between font-mono text-[11px] tracking-[0.25em]">
            <span>EST. 2026 — CLOTHES FOR THE HUNGRY</span>
            <span className="hidden sm:block">DROP 001 / SUMMER 26</span>
          </div>

          <div className="animate-rise flex flex-col items-start gap-8 [animation-delay:250ms] sm:flex-row sm:items-end sm:justify-between">
            <p className="font-mono text-[11px] leading-relaxed tracking-[0.25em]">
              HEAVYWEIGHT ONLY.
              <br />
              NO OFFICE HOURS.
              <br />
              STAY HNGRŸ.
            </p>
            <div className="pointer-events-auto flex items-center gap-6">
              <Link
                href="/shop"
                className="bg-ink px-10 py-4 font-mono text-xs tracking-[0.25em] text-bone transition-colors hover:bg-tag"
              >
                SHOP DROP 001
              </Link>
              <Link
                href="/shop"
                className="hidden font-mono text-xs tracking-[0.25em] underline underline-offset-8 sm:block"
              >
                EXPLORE →
              </Link>
            </div>
          </div>
        </div>
        <span className="animate-scroll-hint absolute bottom-4 left-1/2 hidden -translate-x-1/2 font-mono text-[10px] tracking-[0.3em] sm:block">
          SCROLL ↓
        </span>
      </section>

      {/* CHOOSE YOUR WEAPON — dark, editorial grid */}
      <section className="bg-ink py-20 text-bone">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <Reveal>
            <p className="mb-4 font-mono text-[11px] tracking-[0.3em] text-bone/40">
              (01) — THE ARSENAL
            </p>
            <div className="mb-12 flex items-end justify-between">
              <h2 className="font-display text-5xl uppercase sm:text-7xl">
                Choose Your <span className="text-outline-bone">Weapon</span>
              </h2>
              <Link
                href="/shop"
                className="hidden font-mono text-[11px] tracking-[0.25em] underline underline-offset-8 sm:block"
              >
                VIEW ALL →
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-3">
            {[
              { label: "TEES", sub: "HEAVYWEIGHT. BOXY. LOUD.", art: "flyyy-front" as const },
              { label: "HOODIES", sub: "WASHED. FADED. OVERSIZED.", art: "hoodie-grey" as const },
              { label: "DROP 001", sub: "THE FIRST STATEMENT.", art: "logo-black-tee" as const },
            ].map((cat, i) => (
              <Reveal
                key={cat.label}
                delay={i * 120}
                className={i % 3 === 1 ? "lg:translate-y-10" : ""}
              >
                <Link href="/shop" className="group block">
                  <div className="relative aspect-square overflow-hidden bg-bone/10">
                    <ProductVisual
                      art={cat.art}
                      className="h-full w-full p-6 transition-transform duration-500 group-hover:-rotate-2 group-hover:scale-105"
                    />
                    <span className="absolute inset-x-0 bottom-0 translate-y-full bg-bone py-2 text-center font-mono text-[11px] tracking-[0.25em] text-ink transition-transform duration-300 group-hover:translate-y-0">
                      SHOP {cat.label} →
                    </span>
                  </div>
                  <div className="mt-3 flex items-start justify-between gap-2">
                    <h3 className="font-display text-xl uppercase tracking-wide">
                      {cat.label}
                    </h3>
                    <p className="mt-1 font-mono text-[10px] tracking-[0.2em] text-bone/50">
                      {cat.sub}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* STATEMENT — double marquee, opposite directions */}
      <section className="overflow-hidden border-b border-ink bg-bone py-14">
        <p className="animate-ticker-slow flex w-max whitespace-nowrap font-display text-7xl uppercase leading-none sm:text-9xl">
          <span>TOO FLYYY FOR A 9–5&nbsp;✦&nbsp;TOO FLYYY FOR A 9–5&nbsp;✦&nbsp;</span>
          <span aria-hidden>TOO FLYYY FOR A 9–5&nbsp;✦&nbsp;TOO FLYYY FOR A 9–5&nbsp;✦&nbsp;</span>
        </p>
        <p className="animate-ticker-rev mt-4 flex w-max whitespace-nowrap font-display text-7xl uppercase leading-none sm:text-9xl">
          <span className="text-outline">
            STAY HNGRŸ&nbsp;✦&nbsp;STAY HNGRŸ&nbsp;✦&nbsp;STAY HNGRŸ&nbsp;✦&nbsp;
          </span>
          <span aria-hidden className="text-outline">
            STAY HNGRŸ&nbsp;✦&nbsp;STAY HNGRŸ&nbsp;✦&nbsp;STAY HNGRŸ&nbsp;✦&nbsp;
          </span>
        </p>
      </section>

      {/* THE POINT — manifesto + newsletter */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2">
          <Reveal>
            <p className="mb-4 font-mono text-[11px] tracking-[0.3em] text-ink/40">
              (03) — THE POINT
            </p>
            <h2 className="font-display text-4xl uppercase leading-tight sm:text-5xl">
              Clothes for the ones
              <br />
              <span className="text-outline">who want more.</span>
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <div className="flex h-full flex-col justify-between gap-8">
              <p className="max-w-md font-mono text-xs leading-loose tracking-wider text-ink/70">
                HNGRŸ IS NOT A BRAND FOR EVERYBODY. IT&apos;S FOR THE ONES WHO SKIP
                THE MEETING, TAKE THE STAIRS TWO AT A TIME AND NEVER ASK FOR
                PERMISSION. HEAVYWEIGHT FABRICS, HONEST CUTS, PRINTS THAT SAY WHAT
                YOU THINK. STAY HUNGRY.
              </p>
              <Link
                href="/shop"
                className="w-max border border-ink px-10 py-4 font-mono text-xs tracking-[0.25em] transition-colors hover:bg-ink hover:text-bone"
              >
                ENTER THE SHOP →
              </Link>
            </div>
          </Reveal>
        </div>

        {/* newsletter */}
        <Reveal className="mt-20 border-t border-ink pt-12">
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

      <Reviews />
    </>
  );
}
