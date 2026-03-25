"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Real implementation would use an environment variable (e.g., process.env.ADMIN_PASSCODE)
// We default to "ourrika2026" if no ENV is provided for immediate testing.
const VALID_USERNAME = "Sadox";
const VALID_PASSCODE = process.env.ADMIN_PASSCODE || "ourrika2026";

export async function loginWithPasscode(formData: FormData) {
  const username = formData.get("username") as string;
  const passcode = formData.get("passcode") as string;

  if (username !== VALID_USERNAME) {
    return { error: "Invalid username." };
  }

  if (passcode !== VALID_PASSCODE) {
    return { error: "Incorrect passcode." };
  }

  const cookieStore = await cookies();
  cookieStore.set("ourrika_admin_token", "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  });

  redirect("/admin");
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("ourrika_admin_token");
  redirect("/admin");
}
