import type { Metadata } from "next";
import { OrderDetailsClient } from "./OrderDetailsClient";

export const metadata: Metadata = { title: "Order Details | Furniture Admin" };

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OrderDetailsClient id={id} />;
}
