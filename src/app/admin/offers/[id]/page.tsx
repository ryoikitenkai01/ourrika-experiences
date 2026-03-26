import type { ComponentProps } from "react";
import { notFound } from "next/navigation";
import { adminDb } from "@/lib/firebase-admin";
import { OfferForm } from "@/components/admin/OfferForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminOfferFormPage({ params }: Props) {
  const { id } = await params;
  const isNew = id === "new";

  let offer = null;
  let experiences: { id: string; name: string }[] = [];
  let destinations: { id: string; name: string }[] = [];

  if (adminDb) {
    if (!isNew) {
      const docRef = await adminDb.collection("offers").doc(id).get();
      if (!docRef.exists) notFound();
      offer = { id: docRef.id, ...docRef.data() } as unknown as ComponentProps<typeof OfferForm>["initialData"];
    }

    try {
      const [expsRes, destsRes] = await Promise.all([
        adminDb.collection("experiences").orderBy("title").get(),
        adminDb.collection("destinations").orderBy("name").get()
      ]);

      experiences = expsRes.docs.map(doc => ({ id: doc.id, name: doc.data().title }));
      destinations = destsRes.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
    } catch(e) {
      console.error(e);
    }
  } else if (!isNew) {
     notFound();
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl">
      <header className="mb-8">
        <h1 className="font-serif text-3xl text-[var(--color-charcoal)] mb-2">
          {isNew ? "Create Offer" : "Edit Offer"}
        </h1>
        <p className="font-sans text-sm text-zinc-500">
          {isNew
            ? "Create a new seasonal discount or package deal."
            : `Updating details for "${offer?.title}".`}
        </p>
      </header>

      <OfferForm
        initialData={offer}
        experiences={experiences}
        destinations={destinations}
      />
    </div>
  );
}
