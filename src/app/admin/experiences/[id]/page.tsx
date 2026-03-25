import { notFound } from "next/navigation";
import { adminDb } from "@/lib/firebase-admin";
import { ExperienceForm } from "@/components/admin/ExperienceForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminExperienceFormPage({ params }: Props) {
  const { id } = await params;
  const isNew = id === "new";

  let experience = null;

  if (!isNew) {
    if (!adminDb) notFound();
    
    const docRef = await adminDb.collection("experiences").doc(id).get();

    if (!docRef.exists) {
      notFound();
    }
    experience = { id: docRef.id, ...docRef.data() } as any;
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl">
      <header className="mb-8">
        <h1 className="font-serif text-3xl text-[var(--color-charcoal)] mb-2">
          {isNew ? "Create Experience" : "Edit Experience"}
        </h1>
        <p className="font-sans text-sm text-zinc-500">
          {isNew
            ? "Add a new bookable experience to your offerings."
            : `Updating details for "${experience?.title}".`}
        </p>
      </header>

      <ExperienceForm initialData={experience} />
    </div>
  );
}
