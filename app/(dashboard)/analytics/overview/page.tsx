import type { Metadata } from "next";
import { OverviewClient } from "./OverviewClient";

export const metadata: Metadata = { title: "Overview Analytics" };

export default function OverviewPage() {
  return <OverviewClient />;
}
