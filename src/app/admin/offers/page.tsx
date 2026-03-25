import Link from "next/link";
import { adminDb } from "@/lib/firebase-admin";
import { Plus } from "lucide-react";
import { OffersTable } from "@/components/admin/OffersTable";

export default async function AdminOffersPage() {
  let offers: any[] = [];
  let fetchError: Error | null = null;

  try {
    if (adminDb) {
      const snapshot = await adminDb
        .collection("offers")
        .orderBy("created_at", "desc")
        .get();
      
      offers = snapshot.docs.map(doc => ({
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
            Offers
          </h1>
          <p className="font-sans text-sm text-zinc-500">
            Manage your seasonal packages and limited-time deals.{" "}
            {offers.length > 0 && (
              <span className="text-zinc-400">
                ({offers.length} total)
              </span>
            )}
          </p>
        </div>
        <Link
          href="/admin/offers/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-terracotta)] text-white font-sans text-sm tracking-wide rounded-lg hover:bg-[var(--color-terracotta-dark)] transition-colors shadow-sm"
        >
          <Plus size={16} />
          New Offer
        </Link>
      </div>

      {fetchError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg font-sans text-sm">
          Failed to load offers: {fetchError.message}
        </div>
      )}

      <OffersTable offers={offers} />
    </div>
  );
}
