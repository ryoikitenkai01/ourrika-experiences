"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service if needed
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#1A1A1A] p-6 text-center text-white">
      <h2 className="mb-4 font-serif text-2xl tracking-wide uppercase">Something went wrong</h2>
      <p className="mb-8 font-serif italic text-sm text-zinc-400">
        We encountered an unexpected error while processing your request. Please try again.
      </p>
      <button
        onClick={() => reset()}
        className="px-10 py-4 border border-[#C0714F] text-[#C0714F] text-[11px] tracking-[0.3em] font-bold uppercase transition-all hover:bg-[#C0714F] hover:text-white"
      >
        Retry
      </button>
    </div>
  );
}
