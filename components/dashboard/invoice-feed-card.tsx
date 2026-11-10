"use client";

import * as React from "react";
import {
  Check,
  CheckCheck,
  AlertCircle,
  Paperclip,
  ArrowUpRight,
  Sparkles,
  Tag,
  Calendar,
  FileCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InvoiceEmail } from "@/lib/types";
import { formatDate, formatCurrency } from "@/lib/utils";

interface InvoiceFeedCardProps {
  invoice: InvoiceEmail;
  onOpenDetails: (invoice: InvoiceEmail) => void;
  onMarkInvoice: (invoice: InvoiceEmail) => void;
}

export function InvoiceFeedCard({
  invoice,
  onOpenDetails,
  onMarkInvoice,
}: InvoiceFeedCardProps) {
  const getSupplierInitials = (name: string) => {
    if (name.includes("Salon Ambience")) return "SA";
    if (name.includes("Davines")) return "DV";
    if (name.includes("Keune")) return "KH";
    if (name.includes("Nespresso")) return "NP";
    if (name.includes("Zettle")) return "ZT";
    if (name.includes("L'Oréal")) return "LO";
    return name.slice(0, 2).toUpperCase();
  };

  const isMissed = invoice.status === "missed";

  return (
    <div
      className={`relative rounded-3xl p-5 sm:p-6 transition-all duration-200 border ${
        isMissed
          ? "bg-gradient-to-br from-amber-50/50 via-white to-amber-50/20 border-amber-200 shadow-zen"
          : "bg-white hover:bg-sand-50/40 border-stone-200/80 shadow-subtle hover:shadow-zen"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* LEFT: Monogram + Supplier Info */}
        <div className="flex items-start gap-3.5">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center font-serif text-sm font-semibold shrink-0 border ${
              isMissed
                ? "bg-amber-100/90 text-amber-900 border-amber-300"
                : "bg-sand-100 text-stone-800 border-sand-200"
            }`}
          >
            {getSupplierInitials(invoice.sender)}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-medium text-stone-900 text-base">
                {invoice.sender}
              </h3>
              {invoice.category && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-sand-100 text-stone-600 text-[11px] font-medium border border-sand-200/60">
                  <Tag className="w-3 h-3 text-stone-400" />
                  {invoice.category}
                </span>
              )}
            </div>
            <p className="text-xs text-stone-400 mt-0.5">{invoice.senderEmail}</p>
          </div>
        </div>

        {/* RIGHT: Status Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {invoice.status === "forwarded" && (
            <Badge variant="success" className="px-3 py-1 text-xs">
              <Check className="w-3 h-3 mr-1" />
              Doorgestuurd
            </Badge>
          )}
          {invoice.status === "manual_confirmed" && (
            <Badge variant="info" className="px-3 py-1 text-xs">
              <CheckCheck className="w-3 h-3 text-kami-700 mr-1" />
              Handmatig gemarkeerd
            </Badge>
          )}
          {invoice.status === "missed" && (
            <Badge variant="warning" className="px-3 py-1 text-xs">
              <AlertCircle className="w-3 h-3 text-amber-600 mr-1" />
              Niet herkend
            </Badge>
          )}
        </div>
      </div>

      {/* BODY: Subject & Snippet */}
      <div className="mt-4 pt-3.5 border-t border-stone-100">
        <p className="text-sm font-medium text-stone-800 line-clamp-1">
          {invoice.subject}
        </p>
        <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
          {invoice.snippet}
        </p>

        {invoice.attachmentName && (
          <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sand-50 border border-sand-200/70 text-xs text-stone-700">
            <Paperclip className="w-3.5 h-3.5 text-kami-600" />
            <span className="font-mono text-[11px] truncate max-w-xs">
              {invoice.attachmentName}
            </span>
          </div>
        )}
      </div>

      {/* FOOTER: Amount, Confidence & Action */}
      <div className="mt-5 pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-6 text-xs text-stone-500">
          <div>
            <span className="text-[11px] text-stone-400 block uppercase tracking-wider font-medium">
              Factuurbedrag
            </span>
            <span className="text-base font-semibold text-stone-900">
              {invoice.amount ? formatCurrency(invoice.amount) : "—"}
            </span>
            {invoice.invoiceNumber && (
              <span className="text-[11px] font-mono text-stone-400 ml-1.5">
                ({invoice.invoiceNumber})
              </span>
            )}
          </div>

          <div className="border-l border-stone-200 pl-6">
            <span className="text-[11px] text-stone-400 block uppercase tracking-wider font-medium">
              Ontvangen
            </span>
            <span className="text-xs text-stone-700 font-medium">
              {formatDate(invoice.receivedAt)}
            </span>
          </div>

          <div className="hidden md:block border-l border-stone-200 pl-6">
            <span className="text-[11px] text-stone-400 block uppercase tracking-wider font-medium">
              Zen Zekerheid
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-stone-700">
              <Sparkles className="w-3 h-3 text-kami-600" />
              {invoice.confidenceScore}%
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenDetails(invoice)}
            className="text-xs text-stone-600 hover:text-stone-900 hover:bg-sand-100"
          >
            Details
          </Button>

          {isMissed ? (
            <Button
              size="sm"
              onClick={() => onMarkInvoice(invoice)}
              className="bg-amber-600 hover:bg-amber-700 text-white shadow-subtle text-xs"
            >
              Markeer als factuur
            </Button>
          ) : (
            <span className="text-xs text-stone-500 bg-sand-100 px-3 py-1.5 rounded-xl border border-sand-200/60 font-medium">
              {invoice.accountingTarget || "Moneybird (Inkoop)"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
