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

async function testBooking() {
  console.log("🧪 Testing booking flow...");
  
  try {
    const testLead = {
      service_id: "test-experience",
      service_title: "Test Experience",
      service_type: "experience",
      full_name: "Test User",
      email: "test@example.com",
      phone: "1234567890",
      preferred_date: "2026-05-10",
      guests_count: 2,
      message: null,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      status: "new",
      source_page: "/experiences/test-experience",
    };

    const docRef = await db.collection("bookings_leads").add(testLead);
    console.log(`✅ Success: Lead created with ID: ${docRef.id}`);
    
    // Verify cleanup
    await docRef.delete();
    console.log("✅ Cleanup: Test lead deleted.");

  } catch (error) {
    console.error("❌ Test failed:", error.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

testBooking();
