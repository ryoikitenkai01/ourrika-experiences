import * as admin from "firebase-admin";

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;

const missing = [
  !projectId && "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  !clientEmail && "FIREBASE_CLIENT_EMAIL",
  !privateKeyRaw && "FIREBASE_PRIVATE_KEY",
].filter(Boolean);

let adminDb: admin.firestore.Firestore | null = null;

if (missing.length === 0) {
  try {
    // 1. Clean the key aggressively
    let key = privateKeyRaw!.trim().replace(/\\n/g, "\n");
    if (key.startsWith('"') && key.endsWith('"')) key = key.slice(1, -1);
    
    // 2. Extract body and strip everything except valid base64 chars
    const body = key
      .replace(/-----BEGIN PRIVATE KEY-----/, "")
      .replace(/-----END PRIVATE KEY-----/, "")
      .replace(/[^A-Za-z0-9+/=]/g, "");
    
    // 3. Reconstruct standard PEM with 64-char wrapping
    const formattedKey = `-----BEGIN PRIVATE KEY-----\n${body.match(/.{1,64}/g)?.join("\n")}\n-----END PRIVATE KEY-----\n`;

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({ 
          projectId, 
          clientEmail, 
          privateKey: formattedKey 
        }),
      });
    }
    adminDb = admin.firestore();
  } catch (error: unknown) {
    console.error(`[Firebase Admin] Initialization failed: ${error instanceof Error ? error.message : String(error)}`);
  }
} else {
  console.warn(`[Firebase Admin] Missing required environment variables: ${missing.join(", ")}`);
}

export { adminDb };
export const isFirebaseAdminConfigured = () => adminDb !== null;
