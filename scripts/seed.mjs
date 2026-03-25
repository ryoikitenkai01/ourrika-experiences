import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('Clearing existing placeholder data (if any)...');
  await supabase.from('experiences').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('destinations').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  console.log('Seeding destinations...');
  const { error: dErr } = await supabase.from('destinations').insert([
    {
      name: 'Agafay Desert',
      slug: 'agafay-desert',
      cover_image: 'https://images.unsplash.com/photo-1549884674-c6a6f3b06cf7?w=1600&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1563124579-2425dafe155b?w=1600&q=80',
        'https://images.unsplash.com/photo-1517427677506-ade074eb1432?w=1600&q=80'
      ],
      short_description: 'A breathtaking moonscape of barren hills and dramatic valleys just outside Marrakech.',
      full_description: 'Discover the stark beauty of the Agafay Desert. Unlike the rolling sand dunes of the Sahara, Agafay is a rugged stone desert offering spectacular views of the High Atlas Mountains. Perfect for luxury camping, starlight dinners, and peaceful isolation.',
      starting_price: 1200,
      currency: 'MAD',
      is_featured: true,
      homepage_order: 1
    },
    {
      name: 'Atlas Mountains',
      slug: 'atlas-mountains',
      cover_image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=1600&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1601058269988-cb9e403487c9?w=1600&q=80',
        'https://images.unsplash.com/photo-1588691515222-777de0376249?w=1600&q=80'
      ],
      short_description: 'Majestic peaks and traditional Berber villages offering an authentic escape from the city.',
      full_description: 'Journey through the winding roads of the High Atlas. Experience the profound hospitality of the Berber people, hike through lush valleys, and marvel at terraced agricultural mountainsides. An essential contrast to the bustle of the medina.',
      starting_price: 850,
      currency: 'MAD',
      is_featured: true,
      homepage_order: 2
    }
  ]);
  
  if (dErr) console.error('Error inserting destinations:', dErr);

  console.log('Seeding experiences...');
  const { error: eErr } = await supabase.from('experiences').insert([
    {
      title: 'Sunrise Hot Air Balloon Flight',
      slug: 'sunrise-hot-air-balloon',
      cover_image: 'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=1600&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1551228499-28c0490b7937?w=1600&q=80',
        'https://images.unsplash.com/photo-1621867175404-5853b0a2cb7d?w=1600&q=80'
      ],
      highlights: ['Private transfer from your hotel', 'Traditional Moroccan breakfast', '1-hour flight at sunrise', 'Flight certificate'],
      short_description: 'Float gently above the awakening Moroccan landscape as the sun casts gold over the Atlas Mountains.',
      full_description: 'Experience the ultimate serenity of a hot air balloon flight. Your morning begins with a pre-dawn pickup from your accommodation, driving you out to the launch site. As the balloon inflates, you will enjoy a light Moroccan tea. Once airborne, the silence is broken only by the occasional roar of the burner. Watch the landscape transform under the morning sun, capturing unparalleled views of Berber villages and distant mountain peaks. Conclude with a lavish traditional breakfast in a Berber tent.',
      location: 'Marrakech Periphery',
      price: 2200,
      currency: 'MAD',
      duration: '4 Hours',
      is_featured: true,
      homepage_order: 1
    },
    {
      title: 'Agafay Desert Luxury Camp',
      slug: 'agafay-desert-luxury-camp',
      cover_image: 'https://images.unsplash.com/photo-1608244977934-0d9ffbedbf31?w=1600&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1582662052458-1d2f6ffb9cf6?w=1600&q=80',
        'https://images.unsplash.com/photo-1549884674-c6a6f3b06cf7?w=1600&q=80'
      ],
      highlights: ['Sunset camel ride', 'Private dining tent', '3-course traditional dinner', 'Live acoustic Berber music'],
      short_description: 'An unforgettable evening under the stars in the rugged moonscape of the Agafay Desert.',
      full_description: 'Escape the city limits to the vast, stony expanse of the Agafay Desert. Arrive just in time to mount a camel and ride to a panoramic viewpoint for sunset. Afterwards, retreat to an elegantly appointed luxury tent for a private dining experience illuminated by lanterns and the brilliant night sky. Savor a meticulously prepared tagine while listening to soft, rhythmic local music.',
      location: 'Agafay',
      price: 1500,
      currency: 'MAD',
      duration: 'Evening / Half Day',
      is_featured: true,
      homepage_order: 2
    },
    {
      title: 'Medina Culinary Masterclass',
      slug: 'medina-culinary-masterclass',
      cover_image: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1600&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1552554005-4c07da19ae36?w=1600&q=80',
        'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=1600&q=80'
      ],
      highlights: ['Guided souk market tour', 'Ingredient sourcing with a chef', 'Hands-on tagine cooking', 'Rooftop lunch'],
      short_description: 'Master the art of Moroccan spices in a private riad setting with an expert local chef.',
      full_description: 'Dive deep into the flavors of Morocco. Your day begins with a guided walk through the vibrant alleys of the medina, where you will learn to select the freshest spices, vegetables, and meats just like a local. Return to a stunning private riad courtyard to begin your culinary journey. Under the guidance of a master chef, you will learn the secrets of balancing sweet and savory in classic tagines and delicate salads. The experience culminates in a feast of your own creation on a sun-drenched rooftop terrace.',
      location: 'Marrakech Medina',
      price: 950,
      currency: 'MAD',
      duration: '5 Hours',
      is_featured: true,
      homepage_order: 3
    }
  ]);
  
  if (eErr) console.error('Error inserting experiences:', eErr);

  console.log('Seed complete! You can view the site now.');
}

seed();
