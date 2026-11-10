"use client";

import { useState } from "react";
import {
  Mail,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileText,
  Clock,
  Building2,
  Check,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface InvoiceDemo {
  id: string;
  tabLabel: string;
  brand: string;
  category: string;
  invoiceNumber: string;
  date: string;
  items: { name: string; qty: string; price: string }[];
  subtotal: string;
  vat: string;
  total: string;
  accountingDest: string;
  timeSaved: string;
}

const INVOICE_DEMOS: InvoiceDemo[] = [
  {
    id: "keune",
    tabLabel: "Keune",
    brand: "Keune Haircosmetics",
    category: "Haarverf & Verzorging",
    invoiceNumber: "INV-2026-99301",
    date: "Vandaag, 14:18",
    items: [
      { name: "Tinta Color 60ml (Assorted 5.1, 7.2)", qty: "24 st.", price: "€ 228,00" },
      { name: "Care Vital Nutrition Shampoo 1000ml", qty: "6 st.", price: "€ 114,00" },
      { name: "Cream Bleach Blonde Freedom 500g", qty: "2 st.", price: "€ 81,80" },
    ],
    subtotal: "€ 423,80",
    vat: "€ 89,00 (21%)",
    total: "€ 512,80",
    accountingDest: "Moneybird • Inkoopfacturen",
    timeSaved: "6 min bespaard",
  },
  {
    id: "davines",
    tabLabel: "Davines",
    brand: "Davines Nederland",
    category: "Duurzame Salonlijn",
    invoiceNumber: "DAV-88412",
    date: "Gisteren, 11:05",
    items: [
      { name: "OI All In One Milk 135ml Salon Pack", qty: "12 st.", price: "€ 168,00" },
      { name: "Heart of Glass Silkening Shampoo", qty: "6 st.", price: "€ 120,00" },
    ],
    subtotal: "€ 288,00",
    vat: "€ 60,50 (21%)",
    total: "€ 348,50",
    accountingDest: "Exact Online • Inkoopboeking",
    timeSaved: "5 min bespaard",
  },
  {
    id: "loreal",
    tabLabel: "L'Oréal",
    brand: "L'Oréal Professionnel",
    category: "Permanent & Styling",
    invoiceNumber: "LOR-NL-44021",
    date: "3 nov 2026",
    items: [
      { name: "Majirel Cool Inforced Verf 50ml", qty: "18 st.", price: "€ 153,00" },
      { name: "Dia Richesse Demi-Permanent 50ml", qty: "10 st.", price: "€ 82,50" },
    ],
    subtotal: "€ 235,50",
    vat: "€ 49,45 (21%)",
    total: "€ 284,95",
    accountingDest: "e-Boekhouden • Inkoopfactuur",
    timeSaved: "5 min bespaard",
  },
];

export function HeroInvoiceFlow() {
  const [selectedId, setSelectedId] = useState("keune");
  const current = INVOICE_DEMOS.find((d) => d.id === selectedId) || INVOICE_DEMOS[0];

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Interactive Brand Selector Tabs */}
      <div className="flex items-center justify-center gap-2 mb-4 overflow-x-auto pb-1">
        <span className="text-xs uppercase tracking-widest text-stone-400 font-medium mr-2 hidden sm:inline">
          Kies leverancier:
        </span>
        {INVOICE_DEMOS.map((demo) => {
          const isActive = demo.id === selectedId;
          return (
            <button
              key={demo.id}
              onClick={() => setSelectedId(demo.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                isActive
                  ? "bg-kami-600 text-white border-kami-600 shadow-sm"
                  : "bg-white/80 hover:bg-stone-50 text-stone-600 border-sand-300/80"
              }`}
            >
              {demo.tabLabel}
            </button>
          );
        })}
      </div>

      {/* Main Tactile Salon Invoice Card */}
      <div className="relative bg-white/95 rounded-3xl border border-sand-200/90 shadow-zen p-6 sm:p-8 backdrop-blur overflow-hidden">
        {/* Subtle Decorative Paper Background Grid */}
        <div className="absolute inset-0 bg-paper-grid opacity-30 pointer-events-none" />

        {/* Top Status & Context Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-sand-200/80">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs sm:text-sm font-medium text-stone-700">
              Live herkenning • <span className="font-serif italic font-normal text-kami-700">Haarstudio Puur, Utrecht</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="neutral" className="bg-sand-50/80 border-sand-300 text-stone-600 text-[11px] font-normal">
              <Clock className="w-3 h-3 mr-1 text-kami-600" />
              {current.timeSaved}
            </Badge>
            <Badge variant="success" className="text-[11px]">
              <Check className="w-3 h-3 mr-1" />
              100% handsfree
            </Badge>
          </div>
        </div>

        {/* Three-Phase Quiet Flow Visualizer */}
        <div className="relative z-10 my-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
          {/* Phase 1: Inkomende E-mail */}
          <div className="p-4 rounded-2xl bg-sand-50/70 border border-sand-200/70 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-stone-500 mb-2">
                <span className="inline-flex items-center gap-1.5 text-stone-600">
                  <Mail className="w-3.5 h-3.5 text-kami-600" />
                  1. E-mail ontvangen
                </span>
                <span className="text-[10px] font-normal text-stone-400">{current.date}</span>
              </div>
              <p className="text-sm font-semibold text-stone-900 truncate">
                {current.brand}
              </p>
              <p className="text-xs text-stone-500 truncate mt-0.5">
                Onderwerp: {current.invoiceNumber}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-sand-200/60 flex items-center justify-between text-xs text-stone-600">
              <span className="inline-flex items-center gap-1 text-[11px] text-stone-400">
                <FileText className="w-3 h-3 text-kami-600" />
                Bijlage: .PDF
              </span>
              <span className="font-semibold text-stone-800">{current.total}</span>
            </div>
          </div>

          {/* Phase 2: KamiFlow Engine (Quiet Wabi-Sabi matching) */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-kami-50/80 to-sand-50/60 border border-kami-200/80 flex flex-col justify-between text-center relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-kami-200/30 rounded-full blur-xl pointer-events-none" />

            <div>
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-kami-600 text-white mb-2 shadow-sm">
                <Sparkles className="w-4 h-4 text-kami-100" />
              </div>
              <p className="text-xs font-semibold text-kami-900">
                KamiFlow Zen Matching
              </p>
              <p className="text-[11px] text-kami-700 mt-1 leading-snug">
                Inkoopfactuur direct herkend (99.8% zekerheid)
              </p>
            </div>

            <div className="mt-3">
              <div className="text-[10px] tracking-wide text-kami-800 font-medium bg-white/90 py-1 px-2.5 rounded-lg border border-kami-200 shadow-subtle">
                Geruisloos doorgestuurd
              </div>
            </div>
          </div>

          {/* Phase 3: Boekhoudpakket (Moneybird / Exact / e-Boekhouden) */}
          <div className="p-4 rounded-2xl bg-sand-50/70 border border-sand-200/70 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-stone-500 mb-2">
                <span className="inline-flex items-center gap-1.5 text-stone-600">
                  <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                  3. In Boekhouding
                </span>
                <span className="text-[10px] text-emerald-600 font-medium">Klaar</span>
              </div>
              <p className="text-sm font-semibold text-stone-900 truncate">
                {current.accountingDest}
              </p>
              <p className="text-xs text-stone-500 truncate mt-0.5">
                Klaargezet voor kwartaalaangifte
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-sand-200/60 text-[11px] text-emerald-700 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>0 seconden handmatig werk</span>
            </div>
          </div>
        </div>

        {/* Detailed Tangible Salon Invoice Sheet */}
        <div className="relative z-10 mt-5 pt-5 border-t border-sand-200/80 bg-sand-50/40 rounded-2xl p-4 sm:p-5 border border-sand-200/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-sand-200/60 text-xs">
            <div>
              <span className="font-serif text-base font-medium text-stone-900">
                {current.category}
              </span>
              <span className="ml-2 text-stone-400 font-mono text-[11px]">
                {current.invoiceNumber}
              </span>
            </div>
            <div className="text-stone-500 text-[11px]">
              Leverancier: <span className="text-stone-800 font-medium">{current.tabLabel}</span>
            </div>
          </div>

          {/* Invoice Line Items */}
          <div className="py-3 space-y-1.5 text-xs text-stone-600">
            {current.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-[12px]">
                <span className="truncate pr-4 text-stone-700">
                  <span className="text-stone-400 mr-2 font-mono">{item.qty}</span>
                  {item.name}
                </span>
                <span className="font-mono text-stone-800 font-medium shrink-0">
                  {item.price}
                </span>
              </div>
            ))}
          </div>

          {/* Total & Verification Seal */}
          <div className="pt-3 border-t border-sand-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            {/* Zen Verification Stamp / Zegel */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs shadow-subtle">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-medium tracking-wide">
                Geverifieerd &amp; Ingeboekt in {current.accountingDest.split(" •")[0]}
              </span>
            </div>

            <div className="flex items-baseline gap-3 text-xs sm:self-auto self-end">
              <span className="text-stone-400 text-[11px]">BTW: {current.vat}</span>
              <span className="text-xs text-stone-500 font-medium">Totaal:</span>
              <span className="font-serif text-lg font-medium text-stone-900">
                {current.total}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="relative z-10 mt-4 flex items-center justify-between text-xs text-stone-500 pt-2">
          <span className="inline-flex items-center gap-1.5 text-stone-400 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-kami-600" />
            Veilig versleuteld via TLS 1.3 &amp; OAuth 2.0
          </span>
          <span className="text-kami-700 font-medium text-xs hover:text-kami-800 transition-colors cursor-pointer inline-flex items-center gap-1">
            Bekijk hoe de koppeling werkt <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  );
}
