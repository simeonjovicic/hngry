import type { Metadata } from "next";
import { Anton, Space_Grotesk, Space_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { ACCESS_COOKIE, ACCESS_VALUE } from "@/lib/access";
import Header from "@/components/Header";
import Ticker from "@/components/Ticker";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import Grain from "@/components/Grain";
import TempLock from "@/components/TempLock";

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
});

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HNGRŸ — Stay Hungry",
  description:
    "HNGRŸ. Heavyweight streetwear for the ones who want more. Drop 001 — 20.07.2026, 20:15.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const store = await cookies();
  const unlocked = store.get(ACCESS_COOKIE)?.value === ACCESS_VALUE;

  return (
    <html
      lang="en"
      className={`${anton.variable} ${grotesk.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {unlocked ? (
          <CartProvider>
            <Ticker />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
            <Grain />
            <TempLock />
          </CartProvider>
        ) : (
          <>
            {children}
            <Grain />
          </>
        )}
      </body>
    </html>
  );
}
