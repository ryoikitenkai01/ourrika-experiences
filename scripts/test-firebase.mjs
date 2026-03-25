import admin from "firebase-admin";

const firebaseAdminConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseAdminConfig),
  });
}

const db = admin.firestore();

async function testConnection() {
  console.log("🧪 Running Firebase verification test...");
  
  try {
    const exp = await db.collection("experiences").count().get();
    const dest = await db.collection("destinations").count().get();
    const leads = await db.collection("bookings_leads").count().get();
    const blog = await db.collection("blog_posts").count().get();

    console.log("✅ Connection: Success");
    console.log(`📊 Experiences: ${exp.data().count}`);
    console.log(`📊 Destinations: ${dest.data().count}`);
    console.log(`📊 Bookings: ${leads.data().count}`);
    console.log(`📊 Blog Posts: ${blog.data().count}`);

    if (exp.data().count > 0 && dest.data().count > 0) {
      console.log("🔥 Verification: REAL DATA FOUND. Seeding was successful.");
    } else {
      console.log("⚠️ Verification: NO DATA FOUND. Seeding might have failed.");
    }

  } catch (error) {
    console.error("❌ Test failed:", error.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

testConnection();
