import { redirect } from "next/navigation";
import { featuredProduct } from "@/lib/products";

// Drop 001 is a single piece — a shop overview adds nothing yet, so /shop
// sends people straight to the product. Bring the grid back with Drop 002.
export default function ShopPage() {
  redirect(`/product/${featuredProduct.slug}`);
}
