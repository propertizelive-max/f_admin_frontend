import type { Metadata } from "next";
import { ProductListClient } from "./ProductListClient";

export const metadata: Metadata = { title: "Products | Furniture Admin" };

export default function ProductsPage() {
  return <ProductListClient />;
}
