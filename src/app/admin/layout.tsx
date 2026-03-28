import { Metadata } from "next";
import { cookies } from "next/headers";
import { Sidebar } from "@/components/admin/Sidebar";
import { PasscodeAuth } from "@/components/admin/PasscodeAuth";

export const metadata: Metadata = {
  title: "Admin Dashboard | Ourrika Experiences",
  description: "Secure admin backoffice for operations.",
};

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get("ourrika_admin_token")?.value === "authenticated";

  if (!isAuthenticated) {
    return (
      <div className="admin-theme font-sans">
        <PasscodeAuth />
      </div>
    );
  }

  return (
    <div className="admin-theme flex bg-[var(--color-admin-bg)] text-[var(--color-admin-text)] min-h-screen font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 px-8 border-b border-[var(--color-admin-border)] bg-[var(--color-admin-surface)]/95 flex items-center justify-between sticky top-0 z-10 flex-shrink-0 backdrop-blur-sm">
          <div className="text-[10px] font-sans tracking-[0.2em] uppercase text-[var(--color-admin-text-muted)]">
            Operations Management
          </div>
          <div className="flex gap-4 items-center">
            {/* Future header controls here */}
            <div className="w-8 h-8 flex items-center justify-center bg-[var(--color-terracotta)] text-white font-serif rounded-full text-xs">
              S
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto w-full max-w-7xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
