"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Possibly log to an error monitoring service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-24 px-6 text-center">
      <div className="w-12 h-px bg-[var(--color-terracotta)] mb-8" />
      <h2 className="font-serif text-3xl md:text-4xl text-[var(--color-sand-light)] mb-4">
        Something went wrong
      </h2>
      <p className="font-sans text-[var(--color-charcoal-light)] max-w-md mx-auto mb-10 leading-relaxed">
        We encountered an error while trying to load this page. Please try again or return home.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Button onClick={() => reset()} variant="secondary">
          Try again
        </Button>
        <Button href="/" variant="primary">
          Return Home
        </Button>
      </div>
    </div>
  );
}
