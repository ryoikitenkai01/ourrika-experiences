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
        <div className='bg-[#F5EFE4] border border-[#C0714F]/30 text-[#C0714F] text-sm p-4 rounded-sm'>
          Unable to connect to the database. Check your Firebase environment variables.
        </div>
      )}

      {!fetchError && (
        destinations.length > 0 ? (
          <DestinationsTable destinations={destinations} />
        ) : (
          <div className='text-[#5c605d] text-sm p-8 text-center'>
            No records yet. Add your first one.
          </div>
        )
      )}
    </div>
  );
}
