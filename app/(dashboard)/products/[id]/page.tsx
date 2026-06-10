import type { Metadata } from "next";
import { ProductDetailsClient } from "./ProductDetailsClient";

export const metadata: Metadata = { title: "Product Details | Furniture Admin" };

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductDetailsClient productId={id} />;
}
