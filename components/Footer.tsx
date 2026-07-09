import Image from "next/image";

export default function Footer() {
  return (
    <footer id="about" className="bg-ink text-bone">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Image
              src="/brand/hngry-logo.png"
              alt="HNGRŸ"
              width={140}
              height={140}
              className="logo-invert h-12 w-auto"
            />
            <p className="mt-4 max-w-xs font-mono text-[10px] leading-relaxed tracking-wider text-bone/50">
              CLOTHES FOR THE ONES WHO WANT MORE. EST. 2026.
            </p>
          </div>
          <ul className="space-y-2.5 font-mono text-[11px] tracking-[0.2em] sm:text-right">
            <li><span className="cursor-not-allowed opacity-50">SHIPPING + RETURNS</span></li>
            <li><span className="cursor-not-allowed opacity-50">SIZE GUIDE</span></li>
            <li><span className="cursor-not-allowed opacity-50">CONTACT</span></li>
            <li><span className="cursor-not-allowed opacity-50">INSTAGRAM ↗</span></li>
          </ul>
        </div>
        <div className="mt-8 flex flex-col gap-2 border-t border-bone/15 pt-5 font-mono text-[10px] tracking-[0.2em] text-bone/40 sm:flex-row sm:justify-between">
          <p>© 2026 HNGRŸ — ALL RIGHTS RESERVED</p>
          <p>
            POWERED BY{" "}
            <a
              href="https://hango.at"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 transition-colors hover:text-bone"
            >
              HANGO.AT
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
