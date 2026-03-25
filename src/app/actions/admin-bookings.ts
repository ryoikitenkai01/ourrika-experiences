"use server";

import { adminDb, isFirebaseAdminConfigured } from "@/lib/firebase-admin";
import { revalidatePath } from "next/cache";

export interface BookingLead {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  preferred_date: string | null;
  guests_count: number;
  message: string | null;
  service_id: string | null;
  service_title: string | null;
  service_type: string | null;
  status: string;
  created_at: string;
}

const MOCK_BOOKINGS: BookingLead[] = [
  {
    id: "1",
    full_name: "John Doe",
    phone: "+1 555 1234",
    email: "john@example.com",
    preferred_date: "2026-05-10",
    guests_count: 2,
    message: "Can't wait!",
    service_id: null,
    service_title: "Agafay Desert",
    service_type: "destination",
    status: "new",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    full_name: "Jane Smith",
    phone: null,
    email: "jane.smith@example.com",
    preferred_date: "2026-06-15",
    guests_count: 4,
    message: null,
    service_id: null,
    service_title: "Sunrise Hot Air Balloon",
    service_type: "experience",
    status: "contacted",
    created_at: new Date(Date.now() - 86400000).toISOString(),
  }
];

export async function getBookings() {
  if (!isFirebaseAdminConfigured || !adminDb) {
    console.warn("[getBookings] FIREBASE_PRIVATE_KEY is not configured. Returning mock data.");
    return MOCK_BOOKINGS;
  }

  try {
    const snapshot = await adminDb
      .collection("bookings_leads")
      .orderBy("created_at", "desc")
      .get();

    return snapshot.docs.map(doc => {
      const data = doc.data();
      const raw = data.created_at;
      const created_at: string =
        raw?.toDate?.()?.toISOString?.() ??
        (typeof raw === "string" ? raw : new Date().toISOString());
      return { ...data, id: doc.id, created_at } as BookingLead;
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[getBookings] error:", message);
    return [];
  }
}

export async function updateBookingStatus(id: string, status: string) {
  if (!isFirebaseAdminConfigured || !adminDb) {
    console.warn("Mocking update for booking", id);
    revalidatePath("/admin/bookings");
    return { success: true };
  }

  try {
    await adminDb.collection("bookings_leads").doc(id).update({ status });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[updateBookingStatus] error:", message);
    return { success: false, error: "Could not update status." };
  }

  revalidatePath("/admin/bookings");
  return { success: true };
}
