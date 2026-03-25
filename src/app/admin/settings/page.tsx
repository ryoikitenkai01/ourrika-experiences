import { adminDb } from "@/lib/firebase-admin";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  let data = null;
  let fetchError: Error | null = null;

  try {
    if (adminDb) {
      const snapshot = await adminDb.collection("site_settings").limit(1).get();
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        data = { id: doc.id, ...doc.data() } as any;
      }
    }
  } catch (error: any) {
    fetchError = error;
  }

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="font-serif text-3xl text-[var(--color-charcoal)] mb-2">
          Site Settings
        </h1>
        <p className="font-sans text-sm text-zinc-500">
          Manage your global site configuration, social links, and hero content.
        </p>
      </header>

      {fetchError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg font-sans text-sm mb-6">
          Failed to load settings: {fetchError.message}
        </div>
      )}

      <div className="max-w-6xl">
        <SettingsForm initialData={data} />
      </div>
    </div>
  );
}
