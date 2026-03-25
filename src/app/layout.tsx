import type { Metadata } from "next";
import { Inter, Noto_Serif, Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ourrika Experiences | Luxury Travel Morocco",
  description:
    "Escape. Breathe. Explore. Discover premium, authentic Moroccan experiences with Ourrika Experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`scroll-smooth ${inter.variable} ${playfair.variable} ${notoSerif.variable} ${manrope.variable}`}
    >
      <body
        suppressHydrationWarning
        className="antialiased font-sans flex flex-col min-h-screen bg-[var(--color-sand-light)] text-[var(--color-charcoal)]"
      >
        {children}
      </body>
    </html>
  );
}
