"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";

const NAV = [
  { href: "/product/flyyy-9-5-tee", label: "DROP 001" },
  { href: "/#about", label: "ABOUT" },
];

export default function Header() {
  const { count, open } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-ink/15 bg-bone/90 backdrop-blur-md">
      <div className="flex h-12 items-center justify-between px-4 sm:px-10">
        <nav className="flex flex-1 items-center gap-5 font-mono text-[11px] tracking-[0.15em]">
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="hidden underline-offset-4 transition-colors hover:underline sm:block"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/product/flyyy-9-5-tee"
            className="underline-offset-4 hover:underline sm:hidden"
          >
            DROP 001
          </Link>
        </nav>

        <Link href="/" className="flex flex-1 justify-center">
          <Image
            src="/brand/hngry-logo.png"
            alt="HNGRŸ"
            width={120}
            height={120}
            className="logo-multiply h-11 w-auto"
            priority
          />
        </Link>

        <div className="flex flex-1 items-center justify-end gap-5 font-mono text-[11px] tracking-[0.15em]">
          <span className="hidden cursor-not-allowed opacity-40 sm:block">SEARCH</span>
          <button
            onClick={open}
            className="underline-offset-4 transition-colors hover:underline"
          >
            BAG ({count})
          </button>
        </div>
      </div>
    </header>
  );
}
