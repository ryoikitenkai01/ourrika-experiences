import type { ComponentProps } from "react";
import { notFound } from "next/navigation";
import { adminDb } from "@/lib/firebase-admin";
import { PartnerForm } from "@/components/admin/PartnerForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminPartnerFormPage({ params }: Props) {
  const { id } = await params;
  const isNew = id === "new";

  let partner = null;

  if (!isNew) {
    if (!adminDb) notFound();
    
    const docRef = await adminDb.collection("partners").doc(id).get();

    if (!docRef.exists) {
      notFound();
    }
    partner = { id: docRef.id, ...docRef.data() } as unknown as ComponentProps<typeof PartnerForm>["initialData"];
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl">
      <header className="mb-8">
        <h1 className="font-serif text-3xl text-[var(--color-charcoal)] mb-2">
          {isNew ? "Add Partner" : "Edit Partner"}
        </h1>
        <p className="font-sans text-sm text-zinc-500">
          {isNew
            ? "Configure a new brand logo for the partners carousel."
            : `Updating details for "${partner?.name}".`}
        </p>
      </header>

      <PartnerForm initialData={partner} />
    </div>
  );
}
