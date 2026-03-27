import type { Metadata } from "next";
import { generateDynamicMetadata } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = generateDynamicMetadata({
  title: "Our Story",
  description: "Ourrika Experiences was born from a belief that Morocco deserves to be felt, not just visited.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F5EFE4]">
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1548013146-72479768bada?w=1600&q=80"
          alt="The ancient medina of Fez, Morocco — narrow stone passages lined with terracotta walls"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-end p-12 md:p-20">
          <div>
            <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-white/60 mb-4">
              Who we are
            </p>
            <h1 className="font-serif italic text-4xl md:text-6xl text-white leading-tight">
              Our Story
            </h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="font-sans text-sm text-[#5c605d] leading-relaxed space-y-8">
            <p className="font-serif italic text-2xl text-[#1A1A1A] leading-snug">
              Ourrika was born from a belief that Morocco deserves to be felt, not just visited.
            </p>
            <p>
              We are a small team of guides, storytellers, and hosts based in Marrakech. We grew up
              in the medinas, the valleys, and the desert edges that most itineraries skip over.
              We started Ourrika because we kept watching travellers leave without really arriving.
            </p>
            <p>
              Every experience we curate is one we have done ourselves — with friends, with family,
              late at night and in the early morning. We know which rooftop catches the last light,
              which cook will change how you think about spice, and which silence in the Atlas is
              worth the drive.
            </p>
            <p>
              We keep our group sizes small, our communication direct, and our prices honest. No
              hidden fees, no commission chains. You talk to us and we make it happen.
            </p>
          </div>

          <div className="mt-16 pt-12 border-t border-[#C56B5C]/20">
            <Link
              href="/experiences"
              className="inline-flex items-center text-[#1A1A1A] font-sans text-[10px] tracking-widest uppercase group"
            >
              <span>Explore our activities</span>
              <div className="ml-4 w-8 h-px bg-[#1A1A1A]/40 transition-all group-hover:w-12 group-hover:bg-[#C56B5C]" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
