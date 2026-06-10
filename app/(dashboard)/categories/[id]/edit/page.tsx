import type { Metadata } from "next";
import { CategoryEditClient } from "./CategoryEditClient";

export const metadata: Metadata = { title: "Edit Category | Nordic Hearth Admin" };

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CategoryEditClient categoryId={id} />;
}
