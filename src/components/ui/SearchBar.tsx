"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  className?: string;
}

export function SearchBar({ placeholder = "Search...", onSearch, className = "" }: SearchBarProps) {
  const [value, setValue] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
    onSearch(e.target.value);
  }

  function handleClear() {
    setValue("");
    onSearch("");
  }

  return (
    <div className={`relative max-w-xl w-full ${className}`}>
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <Search size={18} className="text-[var(--color-charcoal-light)]" />
      </div>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full h-12 pl-12 pr-12 bg-[var(--color-surface)] border border-white/10 rounded-none font-sans text-sm text-[var(--color-sand-light)] placeholder-[var(--color-charcoal-light)]/40 focus:outline-none focus:border-[var(--color-terracotta)]/40 transition-colors"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-4 flex items-center text-[var(--color-charcoal-light)]/60 hover:text-[var(--color-sand-light)] transition-colors"
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
