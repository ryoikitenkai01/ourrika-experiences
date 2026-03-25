"use server";

import { adminDb } from "@/lib/firebase-admin";
import { revalidatePath } from "next/cache";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ExperienceFormState {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseFormData(formData: FormData) {
  const title = (formData.get("title") as string)?.trim();
  const slug =
    (formData.get("slug") as string)?.trim() || (title ? slugify(title) : "");
  const cover_image = (formData.get("cover_image") as string)?.trim();
  const short_description =
    (formData.get("short_description") as string)?.trim() || null;
  const full_description =
    (formData.get("full_description") as string)?.trim() || null;
  const location = (formData.get("location") as string)?.trim() || null;
  const priceRaw = formData.get("price") as string;
  const price = priceRaw ? Number(priceRaw) : null;
  const currency = (formData.get("currency") as string)?.trim() || "MAD";
  const duration = (formData.get("duration") as string)?.trim() || null;
  const is_featured = formData.get("is_featured") === "on";
  const homepageOrderRaw = formData.get("homepage_order") as string;
  const homepage_order = homepageOrderRaw ? Number(homepageOrderRaw) : null;
  const whatsapp_message_template =
    (formData.get("whatsapp_message_template") as string)?.trim() || null;

  // Gallery: comma-separated URLs
  const galleryRaw = (formData.get("gallery") as string)?.trim() || "";
  const gallery = galleryRaw
    ? galleryRaw.split("\n").map((url) => url.trim()).filter(Boolean)
    : null;

  // Highlights: newline-separated
  const highlightsRaw = (formData.get("highlights") as string)?.trim() || "";
  const highlights = highlightsRaw
    ? highlightsRaw.split("\n").map((h) => h.trim()).filter(Boolean)
    : null;

  return {
    title,
    slug,
    cover_image,
    short_description,
    full_description,
    location,
    price,
    currency,
    duration,
    is_featured,
    homepage_order,
    whatsapp_message_template,
    gallery,
    highlights,
  };
}

function validate(data: ReturnType<typeof parseFormData>): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!data.title) errors.title = "Title is required.";
  if (!data.slug) errors.slug = "Slug is required.";
  if (!data.cover_image) errors.cover_image = "Cover image URL is required.";
  if (data.price !== null && isNaN(data.price))
    errors.price = "Price must be a number.";
  return errors;
}

// ---------------------------------------------------------------------------
// CREATE
// ---------------------------------------------------------------------------

export async function createExperience(
  _prevState: ExperienceFormState,
  formData: FormData
): Promise<ExperienceFormState> {
  const data = parseFormData(formData);
  const fieldErrors = validate(data);
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  if (!adminDb) {
    return { error: "Firebase Admin is not configured." };
  }

  try {
    const docRef = adminDb.collection("experiences").doc();
    await docRef.set({
      id: docRef.id,
      ...data,
      created_at: new Date().toISOString()
    });
  } catch (error: any) {
    console.error("[createExperience]", error.message);
    return { error: error.message };
  }

  revalidatePath("/admin/experiences");
  revalidatePath("/", "layout"); // public pages too
  return { success: true };
}

// ---------------------------------------------------------------------------
// UPDATE
// ---------------------------------------------------------------------------

export async function updateExperience(
  id: string,
  _prevState: ExperienceFormState,
  formData: FormData
): Promise<ExperienceFormState> {
  const data = parseFormData(formData);
  const fieldErrors = validate(data);
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  if (!adminDb) return { error: "Firebase Admin not configured" };

  try {
    await adminDb.collection("experiences").doc(id).update({
      ...data,
      updated_at: new Date().toISOString()
    });
  } catch (error: any) {
    console.error("[updateExperience]", error.message);
    return { error: error.message };
  }

  revalidatePath("/admin/experiences");
  revalidatePath(`/experiences/${data.slug}`);
  revalidatePath("/", "layout");
  return { success: true };
}

// ---------------------------------------------------------------------------
// DELETE
// ---------------------------------------------------------------------------

export async function deleteExperience(id: string): Promise<ExperienceFormState> {
  if (!adminDb) return { error: "Firebase Admin not configured" };

  try {
    await adminDb.collection("experiences").doc(id).delete();
  } catch (error: any) {
    console.error("[deleteExperience]", error.message);
    return { error: error.message };
  }

  revalidatePath("/admin/experiences");
  revalidatePath("/", "layout");
  return { success: true };
}
