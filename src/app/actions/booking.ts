"use server";

import { adminDb, isFirebaseAdminConfigured } from "@/lib/firebase-admin";
import type { BookingRequest, BookingResult } from "@/lib/types/booking";

export async function submitBookingRequest(data: BookingRequest): Promise<BookingResult> {
  // 1. Server-side Validation Layer
  const requiredFields: (keyof BookingRequest)[] = [
    "full_name",
    "email",
    "phone",
    "preferred_date",
    "guests_count",
  ];

  const hasMissingFields = requiredFields.some((field) => {
    const value = data[field];
    return value === undefined || value === null || (typeof value === "string" && !value.trim());
  });

  if (hasMissingFields) {
    return { success: false, error: "validation_failed" };
  }

  // 2. Check for Firebase Admin configuration
  if (!isFirebaseAdminConfigured || !adminDb) {
    console.error("[submitBookingRequest] Firebase Admin not configured.");
    return { success: false, error: "booking_failed" };
  }

  try {
    // 3. Save to Firestore (bookings_leads) with a reasonable timeout implied by the environment
    await adminDb.collection("bookings_leads").add({
      service_id: data.service_id || null,
      service_title: data.service_title || null,
      full_name: data.full_name.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      preferred_date: data.preferred_date,
      guests_count: Number(data.guests_count) || 1,
      message: data.message?.trim() || null,
      created_at: new Date().toISOString(),
      status: "new",
      source_page: data.source_page || null,
      service_type: data.service_type || null,
    });

    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[submitBookingRequest] Firestore Exception:", message);
    // Never expose raw Firebase error messages to the client
    return { success: false, error: "booking_failed" };
  }
}
