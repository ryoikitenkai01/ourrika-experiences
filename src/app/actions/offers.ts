"use server";

import { adminDb } from "@/lib/firebase-admin";
import { revalidatePath } from "next/cache";

export interface OfferFormState {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

function slugify(text: string): string {
  return text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/^-+|-+$/g, "");
}

function parseFormData(formData: FormData) {
  const title = (formData.get("title") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim() || (title ? slugify(title) : "");
  const cover_image = (formData.get("cover_image") as string)?.trim() || null;
  const description = (formData.get("description") as string)?.trim() || null;
  const original_price_raw = formData.get("original_price") as string;
  const original_price = original_price_raw ? Number(original_price_raw) : null;
  const promo_price_raw = formData.get("promo_price") as string;
  const promo_price = promo_price_raw ? Number(promo_price_raw) : null;
  const valid_from = (formData.get("valid_from") as string) || null;
  const valid_until = (formData.get("valid_until") as string) || null;
  const is_featured = formData.get("is_featured") === "on";
  
  const linked_experience_id = (formData.get("linked_experience_id") as string) || null;
  const linked_destination_id = (formData.get("linked_destination_id") as string) || null;

  return { title, slug, cover_image, description, original_price, promo_price, valid_from, valid_until, is_featured,
    linked_experience_id: linked_experience_id === "none" ? null : linked_experience_id,
    linked_destination_id: linked_destination_id === "none" ? null : linked_destination_id,
  };
}

function validate(data: ReturnType<typeof parseFormData>): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!data.title) errors.title = "Title is required.";
  if (!data.slug) errors.slug = "Slug is required.";
  if (data.original_price !== null && isNaN(data.original_price)) errors.original_price = "Original price must be a number.";
  if (data.promo_price !== null && isNaN(data.promo_price)) errors.promo_price = "Promo price must be a number.";
  return errors;
}

export async function createOffer(_prevState: OfferFormState, formData: FormData): Promise<OfferFormState> {
  const data = parseFormData(formData);
  const fieldErrors = validate(data);
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  if (!adminDb) return { error: "Firebase Admin not configured." };

  try {
    const docRef = adminDb.collection("offers").doc();
    await docRef.set({ id: docRef.id, ...data, created_at: new Date().toISOString() });
  } catch (error: any) {
    console.error("[createOffer]", error.message);
    return { error: error.message };
  }

  revalidatePath("/admin/offers");
  revalidatePath("/", "layout");
  return { success: true };
}

export async function updateOffer(id: string, _prevState: OfferFormState, formData: FormData): Promise<OfferFormState> {
  const data = parseFormData(formData);
  const fieldErrors = validate(data);
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  if (!adminDb) return { error: "Firebase Admin not configured." };

  try {
    await adminDb.collection("offers").doc(id).update({ ...data, updated_at: new Date().toISOString() });
  } catch (error: any) {
    console.error("[updateOffer]", error.message);
    return { error: error.message };
  }

  revalidatePath("/admin/offers");
  revalidatePath(`/offers/${data.slug}`);
  revalidatePath("/", "layout");
  return { success: true };
}

export async function deleteOffer(id: string): Promise<OfferFormState> {
  if (!adminDb) return { error: "Firebase Admin not configured." };
  try {
    await adminDb.collection("offers").doc(id).delete();
  } catch (error: any) {
    console.error("[deleteOffer]", error.message);
    return { error: error.message };
  }
  revalidatePath("/admin/offers");
  revalidatePath("/", "layout");
  return { success: true };
}
