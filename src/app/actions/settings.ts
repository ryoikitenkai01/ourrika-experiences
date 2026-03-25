"use server";

import { adminDb } from "@/lib/firebase-admin";
import { revalidatePath } from "next/cache";

export interface SettingsFormState {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function updateSettings(_prevState: SettingsFormState, formData: FormData): Promise<SettingsFormState> {
  if (!adminDb) return { error: "Firebase Admin not configured." };

  const hero_title = (formData.get("hero_title") as string)?.trim();
  const hero_media_url = (formData.get("hero_media_url") as string)?.trim() || null;
  const whatsapp_number = (formData.get("whatsapp_number") as string)?.trim() || null;
  const contact_email = (formData.get("contact_email") as string)?.trim() || null;
  const instagram_link = (formData.get("instagram_link") as string)?.trim() || null;
  const facebook_link = (formData.get("facebook_link") as string)?.trim() || null;
  const tiktok_link = (formData.get("tiktok_link") as string)?.trim() || null;
  const faq_link = (formData.get("faq_link") as string)?.trim() || null;

  const data = {
    hero_title, hero_media_url, whatsapp_number, contact_email, instagram_link, facebook_link, tiktok_link, faq_link,
    updated_at: new Date().toISOString(),
  };

  try {
    const snapshot = await adminDb.collection("site_settings").limit(1).get();
    
    if (!snapshot.empty) {
      // Update existing
      const docId = snapshot.docs[0].id;
      await adminDb.collection("site_settings").doc(docId).update(data);
    } else {
      // Insert new
      const nextDoc = adminDb.collection("site_settings").doc();
      await nextDoc.set({ id: nextDoc.id, ...data });
    }
  } catch (error: any) {
    console.error("[updateSettings]", error.message);
    return { error: error.message };
  }

  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
  return { success: true };
}
