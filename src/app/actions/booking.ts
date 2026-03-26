"use server";

import { z } from "zod";
import { adminDb } from "@/lib/firebase-admin";
import type { BookingRequest, BookingResult } from "@/lib/types/booking";

const bookingSchema = z.object({
  full_name: z.string().trim().min(1),
  email: z.string().email(),
  phone: z.string().transform(val => val.replace(/\D/g, '')).refine(val => val.length >= 7),
  preferred_date: z.string().min(1),
  guests_count: z.preprocess((val) => Number(val), z.number().int().min(1).max(20)),
  message: z.string().optional().nullable(),
  service_id: z.string().optional().nullable(),
  service_title: z.string().optional().nullable(),
  service_type: z.string().optional().nullable(),
  source_page: z.string().optional().nullable(),
});

export async function submitBookingRequest(data: BookingRequest): Promise<BookingResult> {
  // 1. Zod Validation
  const result = bookingSchema.safeParse(data);
  
  if (!result.success) {
    return { success: false, error: "validation_failed" };
  }

  const validatedData = result.data;

  try {
    if (!adminDb) return { success: false, error: "booking_failed" };
    // 3. Save to Firestore (bookings_leads) with a reasonable timeout implied by the environment
    await adminDb.collection("bookings_leads").add({
      service_id: validatedData.service_id || null,
      service_title: validatedData.service_title || null,
      full_name: validatedData.full_name,
      email: validatedData.email,
      phone: validatedData.phone,
      preferred_date: validatedData.preferred_date,
      guests_count: validatedData.guests_count,
      message: validatedData.message || null,
      created_at: new Date().toISOString(),
      status: "new",
      source_page: validatedData.source_page || null,
      service_type: validatedData.service_type || null,
    });

    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[submitBookingRequest] Firestore Exception:", message);
    // Never expose raw Firebase error messages to the client
    return { success: false, error: "booking_failed" };
  }
}
