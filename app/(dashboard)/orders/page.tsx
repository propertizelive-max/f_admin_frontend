import type { Metadata } from "next";
import { OrderListClient } from "./OrderListClient";

export const metadata: Metadata = { title: "Orders | Furniture Admin" };

export default function OrdersPage() {
  return <OrderListClient />;
}
