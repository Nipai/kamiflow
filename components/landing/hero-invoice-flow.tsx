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
  Paperclip,
  FileCheck2,
  Send,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FlowDemo {
  id: string;
  tabLabel: string;
  brand: string;
  category: string;
  date: string;
  emailSubject: string;
  emailSnippet: string;
  hasPdfOriginal: boolean;
  pdfFileName: string;
  pdfHandlingNote: string;
  mlConfidence: number;
  mlMatchDetails: string;
  uploadEmailDest: string;
  accountingSoftware: string;
  timeSaved: string;
}

const FLOW_DEMOS: FlowDemo[] = [
  {
    id: "keune",
    tabLabel: "Keune (PDF Bijlage)",
    brand: "Keune Haircosmetics",
    category: "Haarverf & Verzorging",
    date: "Vandaag, 14:18",
    emailSubject: "Verzendbevestiging & Factuur #99301 Tinta Color",
    emailSnippet: "Hartelijk dank voor je bestelling van Tinta Color verf en verzorgingsproducten. De factuur is bijgevoegd als PDF.",
    hasPdfOriginal: true,
    pdfFileName: "Keune_Factuur_99301.pdf",
    pdfHandlingNote: "Originele PDF bijlage gedetecteerd",
    mlConfidence: 98,
    mlMatchDetails: "ML herkent factuurkenmerken in onderwerp & e-mail body",
    uploadEmailDest: "haarstudiopuur@moneybird.com",
    accountingSoftware: "Moneybird",
    timeSaved: "6 min bespaard",
  },
  {
    id: "nespresso",
    tabLabel: "Nespresso (Geen PDF in mail)",
    brand: "Nespresso Professional",
    category: "Hospitality & Salonkoffie",
    date: "Gisteren, 11:05",
    emailSubject: "Bevestiging levering koffiebonen & melkcups - Salon Puur",
    emailSnippet: "Geachte klant, hartelijk dank voor uw bestelling. Uw besteloverzicht en betalingsspecificatie staan hieronder in deze mail vermeld.",
    hasPdfOriginal: false,
    pdfFileName: "Nespresso_Bestelling_SalonPuur.pdf",
    pdfHandlingNote: "Geen PDF in mail → KamiFlow zet HTML-mail automatisch om naar PDF",
    mlConfidence: 94,
    mlMatchDetails: "LLM detecteert salon inkoopbon in HTML body zonder bijlage",
    uploadEmailDest: "haarstudiopuur@moneybird.com",
    accountingSoftware: "Moneybird",
    timeSaved: "10 min bespaard (nooit meer printen naar PDF)",
  },
  {
    id: "davines",
    tabLabel: "Davines (PDF Bijlage)",
    brand: "Davines Nederland",
    category: "Duurzame Salonlijn",
    date: "3 nov 2026",
    emailSubject: "Factuur 2026-8812 - Oi Shampoo & Conditioner",
    emailSnippet: "Beste Emma, hierbij ontvang je de factuur behorende bij bestelling #8812. De PDF is als bijlage toegevoegd.",
    hasPdfOriginal: true,
    pdfFileName: "Factuur_DAV-2026-8812.pdf",
    pdfHandlingNote: "Originele PDF bijlage gedetecteerd",
    mlConfidence: 99,
    mlMatchDetails: "ML matching op afzender, onderwerp en PDF-factuurstructuur",
    uploadEmailDest: "inkoop@exactonline.nl",
    accountingSoftware: "Exact Online",
    timeSaved: "5 min bespaard",
  },
];

export function HeroInvoiceFlow() {
  const [selectedId, setSelectedId] = useState("keune");
  const current = FLOW_DEMOS.find((d) => d.id === selectedId) || FLOW_DEMOS[0];

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Interactive Brand Selector Tabs */}
      <div className="flex items-center justify-center gap-2 mb-4 overflow-x-auto pb-1">
        <span className="text-xs uppercase tracking-widest text-stone-400 font-medium mr-2 hidden sm:inline">
          Kies praktijksituatie:
        </span>
        {FLOW_DEMOS.map((demo) => {
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
              Automatische periodieke check • <span className="font-serif italic font-normal text-kami-700">Haarstudio Puur, Utrecht</span>
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
          {/* Phase 1: Inkomende E-mail & ML Check */}
          <div className="p-4 rounded-2xl bg-sand-50/70 border border-sand-200/70 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-stone-500 mb-2">
                <span className="inline-flex items-center gap-1.5 text-stone-600">
                  <Mail className="w-3.5 h-3.5 text-kami-600" />
                  1. Mailbox Check
                </span>
                <span className="text-[10px] font-normal text-stone-400">{current.date}</span>
              </div>
              <p className="text-sm font-semibold text-stone-900 truncate">
                {current.brand}
              </p>
              <p className="text-xs text-stone-500 line-clamp-2 mt-0.5">
                {current.emailSubject}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-sand-200/60 flex items-center justify-between text-xs text-stone-600">
              <span className="inline-flex items-center gap-1 text-[11px] text-stone-500">
                <Sparkles className="w-3 h-3 text-kami-600" />
                ML/LLM Herkenning
              </span>
              <span className="font-semibold text-kami-700">{current.mlConfidence}% match</span>
            </div>
          </div>

          {/* Phase 2: Slimme PDF Conversie / Doorvoer */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-kami-50/80 to-sand-50/60 border border-kami-200/80 flex flex-col justify-between text-center relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-kami-200/30 rounded-full blur-xl pointer-events-none" />

            <div>
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-kami-600 text-white mb-2 shadow-sm">
                <FileText className="w-4 h-4 text-kami-100" />
              </div>
              <p className="text-xs font-semibold text-kami-900">
                2. Slimme PDF-Handling
              </p>
              <p className="text-[11px] text-kami-800 mt-1 leading-snug">
                {current.hasPdfOriginal
                  ? "Originele PDF bijlage direct geselecteerd"
                  : "HTML e-mail automatisch omgezet naar PDF!"}
              </p>
            </div>

            <div className="mt-3">
              <div className="text-[10px] tracking-wide text-kami-900 font-medium bg-white/90 py-1 px-2.5 rounded-lg border border-kami-200 shadow-subtle truncate">
                {current.pdfFileName}
              </div>
            </div>
          </div>

          {/* Phase 3: Boekhouding Upload-Mail */}
          <div className="p-4 rounded-2xl bg-sand-50/70 border border-sand-200/70 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-stone-500 mb-2">
                <span className="inline-flex items-center gap-1.5 text-stone-600">
                  <Send className="w-3.5 h-3.5 text-emerald-600" />
                  3. Upload E-mail
                </span>
                <span className="text-[10px] text-emerald-600 font-medium">Verzonden</span>
              </div>
              <p className="text-sm font-semibold text-stone-900 truncate">
                {current.accountingSoftware}
              </p>
              <p className="text-xs text-stone-500 font-mono truncate mt-0.5">
                {current.uploadEmailDest}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-sand-200/60 text-[11px] text-emerald-700 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Ingelezen door boekhouding</span>
            </div>
          </div>
        </div>

        {/* Tangible Email Preview & Handling Details */}
        <div className="relative z-10 mt-5 pt-5 border-t border-sand-200/80 bg-sand-50/40 rounded-2xl p-4 sm:p-5 border border-sand-200/60 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-sand-200/60 text-xs">
            <div>
              <span className="font-serif text-base font-medium text-stone-900">
                {current.brand}
              </span>
              <span className="ml-2 text-stone-400 font-sans text-xs">
                ({current.category})
              </span>
            </div>
            <div className="text-stone-500 text-[11px]">
              Onderwerp: <span className="text-stone-800 font-medium">&ldquo;{current.emailSubject}&rdquo;</span>
            </div>
          </div>

          {/* Email Snippet */}
          <div className="text-xs text-stone-600 bg-white/70 p-3 rounded-xl border border-sand-200/70 leading-relaxed italic">
            &ldquo;{current.emailSnippet}&rdquo;
          </div>

          {/* PDF Status & Accounting Destination */}
          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            {/* Tag whether it was converted or original */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 shadow-subtle">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="font-medium tracking-wide">
                {current.hasPdfOriginal
                  ? `PDF Bijlage doorgestuurd naar ${current.uploadEmailDest}`
                  : `HTML E-mail omgezet naar PDF & doorgestuurd naar ${current.uploadEmailDest}`}
              </span>
            </div>

            <div className="text-stone-500 text-[11px]">
              {current.mlMatchDetails}
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="relative z-10 mt-4 flex items-center justify-between text-xs text-stone-500 pt-2">
          <span className="inline-flex items-center gap-1.5 text-stone-400 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-kami-600" />
            Geen ingewikkelde API-koppeling nodig • Werkt via de upload-mail van je boekhoudsoftware
          </span>
          <span className="text-kami-700 font-medium text-xs hover:text-kami-800 transition-colors cursor-pointer inline-flex items-center gap-1">
            Bekijk hoe het werkt <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  );
}
