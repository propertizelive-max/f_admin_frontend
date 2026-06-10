import type { Metadata } from "next";
import { ProductEditClient } from "./ProductEditClient";

export const metadata: Metadata = { title: "Edit Product | Furniture Admin" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductEditClient productId={id} />;
}
