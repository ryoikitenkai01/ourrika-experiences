import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-24 px-6 text-center">
      <div className="w-12 h-px bg-[var(--color-terracotta)] mb-8" />
      <h2 className="font-serif text-4xl md:text-5xl text-[var(--color-sand-light)] mb-6">
        Page Not Found
      </h2>
      <p className="font-sans text-[var(--color-charcoal-light)] max-w-md mx-auto mb-10 leading-relaxed">
        The destination you are looking for doesn&apos;t exist or has moved. Let&apos;s get you back on track.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Button href="/" variant="primary">
          Return Home
        </Button>
        <Button href="/experiences" variant="secondary">
          Explore Experiences
        </Button>
      </div>
    </div>
  );
}
