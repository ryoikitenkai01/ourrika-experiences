"use server";

import { adminDb } from "@/lib/firebase-admin";
import { revalidatePath } from "next/cache";

export interface PartnerFormState {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

function parseFormData(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const logo = (formData.get("logo") as string)?.trim();
  const link = (formData.get("link") as string)?.trim() || null;
  const display_order_raw = formData.get("display_order") as string;
  const display_order = display_order_raw ? Number(display_order_raw) : 0;
  const is_active = formData.get("is_active") === "on";

  return { name, logo, link, display_order, is_active };
}

function validate(data: ReturnType<typeof parseFormData>): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!data.name) errors.name = "Partner name is required.";
  if (!data.logo) errors.logo = "Logo URL is required.";
  return errors;
}

export async function createPartner(_prevState: PartnerFormState, formData: FormData): Promise<PartnerFormState> {
  const data = parseFormData(formData);
  const fieldErrors = validate(data);
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  if (!adminDb) return { error: "Firebase Admin not configured." };

  try {
    const docRef = adminDb.collection("partners").doc();
    await docRef.set({ id: docRef.id, ...data, created_at: new Date().toISOString() });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[createPartner]", message);
    return { error: message };
  }

  revalidatePath("/admin/partners");
  revalidatePath("/", "layout");
  return { success: true };
}

export async function updatePartner(id: string, _prevState: PartnerFormState, formData: FormData): Promise<PartnerFormState> {
  const data = parseFormData(formData);
  const fieldErrors = validate(data);
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  if (!adminDb) return { error: "Firebase Admin not configured." };

  try {
    await adminDb.collection("partners").doc(id).update({ ...data, updated_at: new Date().toISOString() });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[updatePartner]", message);
    return { error: message };
  }

  revalidatePath("/admin/partners");
  revalidatePath("/", "layout");
  return { success: true };
}

export async function deletePartner(id: string): Promise<PartnerFormState> {
  if (!adminDb) return { error: "Firebase Admin not configured." };
  try {
    await adminDb.collection("partners").doc(id).delete();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[deletePartner]", message);
    return { error: message };
  }
  revalidatePath("/admin/partners");
  revalidatePath("/", "layout");
  return { success: true };
}
