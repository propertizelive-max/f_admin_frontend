import type { Metadata } from "next";
import { CategoryListClient } from "./CategoryListClient";

export const metadata: Metadata = { title: "Categories | Nordic Hearth Admin" };

export default function CategoriesPage() {
  return <CategoryListClient />;
}
