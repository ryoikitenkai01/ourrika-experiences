import admin from "firebase-admin";

// Environment variables are expected to be injected via:
// node --env-file=.env.local scripts/seed.mjs

const firebaseAdminConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

const isConfigured = Boolean(
  firebaseAdminConfig.projectId &&
  firebaseAdminConfig.clientEmail &&
  firebaseAdminConfig.privateKey
);

if (!isConfigured) {
  console.error("❌ Firebase Admin credentials missing in environment variables.");
  process.exit(1);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseAdminConfig),
  });
}

const db = admin.firestore();

const FALLBACK_EXPERIENCES = [
  {
    id: "1",
    title: "Table in the Desert",
    slug: "table-in-the-desert",
    image: "https://images.unsplash.com/photo-1504198266315-b77da2928503",
    short_description: "Dinner under the stars in the Agafay stone desert.",
    price: 130,
    currency: "€",
    location: "Agafay Desert",
    duration: "4 hours",
    whatsappMessage: "Hi! I'd like to book Table in the Desert — can you send me availability?",
  },
  {
    id: "2",
    title: "Friday Rooftop",
    slug: "friday-rooftop",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
    short_description: "DJ set, tapas, and the Marrakech skyline every Friday evening.",
    price: 45,
    currency: "€",
    location: "Marrakech Medina",
    duration: "3 hours",
    whatsappMessage: "Hi! I'd like to reserve a spot at Friday Rooftop — how do I book?",
  },
];

const FALLBACK_DESTINATIONS = [
  {
    id: "1",
    name: "Marrakech",
    slug: "marrakech",
    image: "https://images.unsplash.com/photo-1539020290-7389a19c67ee",
    short_description: "The medina, the souks, and the rooftops — all of it.",
    starting_price: 30,
    currency: "€",
  },
  {
    id: "2",
    name: "Ourika Valley",
    slug: "ourika-valley",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
    short_description: "The Atlas foothills, an hour from the city.",
    starting_price: 65,
    currency: "€",
  },
  {
    id: "3",
    name: "Fez",
    slug: "fez",
    image: "https://images.unsplash.com/photo-1548013146-72479768bada",
    short_description: "The oldest medina in the world. Unchanged for centuries.",
    starting_price: 180,
    currency: "€",
  },
];

async function seed() {
  console.log("🚀 Starting database seeding...");

  try {
    // 1. Seed Experiences
    console.log("Seeding experiences...");
    for (const exp of FALLBACK_EXPERIENCES) {
      await db.collection("experiences").doc(exp.slug).set({
        title: exp.title,
        slug: exp.slug,
        cover_image: exp.image,
        short_description: exp.short_description,
        full_description: "This is a detailed description for " + exp.title,
        price: exp.price,
        currency: exp.currency,
        location: exp.location,
        duration: exp.duration,
        is_featured: true,
        homepage_order: 0,
        whatsapp_message_template: exp.whatsappMessage,
        created_at: new Date().toISOString(),
      });
    }

    // 2. Seed Destinations
    console.log("Seeding destinations...");
    for (const dest of FALLBACK_DESTINATIONS) {
      await db.collection("destinations").doc(dest.slug).set({
        name: dest.name,
        slug: dest.slug,
        cover_image: dest.image,
        short_description: dest.short_description,
        full_description: "Explore the beauty of " + dest.name,
        starting_price: dest.starting_price,
        currency: dest.currency,
        is_featured: true,
        homepage_order: 0,
        created_at: new Date().toISOString(),
      });
    }

    // 3. Seed Sample Blog Post
    console.log("Seeding sample blog post...");
    const blogPost = {
      title: "The Art of Slow Travel in Morocco",
      slug: "art-of-slow-travel",
      excerpt: "Why racing through the medina is the wrong way to see Marrakech.",
      body: "<p>In a world that moves too fast, Morocco invites you to slow down. From the rhythmic pouring of mint tea to the intricate patterns of a handmade zellige, every detail deserves your attention.</p>",
      image: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43",
      publish_date: new Date().toISOString(),
    };
    await db.collection("blog_posts").doc(blogPost.slug).set(blogPost);

    console.log("✅ Seeding complete!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seed();
