import type { ComponentProps } from "react";
import Link from "next/link";
import { adminDb } from "@/lib/firebase-admin";
import { Plus } from "lucide-react";
import { PartnersTable } from "@/components/admin/PartnersTable";

export default async function AdminPartnersPage() {
  let partners: ComponentProps<typeof PartnersTable>["partners"] = [];
  let fetchError: string | null = null;

  try {
    if (adminDb) {
      const snapshot = await adminDb
        .collection("partners")
        .orderBy("display_order", "asc")
        .get();
      
      partners = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as unknown as typeof partners;
    }
  } catch (error: unknown) {
    fetchError = error instanceof Error ? error.message : "Unknown error";
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-[var(--color-charcoal)] mb-1">
            Partners
          </h1>
          <p className="font-sans text-sm text-zinc-500">
            Manage your brand partners and affiliate logos displayed on the site.{" "}
            {partners.length > 0 && (
              <span className="text-zinc-400">
                ({partners.length} total)
              </span>
            )}
          </p>
        </div>
        <Link
          href="/admin/partners/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-terracotta)] text-white font-sans text-sm tracking-wide rounded-lg hover:bg-[var(--color-terracotta-dark)] transition-colors shadow-sm"
        >
          <Plus size={16} />
          New Partner
        </Link>
      </div>

      {fetchError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg font-sans text-sm">
          Failed to load partners: {fetchError}
        </div>
      )}

      <PartnersTable partners={partners} />
    </div>
  );
}
