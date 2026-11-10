"use client";

import * as React from "react";
import { CheckCheck, Sparkles, Search, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ZenEmptyStateProps {
  isMissedFilter: boolean;
  searchQuery: string;
  onResetFilter: () => void;
  onResetSearch: () => void;
  accountingSoftware?: string;
}

export function ZenEmptyState({
  isMissedFilter,
  searchQuery,
  onResetFilter,
  onResetSearch,
  accountingSoftware = "Moneybird",
}: ZenEmptyStateProps) {
  if (searchQuery.trim()) {
    return (
      <div className="py-16 px-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-sand-100 flex items-center justify-center text-stone-500 mx-auto mb-3">
          <Search className="w-5 h-5" />
        </div>
        <h3 className="font-serif text-lg text-stone-800 font-medium">
          Geen e-mails gevonden
        </h3>
        <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
          Er zijn geen facturen of e-mails gevonden voor de zoekterm &ldquo;{searchQuery}&rdquo;.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={onResetSearch}
          className="mt-4 text-xs"
        >
          Zoekopdracht wissen
        </Button>
      </div>
    );
  }

  if (isMissedFilter) {
    return (
      <div className="py-16 px-6 text-center bg-gradient-to-b from-kami-50/40 to-sand-50/20 rounded-3xl border border-kami-100/80 my-4">
        <div className="relative inline-block mb-4">
          <div className="w-16 h-16 rounded-3xl bg-white shadow-zen border border-kami-200/80 flex items-center justify-center text-kami-700 mx-auto">
            <Coffee className="w-7 h-7 text-kami-700 animate-pulse" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white">
            <CheckCheck className="w-3.5 h-3.5" />
          </div>
        </div>

        <h3 className="font-serif text-xl sm:text-2xl text-stone-900 font-normal tracking-tight">
          Totale rust — Geen openstaande facturen
        </h3>
        <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-md mx-auto leading-relaxed">
          Alle salonfacturen zijn geruisloos verwerkt en direct doorgestuurd naar {accountingSoftware}. Tijd voor een kop koffie of je volgende klant.
        </p>

        <div className="mt-5 flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onResetFilter}
            className="text-xs bg-white hover:bg-sand-50"
          >
            Bekijk alle e-mails
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 px-6 text-center">
      <div className="w-12 h-12 rounded-2xl bg-sand-100 flex items-center justify-center text-stone-400 mx-auto mb-3">
        <Sparkles className="w-5 h-5" />
      </div>
      <h3 className="font-serif text-lg text-stone-800 font-medium">
        Geen e-mails gevonden voor deze selectie.
      </h3>
      <p className="text-xs text-stone-500 mt-1">
        Schakel tussen de tabbladen om andere facturen te bekijken.
      </p>
    </div>
  );
}
