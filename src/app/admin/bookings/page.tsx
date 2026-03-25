import { Metadata } from "next";
import { getBookings, BookingLead } from "@/app/actions/admin-bookings";
import { BookingsTable } from "@/components/admin/BookingsTable";

export const metadata: Metadata = {
  title: "Bookings | Admin | Ourrika Experiences",
};

export default async function AdminBookingsPage() {
  let bookings: BookingLead[] = [];
  let fetchError: string | null = null;

  try {
    bookings = await getBookings();
  } catch {
    fetchError = "Unable to load bookings. Check your Firebase configuration.";
  }

  if (fetchError) {
    return (
      <div className="space-y-6">
        <h1 className="font-serif text-3xl text-white">Bookings</h1>
        <div className="bg-red-900/20 border border-red-800 p-4 text-red-400 text-sm">
          {fetchError}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-white mb-2">Bookings</h1>
          <p className="font-sans text-sm text-gray-400">
            Manage inquiries and booking requests across all services.
          </p>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#1a1a1a] border border-[#333] p-4 flex flex-col gap-1">
          <span className="text-[10px] tracking-widest uppercase text-gray-500">Total</span>
          <span className="font-serif text-2xl text-white">{bookings.length}</span>
        </div>
        <div className="bg-[#1a1a1a] border border-[#333] p-4 flex flex-col gap-1">
          <span className="text-[10px] tracking-widest uppercase text-gray-500">New</span>
          <span className="font-serif text-2xl text-blue-400">
            {bookings.filter((b) => b.status === "new").length}
          </span>
        </div>
        <div className="bg-[#1a1a1a] border border-[#333] p-4 flex flex-col gap-1">
          <span className="text-[10px] tracking-widest uppercase text-gray-500">Confirmed</span>
          <span className="font-serif text-2xl text-green-400">
            {bookings.filter((b) => b.status === "confirmed").length}
          </span>
        </div>
        <div className="bg-[#1a1a1a] border border-[#333] p-4 flex flex-col gap-1">
          <span className="text-[10px] tracking-widest uppercase text-gray-500">Closed</span>
          <span className="font-serif text-2xl text-gray-400">
            {bookings.filter((b) => b.status === "closed").length}
          </span>
        </div>
      </div>

      <div className="bg-[var(--color-admin-surface)] border border-[var(--color-admin-border)]">
        <div className="p-4 border-b border-[var(--color-admin-border)] flex items-center justify-between">
          <div className="font-sans text-[10px] tracking-widest uppercase text-gray-400">
            Recent Requests
          </div>
        </div>
        <BookingsTable bookings={bookings} />
      </div>
    </div>
  );
}
