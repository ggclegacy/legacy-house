import { notFound } from "next/navigation";
import { CommercialRecord } from "@/src/presentation/commercial/commercial-record";
import { loadCommercialSnapshot } from "@/src/services/commercial/load-commercial";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const r = (await loadCommercialSnapshot()).documents.find((x) => x.id === id);
  if (!r) notFound();
  return (
    <CommercialRecord
      eyebrow="Document Vault"
      title={r.title}
      back="/modules/documents"
      fields={[
        ["Type", r.documentType],
        ["File name", r.fileName],
        ["MIME type", r.mimeType],
        ["Status", r.status],
        ["Issuer", r.issuer],
        ["Expiration", r.expirationDate],
        ["Notes", r.notes],
      ]}
    />
  );
}
