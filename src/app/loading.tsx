
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1A1A1A] text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#C0714F] border-t-transparent" />
        <p className="font-serif text-[11px] tracking-[0.3em] uppercase opacity-60">Loading...</p>
      </div>
    </div>
  );
}
