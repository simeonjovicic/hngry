import type { StaticImageData } from "next/image";
import productFlyyyFront from "@/public/img/Hngry_Product1.jpeg";
import productNoNineFiveBack from "@/public/img/Hngry_Product2.jpeg";
import productFlyyyStack from "@/public/img/Hngry_Product3.jpeg";

export type Size = "XS" | "S" | "M" | "L" | "XL";

export const ALL_SIZES: Size[] = ["XS", "S", "M", "L", "XL"];

export type ProductArt =
  | "flyyy-front"
  | "no-nine-five-back"
  | "logo-white-tee"
  | "logo-black-tee"
  | "hoodie-grey"
  | "hoodie-black";

export type Category = "TEES" | "HOODIES";

export interface Product {
  slug: string;
  name: string;
  price: number; // in EUR cents
  compareAt?: number;
  description: string;
  details: string[];
  art: ProductArt;
  /** real product shots; first one is the main image, art is the fallback */
  photos?: { src: StaticImageData; alt: string }[];
  badge?: "NEW" | "SOLD OUT" | "LAST UNITS";
  availableSizes: Size[];
  color: string;
  category: Category;
}

export const products: Product[] = [
  {
    slug: "flyyy-9-5-tee",
    name: "FLYYY 9–5 TEE",
    price: 4900,
    description:
      "Heavyweight boxy tee. Front print: MY FIT IS TOO FLYYY FOR A 9-5. Crossed-out businessman on the back. For everyone allergic to office hours.",
    details: [
      "280 GSM heavyweight cotton",
      "Boxy oversized fit — size down for regular",
      "Puff print front, screen print back",
      "Woven HNGRŸ label at hem",
    ],
    art: "flyyy-front",
    photos: [
      {
        src: productFlyyyFront,
        alt: "White heavyweight tee with black MY FIT IS TOO FLYYY FOR A 9-5 front print",
      },
      {
        src: productNoNineFiveBack,
        alt: "White heavyweight tee with crossed-out running businessman back print",
      },
      {
        src: productFlyyyStack,
        alt: "Folded stack of white FLYYY 9-5 tees",
      },
    ],
    category: "TEES",
    badge: "NEW",
    availableSizes: ["XS", "S", "M", "L", "XL"],
    color: "WHITE",
  },
];

/** the one live product — Drop 001 is a single tee for now */
export const featuredProduct = products[0];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function formatPrice(cents: number): string {
  return `€${(cents / 100).toFixed(2).replace(".", ",")}`;
}
