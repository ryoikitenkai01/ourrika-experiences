// Lightweight skeleton placeholder components.
// Used to fill loading state while server components stream their data.

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded bg-gray-200 animate-pulse ${className}`}
      aria-hidden="true"
    />
  );
}

export function CardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-lg bg-gray-200 animate-pulse ${className}`}
      aria-hidden="true"
    />
  );
}

export function TextSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded bg-gray-200 animate-pulse h-4 ${className}`}
      aria-hidden="true"
    />
  );
}
