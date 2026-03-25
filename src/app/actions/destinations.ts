"use server";

import { adminDb } from "@/lib/firebase-admin";
import { revalidatePath } from "next/cache";

export interface DestinationFormState {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseFormData(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim() || (name ? slugify(name) : "");
  const cover_image = (formData.get("cover_image") as string)?.trim();
  const short_description = (formData.get("short_description") as string)?.trim() || null;
  const full_description = (formData.get("full_description") as string)?.trim() || null;
  const starting_price_raw = formData.get("starting_price") as string;
  const starting_price = starting_price_raw ? Number(starting_price_raw) : null;
  const currency = (formData.get("currency") as string)?.trim() || "USD";
  const is_featured = formData.get("is_featured") === "on";
  const is_most_booked = formData.get("is_most_booked") === "on";
  const homepage_order_raw = formData.get("homepage_order") as string;
  const homepage_order = homepage_order_raw ? Number(homepage_order_raw) : 0;

  const galleryRaw = (formData.get("gallery") as string)?.trim() || "";
  const gallery = galleryRaw ? galleryRaw.split("\n").map((url) => url.trim()).filter(Boolean) : null;

  return { name, slug, cover_image, short_description, full_description, starting_price, currency, is_featured, is_most_booked, homepage_order, gallery };
}

function validate(data: ReturnType<typeof parseFormData>): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!data.name) errors.name = "Name is required.";
  if (!data.slug) errors.slug = "Slug is required.";
  if (!data.cover_image) errors.cover_image = "Cover image URL is required.";
  if (data.starting_price !== null && isNaN(data.starting_price)) errors.starting_price = "Starting price must be a number.";
  return errors;
}

export async function createDestination(_prevState: DestinationFormState, formData: FormData): Promise<DestinationFormState> {
  const data = parseFormData(formData);
  const fieldErrors = validate(data);
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  if (!adminDb) return { error: "Firebase Admin is not configured." };

  try {
    const docRef = adminDb.collection("destinations").doc();
    await docRef.set({ id: docRef.id, ...data, created_at: new Date().toISOString() });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[createDestination]", message);
    return { error: message };
  }

  revalidatePath("/admin/destinations");
  revalidatePath("/", "layout");
  return { success: true };
}

export async function updateDestination(id: string, _prevState: DestinationFormState, formData: FormData): Promise<DestinationFormState> {
  const data = parseFormData(formData);
  const fieldErrors = validate(data);
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  if (!adminDb) return { error: "Firebase Admin not configured" };

  try {
    await adminDb.collection("destinations").doc(id).update({ ...data, updated_at: new Date().toISOString() });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[updateDestination]", message);
    return { error: message };
  }

  revalidatePath("/admin/destinations");
  revalidatePath(`/destinations/${data.slug}`);
  revalidatePath("/", "layout");
  return { success: true };
}

export async function deleteDestination(id: string): Promise<DestinationFormState> {
  if (!adminDb) return { error: "Firebase Admin not configured" };

  try {
    await adminDb.collection("destinations").doc(id).delete();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[deleteDestination]", message);
    return { error: message };
  }

  revalidatePath("/admin/destinations");
  revalidatePath("/", "layout");
  return { success: true };
}
