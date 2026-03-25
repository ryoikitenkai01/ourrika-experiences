import Link from "next/link";
import { adminDb } from "@/lib/firebase-admin";
import { Plus } from "lucide-react";
import { ExperiencesTable } from "@/components/admin/ExperiencesTable";

export default async function AdminExperiencesPage() {
  let experiences: any[] = [];
  let fetchError: Error | null = null;

  try {
    if (adminDb) {
      const snapshot = await adminDb
        .collection("experiences")
        .orderBy("homepage_order", "asc")
        .get();
      
      experiences = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    }
  } catch (error: any) {
    fetchError = error;
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
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg font-sans text-sm">
          Failed to load experiences: {fetchError.message}
        </div>
      )}

      {/* Table */}
      <ExperiencesTable experiences={experiences} />
    </div>
  );
}
