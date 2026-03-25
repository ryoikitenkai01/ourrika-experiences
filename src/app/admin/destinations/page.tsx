import Link from "next/link";
import { adminDb } from "@/lib/firebase-admin";
import { Plus } from "lucide-react";
import { DestinationsTable } from "@/components/admin/DestinationsTable";

export default async function AdminDestinationsPage() {
  let destinations: any[] = [];
  let fetchError: Error | null = null;

  try {
    if (adminDb) {
      const snapshot = await adminDb
        .collection("destinations")
        .orderBy("homepage_order", "asc")
        .get();
      
      destinations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    }
  } catch (error: any) {
    fetchError = error;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-[var(--color-charcoal)] mb-1">
            Destinations
          </h1>
          <p className="font-sans text-sm text-zinc-500">
            Manage travel destinations and locations.{" "}
            {destinations.length > 0 && (
              <span className="text-zinc-400">
                ({destinations.length} total)
              </span>
            )}
          </p>
        </div>
        <Link
          href="/admin/destinations/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-terracotta)] text-white font-sans text-sm tracking-wide rounded-lg hover:bg-[var(--color-terracotta-dark)] transition-colors shadow-sm"
        >
          <Plus size={16} />
          New Destination
        </Link>
      </div>

      {fetchError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg font-sans text-sm">
          Failed to load destinations: {fetchError.message}
        </div>
      )}

      <DestinationsTable destinations={destinations} />
    </div>
  );
}
