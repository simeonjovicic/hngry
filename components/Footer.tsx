import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer id="about" className="bg-ink text-bone">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8">
        <div className="grid gap-12 sm:grid-cols-3">
          <div>
            <Image
              src="/brand/hngry-logo.png"
              alt="HNGRŸ"
              width={180}
              height={180}
              className="logo-invert h-16 w-auto"
            />
            <p className="mt-6 max-w-xs font-mono text-[11px] leading-relaxed tracking-wider text-bone/60">
              CLOTHES FOR THE ONES WHO WANT MORE. HEAVYWEIGHT ONLY. NO OFFICE
              HOURS. EST. 2026.
            </p>
          </div>
          <div className="font-mono text-[11px] tracking-[0.2em]">
            <p className="mb-4 text-bone/40">SHOP</p>
            <ul className="space-y-3">
              <li><Link href="/shop" className="hover:underline">ALL PRODUCTS</Link></li>
              <li><Link href="/shop" className="hover:underline">DROP 001</Link></li>
              <li><Link href="/shop" className="hover:underline">TEES</Link></li>
              <li><Link href="/shop" className="hover:underline">HOODIES</Link></li>
            </ul>
          </div>
          <div className="font-mono text-[11px] tracking-[0.2em]">
            <p className="mb-4 text-bone/40">INFO</p>
            <ul className="space-y-3">
              <li><span className="cursor-not-allowed opacity-50">SHIPPING + RETURNS</span></li>
              <li><span className="cursor-not-allowed opacity-50">SIZE GUIDE</span></li>
              <li><span className="cursor-not-allowed opacity-50">CONTACT</span></li>
              <li><span className="cursor-not-allowed opacity-50">INSTAGRAM ↗</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 flex flex-col gap-2 border-t border-bone/15 pt-6 font-mono text-[10px] tracking-[0.2em] text-bone/40 sm:flex-row sm:justify-between">
          <p>© 2026 HNGRŸ — ALL RIGHTS RESERVED</p>
          <p>POWERED BY HUNGER</p>
        </div>
      </div>
    </footer>
  );
}
