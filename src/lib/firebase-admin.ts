import * as admin from "firebase-admin";

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;

// Soft fail if env vars are absent — log error and export null so pages render with fallback data
const missing = [
  !projectId && "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  !clientEmail && "FIREBASE_CLIENT_EMAIL",
  !privateKeyRaw && "FIREBASE_PRIVATE_KEY",
].filter(Boolean);

if (missing.length > 0) {
  console.error(
    `Firebase Admin SDK failed to initialize: missing env vars: ${missing.join(", ")}`
  );
}

let adminDb: admin.firestore.Firestore | null = null;

if (missing.length === 0) {
  const privateKey = privateKeyRaw!.replace(/\\n/g, "\n");

  if (!privateKey.includes("BEGIN PRIVATE KEY")) {
    console.error(
      "Firebase Admin SDK failed to initialize: FIREBASE_PRIVATE_KEY is malformed (missing PEM header)"
    );
  } else if (!admin.apps.length) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
      });
      adminDb = admin.firestore();
    } catch (err) {
      console.error(
        `Firebase Admin SDK failed to initialize: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  } else {
    adminDb = admin.firestore();
  }
}

export const isFirebaseAdminConfigured = adminDb !== null;
export { adminDb };
