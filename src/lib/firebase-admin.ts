import * as admin from "firebase-admin";

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;

const missing = [
  !projectId && "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  !clientEmail && "FIREBASE_CLIENT_EMAIL",
  !privateKeyRaw && "FIREBASE_PRIVATE_KEY",
].filter(Boolean);

if (missing.length > 0) {
  throw new Error(
    `Firebase Admin SDK failed to initialize: missing env vars: ${missing.join(", ")}`
  );
}

const privateKey = privateKeyRaw!.replace(/\\n/g, "\n");

if (!privateKey.includes("BEGIN PRIVATE KEY")) {
  throw new Error(
    "Firebase Admin SDK failed to initialize: FIREBASE_PRIVATE_KEY is malformed (missing PEM header)"
  );
}

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
    });
  } catch (err) {
    throw new Error(
      `Firebase Admin SDK failed to initialize: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}

export const isFirebaseAdminConfigured = true;
export const adminDb = admin.firestore();
