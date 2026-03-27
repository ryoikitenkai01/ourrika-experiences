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

const DESTINATIONS = [
  {
    name: "Marrakech",
    slug: "marrakech",
    cover_image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=1200&q=80",
    short_description: "The medina, the souks, and the rooftops — all of it.",
    starting_price: 30,
    currency: "€",
    is_featured: true,
    homepage_order: 1,
  },
  {
    name: "Ourika Valley",
    slug: "ourika-valley",
    cover_image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    short_description: "The Atlas foothills, an hour from the city.",
    starting_price: 65,
    currency: "€",
    is_featured: true,
    homepage_order: 2,
  },
  {
    name: "Chefchaouen",
    slug: "chefchaouen",
    cover_image: "https://images.unsplash.com/photo-1548041019-7217fc7d7bc9?auto=format&fit=crop&w=1200&q=80",
    short_description: "The Blue Pearl of the Rif Mountains.",
    starting_price: 90,
    currency: "€",
    is_featured: true,
    homepage_order: 3,
  },
  {
    name: "Merzouga",
    slug: "merzouga",
    cover_image: "https://images.unsplash.com/photo-1509233725247-49e657c54213?auto=format&fit=crop&w=1200&q=80",
    short_description: "Gateway to the majestic Erg Chebbi dunes.",
    starting_price: 140,
    currency: "€",
    is_featured: true,
    homepage_order: 4,
  },
  {
    name: "Essaouira",
    slug: "essaouira",
    cover_image: "https://images.unsplash.com/photo-1559586061-3c73ef795604?auto=format&fit=crop&w=1200&q=80",
    short_description: "The windy city by the Atlantic coast.",
    starting_price: 50,
    currency: "€",
    is_featured: true,
    homepage_order: 5,
  },
];

const EXPERIENCES = [
  {
    title: "Table in the Desert",
    slug: "table-in-the-desert",
    cover_image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=1200&q=80",
    short_description: "Dinner under the stars in the Agafay stone desert.",
    price: 130,
    currency: "€",
    location: "Agafay Desert",
    duration: "4 hours",
    whatsapp_message_template: "Hi! I'd like to book Table in the Desert — can you send me availability?",
    is_featured: true,
    homepage_order: 1,
  },
  {
    title: "Friday Rooftop",
    slug: "friday-rooftop",
    cover_image: "https://picsum.photos/seed/marrakech-rooftop/1200/800",
    short_description: "DJ set, tapas, and the Marrakech skyline every Friday evening.",
    price: 45,
    currency: "€",
    location: "Marrakech Medina",
    duration: "3 hours",
    whatsapp_message_template: "Hi! I'd like to reserve a spot at Friday Rooftop — how do I book?",
    is_featured: true,
    homepage_order: 2,
  },
  {
    title: "Blue Alley Photo Walk",
    slug: "blue-alley-photo-walk",
    cover_image: "https://images.unsplash.com/photo-1548041019-7217fc7d7bc9?auto=format&fit=crop&w=1200&q=80",
    short_description: "Discover the hidden gems of Chefchaouen with a professional photographer.",
    price: 85,
    currency: "€",
    location: "Chefchaouen",
    duration: "2 hours",
    whatsapp_message_template: "Hi! I'm interested in the Blue Alley Photo Walk.",
    is_featured: true,
    homepage_order: 3,
  },
  {
    title: "Sunset Camel Trek",
    slug: "sunset-camel-trek",
    cover_image: "https://images.unsplash.com/photo-1509233725247-49e657c54213?auto=format&fit=crop&w=1200&q=80",
    short_description: "An iconic Saharan journey into the golden dunes of Merzouga.",
    price: 150,
    currency: "€",
    location: "Merzouga",
    duration: "Overnight",
    whatsapp_message_template: "Hi! I'd like to book the Sunset Camel Trek.",
    is_featured: true,
    homepage_order: 4,
  },
  {
    title: "Kasbah Cooking Class",
    slug: "kasbah-cooking-class",
    cover_image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=1200&q=80",
    short_description: "Learn the secrets of Moroccan spices in an ancient Kasbah in the Ourrika Valley.",
    price: 110,
    currency: "€",
    location: "Ourrika Valley",
    duration: "Half-day",
    whatsapp_message_template: "Hi! Tell me more about the Kasbah Cooking Class.",
    is_featured: true,
    homepage_order: 5,
  },
];

async function seed() {
  console.log("Starting seed...");

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

  console.log("Seed completed successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
