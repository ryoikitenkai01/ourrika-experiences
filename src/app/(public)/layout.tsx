import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { MobileStickyBar } from "@/components/layout/MobileStickyBar";
import { getSiteSettings, WHATSAPP_FALLBACK } from "@/lib/data";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  const whatsappNumber = settings.whatsapp_number || WHATSAPP_FALLBACK;

  return (
    <>
      <Navbar settings={settings} />
      <main className="flex-grow">{children}</main>
      <Footer settings={settings} />
      <WhatsAppButton phoneNumber={whatsappNumber} />
      <MobileStickyBar whatsappNumber={whatsappNumber} />
    </>
  );
}
