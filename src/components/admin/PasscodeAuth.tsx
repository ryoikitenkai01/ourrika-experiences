"use client";

import { useTransition, useState } from "react";
import { loginWithPasscode } from "@/app/actions/passcode";
import { ArrowRight, Loader2 } from "lucide-react";

export function PasscodeAuth() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function onSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const response = await loginWithPasscode(formData);
      if (response && response.error) {
        setError(response.error);
      }
    });
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-[#F9F9F9] p-6">
      <div className="w-full max-w-[400px] flex items-center justify-center mb-10">
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-12 h-12 text-[var(--color-charcoal)]"
        >
          <path
            d="M20 0L40 10V30L20 40L0 30V10L20 0ZM18.5 4.5L3 12V28.5L18.5 36V4.5ZM21.5 4.5V36L37 28.5V12L21.5 4.5Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <div className="w-full max-w-[400px] border border-gray-100 bg-white shadow-xl shadow-black/[0.03] p-8 md:p-12">
        <div className="mb-10 text-center">
          <h1 className="font-serif text-3xl text-[var(--color-charcoal)] mb-3">
            Admin Access
          </h1>
          <p className="font-sans text-sm tracking-widest uppercase text-gray-400">
            Internal Operations
          </p>
          <div className="w-10 h-px bg-[var(--color-terracotta)] mt-6 mx-auto" />
        </div>

        <form action={onSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="username"
              className="font-sans text-[11px] tracking-widest uppercase text-gray-500"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              defaultValue="Sadox"
              className="h-12 border-b border-gray-200 bg-transparent px-0 font-sans text-sm focus:border-[var(--color-terracotta)] focus:outline-none focus:ring-0 transition-colors"
              placeholder="e.g. Sadox"
              disabled={isPending}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="passcode"
              className="font-sans text-[11px] tracking-widest uppercase text-gray-500"
            >
              Passcode
            </label>
            <input
              id="passcode"
              name="passcode"
              type="password"
              required
              className="h-12 border-b border-gray-200 bg-transparent px-0 font-sans text-sm focus:border-[var(--color-terracotta)] focus:outline-none focus:ring-0 transition-colors"
              placeholder="••••••••"
              disabled={isPending}
            />
          </div>

          {error && (
            <p className="font-sans text-xs text-red-500 bg-red-50 p-3 mt-2 border border-red-100">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="group mt-4 flex items-center justify-center gap-2 h-14 w-full bg-[var(--color-terracotta)] text-white font-sans text-xs tracking-widest uppercase hover:bg-[var(--color-terracotta-dark)] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                Unlock Dashboard
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
