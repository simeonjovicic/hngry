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
      "Heavyweight boxy tee. Front print: MY FIT IS TOO FLYYY FOR A 9-5. For everyone allergic to office hours.",
    details: [
      "280 GSM heavyweight cotton",
      "Boxy oversized fit — size down for regular",
      "Puff print front",
      "Woven HNGRŸ label at hem",
    ],
    art: "flyyy-front",
    category: "TEES",
    badge: "NEW",
    availableSizes: ["XS", "S", "M", "L", "XL"],
    color: "WHITE",
  },
  {
    slug: "no-9-5-tee",
    name: "NO 9–5 TEE",
    price: 4900,
    description:
      "Heavyweight boxy tee. Back print: businessman, crossed out. Say it without saying it.",
    details: [
      "280 GSM heavyweight cotton",
      "Boxy oversized fit — size down for regular",
      "Screen print back",
      "Woven HNGRŸ label at hem",
    ],
    art: "no-nine-five-back",
    category: "TEES",
    badge: "NEW",
    availableSizes: ["S", "M", "L", "XL"],
    color: "WHITE",
  },
  {
    slug: "hngry-logo-tee-bone",
    name: "HNGRŸ LOGO TEE",
    price: 4500,
    description:
      "The classic. Liquid HNGRŸ logo across the chest on bone white heavyweight cotton.",
    details: [
      "280 GSM heavyweight cotton",
      "Boxy oversized fit",
      "High-density chest print",
      "Woven HNGRŸ label at hem",
    ],
    art: "logo-white-tee",
    category: "TEES",
    availableSizes: ["XS", "S", "M", "L"],
    color: "BONE",
  },
  {
    slug: "hngry-logo-tee-black",
    name: "HNGRŸ LOGO TEE",
    price: 4500,
    description:
      "The classic, blacked out. Liquid HNGRŸ logo in white on washed black heavyweight cotton.",
    details: [
      "280 GSM heavyweight cotton",
      "Boxy oversized fit",
      "High-density chest print",
      "Woven HNGRŸ label at hem",
    ],
    art: "logo-black-tee",
    category: "TEES",
    badge: "LAST UNITS",
    availableSizes: ["M", "L"],
    color: "WASHED BLACK",
  },
  {
    slug: "stay-hngry-hoodie-grey",
    name: "STAY HNGRŸ HOODIE",
    price: 8900,
    compareAt: 9900,
    description:
      "Washed heavyweight zip hoodie. Faded like you wore it for three summers already.",
    details: [
      "450 GSM brushed fleece",
      "Garment washed — every piece fades different",
      "Oversized drop shoulder",
      "Embroidered HNGRŸ at chest",
    ],
    art: "hoodie-grey",
    category: "HOODIES",
    availableSizes: ["S", "M", "L", "XL"],
    color: "WASHED GREY",
  },
  {
    slug: "stay-hngry-hoodie-black",
    name: "STAY HNGRŸ HOODIE",
    price: 8900,
    description:
      "Washed heavyweight zip hoodie in faded black. The opium uniform.",
    details: [
      "450 GSM brushed fleece",
      "Garment washed — every piece fades different",
      "Oversized drop shoulder",
      "Embroidered HNGRŸ at chest",
    ],
    art: "hoodie-black",
    category: "HOODIES",
    badge: "SOLD OUT",
    availableSizes: [],
    color: "WASHED BLACK",
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function formatPrice(cents: number): string {
  return `€${(cents / 100).toFixed(2).replace(".", ",")}`;
}
