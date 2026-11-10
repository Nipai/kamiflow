"use client";

import * as React from "react";
import { Sparkles, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ZenBarometerProps {
  missedCount: number;
  forwardedCount: number;
  onFilterMissed: () => void;
  accountingSoftware?: string;
}

export function ZenBarometer({
  missedCount,
  forwardedCount,
  onFilterMissed,
  accountingSoftware = "Moneybird",
}: ZenBarometerProps) {
  if (missedCount === 0) {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sand-100/90 via-sand-50/70 to-kami-50/80 border border-sand-200/90 p-5 sm:p-6 shadow-zen transition-all duration-300">
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-kami-200/20 blur-3xl pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/90 border border-sand-200 flex items-center justify-center text-kami-700 shadow-subtle shrink-0">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg sm:text-xl font-normal text-stone-900 tracking-tight">
                  Alles is rustig in de salon
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100/80 text-emerald-800 border border-emerald-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  100% Zen Matching
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 mt-0.5 leading-relaxed">
                Alle facturen van deze maand stromen geruisloos door naar{" "}
                <strong className="font-semibold text-stone-800">{accountingSoftware}</strong>. Geen gemiste documenten of openstaande taken.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-500 bg-white/70 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-sand-200/70 shrink-0 self-stretch sm:self-auto justify-center">
            <ShieldCheck className="w-4 h-4 text-kami-600" />
            <span>Volgende auto-sync over 3 min.</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-50/90 via-sand-50/80 to-amber-100/50 border border-amber-200/90 p-5 sm:p-6 shadow-zen transition-all duration-300">
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-amber-200/30 blur-3xl pointer-events-none" />
      <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/90 border border-amber-200 flex items-center justify-center text-amber-700 shadow-subtle shrink-0">
            <AlertCircle className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg sm:text-xl font-normal text-stone-900 tracking-tight">
                {missedCount} {missedCount === 1 ? "e-mail vraagt" : "e-mails vragen"} om een snelle blik
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-100 text-amber-900 border border-amber-300/60">
                Aandacht vereist
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 mt-0.5 leading-relaxed">
              De overige {forwardedCount} facturen zijn direct doorgestuurd naar {accountingSoftware}. Een korte bevestiging helpt KamiFlow deze leverancier voortaan blindelings te herkennen.
            </p>
          </div>
        </div>

        <Button
          onClick={onFilterMissed}
          size="sm"
          className="bg-amber-600 hover:bg-amber-700 text-white shadow-soft text-xs shrink-0 self-stretch sm:self-auto"
        >
          <span>Bekijk {missedCount === 1 ? "e-mail" : "e-mails"}</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      </div>
    </div>
  );
}
