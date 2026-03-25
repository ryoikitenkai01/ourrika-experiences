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
      <div className="font-sans">
        <PasscodeAuth />
      </div>
    );
  }

  return (
    <div className="flex bg-[#F9F9F9] text-zinc-800 min-h-screen font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 px-8 border-b border-zinc-200 bg-white flex items-center justify-between sticky top-0 z-10 flex-shrink-0">
          <div className="text-sm font-sans tracking-wide text-zinc-500">
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
