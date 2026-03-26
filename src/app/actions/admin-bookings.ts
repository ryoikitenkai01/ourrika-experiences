"use server";

import { adminDb } from "@/lib/firebase-admin";
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


export async function getBookings() {
  try {
    if (!adminDb) return [];
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
  try {
    if (!adminDb) return { success: false, error: "Firebase not configured." };
    await adminDb.collection("bookings_leads").doc(id).update({ status });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[updateBookingStatus] error:", message);
    return { success: false, error: "Could not update status." };
  }

  revalidatePath("/admin/bookings");
  return { success: true };
}
