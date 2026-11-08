import { describe, it, expect } from "vitest";
import { cn, formatDate, formatTime, formatCurrency } from "@/lib/utils";

describe("lib/utils", () => {
  it("combines and merges tailwind class names properly", () => {
    expect(cn("px-2 py-1", "bg-red-500", false && "hidden")).toBe("px-2 py-1 bg-red-500");
    // tailwind-merge override test
    expect(cn("px-2 text-stone-500", "px-4 text-stone-900")).toBe("px-4 text-stone-900");
  });

  it("formats date in Dutch format", () => {
    const formatted = formatDate("2026-11-08T09:14:00Z");
    expect(formatted).toMatch(/8.*nov/i);
  });

  it("formats time in Dutch format", () => {
    const formatted = formatTime("2026-11-08T09:14:00Z");
    expect(formatted).toMatch(/\d{1,2}:\d{2}/);
  });

  it("formats currency in EUR format", () => {
    const formatted = formatCurrency(348.5);
    expect(formatted).toContain("348,50");
    expect(formatted).toContain("€");
  });
});
