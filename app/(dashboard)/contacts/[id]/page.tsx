import { ContactDetailsClient } from "./ContactDetailsClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ContactDetailsPage({ params }: Props) {
  const { id } = await params;
  return <ContactDetailsClient id={id} />;
}
