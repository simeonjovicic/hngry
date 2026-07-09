import Reveal from "./Reveal";

interface Review {
  rating: number;
  quote: string;
  author: string;
  detail: string;
}

const REVIEWS: Review[] = [
  { rating: 5, quote: "Heaviest tee I own. Fit is exactly as promised — too flyyy for a 9-5.", author: "MARCO K.", detail: "FLYYY 9–5 TEE" },
  { rating: 5, quote: "Copped the drop in 4 minutes flat. Quality is unreal, print doesn't crack.", author: "AYA R.", detail: "NO 9–5 TEE" },
  { rating: 5, quote: "Washed hoodie hits different. Already waiting on the next drop.", author: "DEN B.", detail: "STAY HNGRŸ HOODIE" },
  { rating: 5, quote: "Fabric is thick, stitching is clean. Feels like triple the price.", author: "LEO M.", detail: "FLYYY 9–5 TEE" },
  { rating: 5, quote: "Got stopped three times asking where it's from. That's the whole point.", author: "SIMI T.", detail: "NO 9–5 TEE" },
  { rating: 5, quote: "Sizing is spot on for the boxy look. Never taking it off.", author: "JON P.", detail: "STAY HNGRŸ HOODIE" },
];

function Card({ r }: { r: Review }) {
  return (
    <figure className="flex w-[78vw] max-w-[440px] shrink-0 flex-col justify-between gap-8 border-l border-ink/10 px-10 py-2">
      <div className="flex items-center gap-3">
        <span className="text-base tracking-[0.2em] text-tag" aria-hidden>
          {"★".repeat(r.rating)}
        </span>
        <span className="font-mono text-[9px] tracking-[0.25em] text-ink/35">
          VERIFIED
        </span>
      </div>
      <p className="text-2xl font-medium leading-[1.35] tracking-tight">
        {r.quote}
      </p>
      <figcaption className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.18em]">
        <span>{r.author}</span>
        <span className="text-ink/25">/</span>
        <span className="text-ink/45">{r.detail}</span>
      </figcaption>
    </figure>
  );
}

const EDGE_FADE = {
  maskImage: "linear-gradient(to right, transparent, #000 5%, #000 95%, transparent)",
  WebkitMaskImage: "linear-gradient(to right, transparent, #000 5%, #000 95%, transparent)",
} as const;

export default function Reviews() {
  const track = [...REVIEWS, ...REVIEWS];

  return (
    <section className="overflow-hidden border-t border-ink/10 bg-bone py-24">
      {/* header */}
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <Reveal>
          <p className="mb-5 font-mono text-[11px] tracking-[0.3em] text-ink/40">
            (04) — THE VERDICT
          </p>
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
            <h2 className="font-display text-6xl uppercase leading-[0.82] sm:text-8xl">
              Worn By The
              <br />
              <span className="text-outline">Hungry</span>
            </h2>
            <div className="flex items-end gap-4">
              <span className="font-display text-7xl leading-[0.75] sm:text-8xl">4.9</span>
              <div className="flex flex-col gap-1.5 pb-2">
                <span className="text-xl tracking-[0.15em] text-tag">★★★★★</span>
                <span className="font-mono text-[10px] tracking-[0.2em] text-ink/50">
                  300+ VERIFIED REVIEWS
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* scrolling review marquee — on-brand with the site's tickers */}
      <div className="group mt-14 select-none" style={EDGE_FADE}>
        <div
          className="animate-ticker flex w-max group-hover:[animation-play-state:paused]"
          style={{ animationDuration: "70s" }}
        >
          {[...track, ...track].map((r, i) => (
            <Card key={i} r={r} />
          ))}
        </div>
      </div>
    </section>
  );
}
