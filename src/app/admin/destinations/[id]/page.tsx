import type { ComponentProps } from "react";
import { notFound } from "next/navigation";
import { adminDb } from "@/lib/firebase-admin";
import { DestinationForm } from "@/components/admin/DestinationForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminDestinationFormPage({ params }: Props) {
  const { id } = await params;
  const isNew = id === "new";

  let destination = null;

  if (!isNew) {
    if (!adminDb) notFound();
    
    const docRef = await adminDb.collection("destinations").doc(id).get();

    if (!docRef.exists) {
      notFound();
    }
    destination = { id: docRef.id, ...docRef.data() } as unknown as ComponentProps<typeof DestinationForm>["initialData"];
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl">
      <header className="mb-8">
        <h1 className="font-serif text-3xl text-[var(--color-charcoal)] mb-2">
          {isNew ? "Create Destination" : "Edit Destination"}
        </h1>
        <p className="font-sans text-sm text-zinc-500">
          {isNew
            ? "Add a new luxury destination to your portfolio."
            : `Updating details for "${destination?.name}".`}
        </p>
      </header>

      <DestinationForm initialData={destination} />
    </div>
  );
}
