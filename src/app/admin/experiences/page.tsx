import type { ComponentProps } from "react";
import Link from "next/link";
import { adminDb } from "@/lib/firebase-admin";
import { Plus } from "lucide-react";
import { ExperiencesTable } from "@/components/admin/ExperiencesTable";

export default async function AdminExperiencesPage() {
  let experiences: ComponentProps<typeof ExperiencesTable>["experiences"] = [];
  let fetchError: string | null = null;

  try {
    if (adminDb) {
      const snapshot = await adminDb
        .collection("experiences")
        .orderBy("homepage_order", "asc")
        .get();
      
      experiences = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as unknown as typeof experiences;
    }
  } catch (error: unknown) {
    fetchError = error instanceof Error ? error.message : "Unknown error";
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-[var(--color-charcoal)] mb-1">
            Experiences
          </h1>
          <p className="font-sans text-sm text-zinc-500">
            Manage all your bookable experiences.{" "}
            {experiences.length > 0 && (
              <span className="text-zinc-400">
                ({experiences.length} total)
              </span>
            )}
          </p>
        </div>
        <Link
          href="/admin/experiences/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-terracotta)] text-white font-sans text-sm tracking-wide rounded-lg hover:bg-[var(--color-terracotta-dark)] transition-colors shadow-sm"
        >
          <Plus size={16} />
          New Experience
        </Link>
      </div>

      {/* Error state */}
      {fetchError && (
        <div className='bg-[#F5EFE4] border border-[#C0714F]/30 text-[#C0714F] text-sm p-4 rounded-sm'>
          Unable to connect to the database. Check your Firebase environment variables.
        </div>
      )}

      {/* Table or Empty State */}
      {!fetchError && (
        experiences.length > 0 ? (
          <ExperiencesTable experiences={experiences} />
        ) : (
          <div className='text-[#5c605d] text-sm p-8 text-center'>
            No records yet. Add your first one.
          </div>
        )
      )}
    </div>
  );
}
