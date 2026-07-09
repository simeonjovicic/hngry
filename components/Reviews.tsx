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

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase();
}

function Card({ r }: { r: Review }) {
  return (
    <figure className="flex w-[80vw] max-w-[400px] shrink-0 flex-col gap-6 border border-ink/15 bg-ink/[0.02] p-8">
      <div className="flex items-center justify-between">
        <span className="text-lg tracking-[0.15em] text-tag" aria-hidden>
          {"★".repeat(r.rating)}
        </span>
        <span className="font-mono text-[10px] tracking-[0.2em] text-tag">✓ VERIFIED</span>
      </div>
      <p className="flex-1 text-xl font-medium leading-snug tracking-tight">
        {r.quote}
      </p>
      <figcaption className="flex items-center gap-3 border-t border-ink/10 pt-6">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-ink font-mono text-xs text-bone">
          {initials(r.author)}
        </span>
        <span className="flex flex-col gap-0.5">
          <span className="font-mono text-[11px] tracking-[0.15em]">{r.author}</span>
          <span className="font-mono text-[10px] tracking-[0.15em] text-ink/50">{r.detail}</span>
        </span>
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
          className="animate-ticker flex w-max gap-4 px-2 group-hover:[animation-play-state:paused]"
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
