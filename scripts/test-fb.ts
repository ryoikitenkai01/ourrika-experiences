import * as admin from "firebase-admin";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;

console.log("Testing Firebase Admin initialization...");
console.log("Project ID:", projectId);
console.log("Client Email:", clientEmail);
console.log("Private Key exists:", !!privateKeyRaw);

if (!projectId || !clientEmail || !privateKeyRaw) {
  console.error("Missing env vars!");
  process.exit(1);
}

const privateKey = privateKeyRaw.replace(/\\n/g, "\n");

try {
  admin.initializeApp({
    credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
  });
  const db = admin.firestore();
  console.log("Attempting to fetch count of 'experiences'...");
  const snapshot = await db.collection("experiences").count().get();
  console.log("Count result:", snapshot.data().count);
} catch (err) {
  console.error("Initialization / Fetch failed:", err);
}
