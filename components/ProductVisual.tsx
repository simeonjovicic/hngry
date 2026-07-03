import Image from "next/image";
import type { ProductArt } from "@/lib/products";

/*
 * Placeholder garment art rendered as flat SVG mockups until real product
 * photos are shot. Swap this component's output for <Image src={photo}/>
 * per product later — the card layout won't change.
 */

const INK = "#101010";

function TeeShape({ fill, stroke }: { fill: string; stroke: string }) {
  return (
    <g>
      <path
        d="M158 62 C170 50 186 44 200 44 C214 44 230 50 242 62
           L296 82 L342 158 L290 188 L272 158 L272 344
           C272 352 266 356 258 356 L142 356 C134 356 128 352 128 344
           L128 158 L110 188 L58 158 L104 82 Z"
        fill={fill}
        stroke={stroke}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M162 60 C172 74 186 82 200 82 C214 82 228 74 238 60"
        fill="none"
        stroke={stroke}
        strokeWidth="5"
        strokeLinecap="round"
      />
    </g>
  );
}

function HoodieShape({ fill, stroke }: { fill: string; stroke: string }) {
  return (
    <g>
      <path
        d="M156 70 C164 46 182 34 200 34 C218 34 236 46 244 70
           L298 92 L344 170 L292 198 L274 168 L274 344
           C274 352 268 356 260 356 L140 356 C132 356 126 352 126 344
           L126 168 L108 198 L56 170 L102 92 Z"
        fill={fill}
        stroke={stroke}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* hood */}
      <path
        d="M156 72 C150 108 168 128 200 128 C232 128 250 108 244 72
           C236 52 218 40 200 40 C182 40 164 52 156 72 Z"
        fill={fill}
        stroke={stroke}
        strokeWidth="3"
      />
      {/* zip */}
      <line x1="200" y1="128" x2="200" y2="352" stroke={stroke} strokeWidth="3" />
      {/* pocket */}
      <path
        d="M150 280 L250 280 L250 340 L150 340 Z M150 280 L166 262 M250 280 L234 262"
        fill="none"
        stroke={stroke}
        strokeWidth="3"
      />
      {/* drawstrings */}
      <path d="M188 130 L184 160 M212 130 L216 160" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

function FlyyyPrint() {
  return (
    <text
      x="200"
      y="150"
      textAnchor="middle"
      fontFamily="var(--font-anton), Arial Black, sans-serif"
      fontSize="27"
      fill={INK}
      letterSpacing="1"
    >
      <tspan x="200" dy="0">MY FIT IS</tspan>
      <tspan x="200" dy="34">TOO FLYYY</tspan>
      <tspan x="200" dy="34">FOR A 9-5</tspan>
    </text>
  );
}

function NoNineFivePrint() {
  return (
    <g stroke={INK} fill="none" strokeWidth="7" strokeLinecap="round">
      {/* running businessman, crossed out */}
      <circle cx="200" cy="200" r="62" strokeWidth="8" />
      <circle cx="207" cy="164" r="11" fill={INK} stroke="none" />
      {/* torso */}
      <path d="M204 176 L192 214" />
      {/* legs */}
      <path d="M192 214 L212 238 M192 214 L172 232 L178 250" />
      {/* arms + briefcase */}
      <path d="M200 188 L176 196 M200 188 L224 198" />
      <rect x="222" y="192" width="20" height="14" fill={INK} stroke="none" />
      {/* slash */}
      <path d="M156 156 L244 244" strokeWidth="9" />
    </g>
  );
}

function LogoOverlay({ inverted }: { inverted: boolean }) {
  return (
    <div className="pointer-events-none absolute left-1/2 top-[38%] w-[34%] -translate-x-1/2 -translate-y-1/2">
      <Image
        src="/brand/hngry-logo.png"
        alt=""
        width={540}
        height={540}
        className={inverted ? "logo-invert" : "logo-multiply"}
      />
    </div>
  );
}

export default function ProductVisual({
  art,
  className = "",
}: {
  art: ProductArt;
  className?: string;
}) {
  const garment = {
    "flyyy-front": { shape: "tee", fill: "#fbfaf7", stroke: INK },
    "no-nine-five-back": { shape: "tee", fill: "#fbfaf7", stroke: INK },
    "logo-white-tee": { shape: "tee", fill: "#fbfaf7", stroke: INK },
    "logo-black-tee": { shape: "tee", fill: "#1a1a1a", stroke: "#000" },
    "hoodie-grey": { shape: "hoodie", fill: "#b9b7b0", stroke: INK },
    "hoodie-black": { shape: "hoodie", fill: "#2a2a2a", stroke: "#000" },
  }[art];

  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 400 400" className="h-full w-full" aria-hidden>
        {garment.shape === "tee" ? (
          <TeeShape fill={garment.fill} stroke={garment.stroke} />
        ) : (
          <HoodieShape fill={garment.fill} stroke={garment.stroke} />
        )}
        {art === "flyyy-front" && <FlyyyPrint />}
        {art === "no-nine-five-back" && <NoNineFivePrint />}
      </svg>
      {(art === "logo-white-tee" || art === "logo-black-tee") && (
        <LogoOverlay inverted={art === "logo-black-tee"} />
      )}
    </div>
  );
}
