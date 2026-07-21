import type { Metadata } from "next";
import { Anton, Open_Sans } from "next/font/google";
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

const openSans = Open_Sans({
  variable: "--font-open-sans",
  weight: ["300", "400", "600", "700"],
  subsets: ["latin"],
});

// Anton is kept only for the big hero + gallery display titles
const anton = Anton({
  variable: "--font-anton",
  weight: "400",
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
      className={`${openSans.variable} ${anton.variable} h-full antialiased`}
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
