import * as admin from "firebase-admin";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;

if (!projectId || !clientEmail || !privateKeyRaw) {
  console.error("Missing required environment variables in .env.local");
  process.exit(1);
}

// Clean and reformat private key
let key = privateKeyRaw.trim().replace(/\\n/g, "\n");
if (key.startsWith('"') && key.endsWith('"')) key = key.slice(1, -1);
const body = key.replace(/-----BEGIN PRIVATE KEY-----/, "").replace(/-----END PRIVATE KEY-----/, "").replace(/[^A-Za-z0-9+/=]/g, "");
const privateKey = `-----BEGIN PRIVATE KEY-----\n${body.match(/.{1,64}/g)?.join("\n")}\n-----END PRIVATE KEY-----\n`;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
  });
}

const db = admin.firestore();

const SITE_SETTINGS = {
  hero_title: "Escape. Breathe. Explore. Discover Morocco through a curated lens of slow luxury.",
  hero_media_url: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1600&q=80",
  whatsapp_number: "212600000000",
  instagram_link: "https://instagram.com/ourrika",
  contact_email: "hello@ourrika.com",
};

const DESTINATIONS = [
  {
    name: "Marrakech",
    slug: "marrakech",
    cover_image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=1200&q=80",
    short_description: "The red city. A labyrinth of sensory wonder, where ancient medinas meet modern luxury rooftops.",
    full_description: "Marrakech is more than a city; it is a pulse. From the quiet gardens of Majorelle to the chaotic energy of Jemaa el-Fnaa, we curate the moments that most visitors miss.",
    starting_price: 30,
    currency: "€",
    is_featured: true,
    homepage_order: 1,
  },
  {
    name: "Ourrika Valley",
    slug: "ourika-valley",
    cover_image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    short_description: "The emerald heart of the Atlas. Terraced gardens, cold springs, and the breath of the mountains.",
    full_description: "Just an hour from the city, the Ourrika Valley offers a landscape of verdant greens and cool stone. Here, we host our most intimate cooking classes and mountain walks.",
    starting_price: 65,
    currency: "€",
    is_featured: true,
    homepage_order: 2,
  },
  {
    name: "Chefchaouen",
    slug: "chefchaouen",
    cover_image: "https://images.unsplash.com/photo-1548041019-7217fc7d7bc9?auto=format&fit=crop&w=1200&q=80",
    short_description: "The Blue Pearl. A dreamscape of azure alleys and Rif mountain hospitality.",
    starting_price: 90,
    currency: "€",
    is_featured: true,
    homepage_order: 3,
  },
];

const EXPERIENCES = [
  {
    title: "Table in the Desert",
    slug: "table-in-the-desert",
    cover_image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=1200&q=80",
    short_description: "An intimate dinner under the obsidian sky of Agafay.",
    full_description: "Escape the city for the silence of the stone desert. We set a single table, lit by lanterns, where you share a traditional feast as the sun dips below the Atlas peaks.",
    highlights: ["Private transport from Marrakech", "Traditional 3-course Moroccan dinner", "Stargazing with a nomad guide", "Welcome tea and pastries"],
    gallery: [
      "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800&q=80",
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80"
    ],
    price: 130,
    currency: "€",
    location: "Agafay Desert",
    duration: "4 hours",
    whatsapp_message_template: "Hi! I'd like to book Table in the Desert — can you send me availability?",
    is_featured: true,
    homepage_order: 1,
  },
  {
    title: "Friday Rooftop Ritual",
    slug: "friday-rooftop",
    cover_image: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1200&q=80",
    short_description: "Vinyl sets and golden hour vistas over the Medina.",
    full_description: "The finest rooftop session in Marrakech. Curated music, hand-crafted tapas, and the best view of the Koutoubia as the call to prayer echoes through the valley.",
    highlights: ["Reserved rooftop seating", "Signature cocktail/mocktail", "Live DJ sets", "Tapas selection"],
    price: 45,
    currency: "€",
    location: "Marrakech Medina",
    duration: "3 hours",
    whatsapp_message_template: "Hi! I'd like to reserve a spot at Friday Rooftop — how do I book?",
    is_featured: true,
    homepage_order: 2,
  },
];

const BLOG_POSTS = [
  {
    title: "The Art of Slow Travel in Morocco",
    slug: "slow-travel-morocco",
    image: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1200&q=80",
    excerpt: "Why the best way to see the medina is to sit still and watch the light change.",
    body: "<p>In a world of fast transit, Morocco demands a different rhythm...</p>",
    publish_date: new Date().toISOString(),
  }
];

async function seed() {
  console.log("Starting premium seed...");

  // Seed Site Settings
  console.log("Adding site settings...");
  await db.collection("site_settings").doc("main").set(SITE_SETTINGS, { merge: true });

  // Seed Destinations
  for (const item of DESTINATIONS) {
    console.log(`Adding destination: ${item.name}`);
    await db.collection("destinations").doc(item.slug).set(item, { merge: true });
  }

  // Seed Experiences
  for (const item of EXPERIENCES) {
    console.log(`Adding experience: ${item.title}`);
    await db.collection("experiences").doc(item.slug).set(item, { merge: true });
  }

  // Seed Blog Posts
  for (const item of BLOG_POSTS) {
    console.log(`Adding blog post: ${item.title}`);
    await db.collection("blog_posts").doc(item.slug).set(item, { merge: true });
  }

  console.log("Premium seed completed successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
