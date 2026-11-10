"use client";

import * as React from "react";
import {
  FileText,
  Clock,
  Mail,
  AlertCircle,
  Search,
  CheckCircle2,
  ArrowUpRight,
  Filter,
  Check,
  Paperclip,
  CheckCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { mockInvoices, mockDashboardStats } from "@/lib/mock-data";
import { InvoiceEmail, InvoiceStatus } from "@/lib/types";
import { formatDate, formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const [invoices, setInvoices] = React.useState<InvoiceEmail[]>(mockInvoices);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedFilter, setSelectedFilter] = React.useState<"all" | "missed" | "forwarded">("all");
  
  // Modal state for marking a missed email
  const [selectedForReview, setSelectedForReview] = React.useState<InvoiceEmail | null>(null);
  const [targetAccounting, setTargetAccounting] = React.useState("Moneybird (Inkoop)");
  const [rememberSender, setRememberSender] = React.useState(true);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  // Compute live stats based on state
  const missedCount = invoices.filter((inv) => inv.status === "missed").length;
  const forwardedCount = invoices.filter(
    (inv) => inv.status === "forwarded" || inv.status === "manual_confirmed"
  ).length;

  // Filtered invoices
  const filteredInvoices = invoices.filter((inv) => {
    // Filter by tab
    if (selectedFilter === "missed" && inv.status !== "missed") return false;
    if (selectedFilter === "forwarded" && inv.status !== "forwarded" && inv.status !== "manual_confirmed") {
      return false;
    }

    // Filter by search
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      inv.sender.toLowerCase().includes(q) ||
      inv.subject.toLowerCase().includes(q) ||
      (inv.invoiceNumber && inv.invoiceNumber.toLowerCase().includes(q)) ||
      (inv.category && inv.category.toLowerCase().includes(q))
    );
  });

  const handleOpenMarkModal = (invoice: InvoiceEmail) => {
    setSelectedForReview(invoice);
  };

  const handleConfirmMarkAsInvoice = () => {
    if (!selectedForReview) return;

    setInvoices((prev) =>
      prev.map((item) =>
        item.id === selectedForReview.id
          ? {
              ...item,
              status: "manual_confirmed" as InvoiceStatus,
              accountingTarget: targetAccounting,
            }
          : item
      )
    );

    const sender = selectedForReview.sender;
    setSelectedForReview(null);
    setToastMessage(`"${sender}" is gemarkeerd als factuur en doorgestuurd naar ${targetAccounting}!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-light text-stone-900 tracking-tight">
            Overzicht &amp; Factuur Inbox
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Realtime monitoring van inkomende e-mails en automatische boekhoudkoppelingen.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="info" className="px-3 py-1.5 text-xs font-normal">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
            2 mailboxen actief gemonitord
          </Badge>
        </div>
      </div>

      {/* TOAST SUCCESS NOTIFICATION */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between text-sm animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCheck className="w-5 h-5 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-xs text-emerald-700 hover:underline"
          >
            Sluiten
          </button>
        </div>
      )}

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Doorgestuurd */}
        <Card className="hover:border-kami-300/80 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-stone-500">
                Doorgestuurd deze maand
              </span>
              <div className="w-8 h-8 rounded-xl bg-kami-100 flex items-center justify-center text-kami-700">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-semibold text-stone-900">
                {forwardedCount + 24}
              </span>
              <span className="text-xs text-stone-400 ml-1.5">facturen</span>
            </div>
            <p className="mt-1 text-xs text-stone-500">
              Totaal bedrag: <span className="font-medium text-stone-700">€ 3.840,90</span>
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Bespaarde Tijd */}
        <Card className="hover:border-kami-300/80 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-stone-500">
                Bespaarde administratietijd
              </span>
              <div className="w-8 h-8 rounded-xl bg-kami-100 flex items-center justify-center text-kami-700">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-semibold text-stone-900">
                ~{mockDashboardStats.hoursSaved}
              </span>
              <span className="text-xs text-stone-400 ml-1.5">uur</span>
            </div>
            <p className="mt-1 text-xs text-emerald-600 font-medium">
              Vrijgekomen voor salonklanten
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Mailboxen */}
        <Card className="hover:border-kami-300/80 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-stone-500">
                Gekoppelde mailboxen
              </span>
              <div className="w-8 h-8 rounded-xl bg-stone-100 flex items-center justify-center text-stone-600">
                <Mail className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-semibold text-stone-900">
                {mockDashboardStats.connectedMailboxes}
              </span>
              <span className="text-xs text-stone-400 ml-1.5">verbonden</span>
            </div>
            <p className="mt-1 text-xs text-stone-500">
              Gmail &amp; Outlook 365
            </p>
          </CardContent>
        </Card>

        {/* Card 4: Aandacht Vereist (Gemiste items) */}
        <Card
          onClick={() => setSelectedFilter("missed")}
          className={`cursor-pointer transition-all ${
            missedCount > 0
              ? "border-amber-300/90 bg-amber-50/20 hover:bg-amber-50/40"
              : "hover:border-stone-300"
          }`}
        >
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-stone-500">
                Aandacht vereist (Gemist)
              </span>
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  missedCount > 0
                    ? "bg-amber-100 text-amber-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                <AlertCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-semibold text-stone-900">
                {missedCount}
              </span>
              <span className="text-xs text-stone-400 ml-1.5">
                {missedCount === 1 ? "e-mail" : "e-mails"}
              </span>
            </div>
            <p className="mt-1 text-xs text-amber-700 font-medium">
              {missedCount > 0 ? "Klik om te controleren" : "Alles is bijgewerkt!"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* INBOX TABLE SECTION */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-soft overflow-hidden">
        {/* Table Controls Header */}
        <div className="p-5 sm:p-6 border-b border-stone-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Tab Filter Buttons */}
          <div className="flex items-center gap-1.5 bg-stone-100/70 p-1 rounded-xl self-start">
            <button
              onClick={() => setSelectedFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                selectedFilter === "all"
                  ? "bg-white text-stone-900 shadow-subtle"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Alle e-mails ({invoices.length})
            </button>
            <button
              onClick={() => setSelectedFilter("missed")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                selectedFilter === "missed"
                  ? "bg-white text-stone-900 shadow-subtle"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <span>Aandacht vereist</span>
              {missedCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-200 text-amber-900 font-semibold">
                  {missedCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setSelectedFilter("forwarded")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                selectedFilter === "forwarded"
                  ? "bg-white text-stone-900 shadow-subtle"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Doorgestuurd ({forwardedCount})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Zoek op leverancier of nummer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kami-500/20 focus:border-kami-600 transition"
            />
          </div>
        </div>

        {/* The Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm" role="table">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/50 text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Leverancier</th>
                <th className="py-3.5 px-6">Onderwerp &amp; Bijlage</th>
                <th className="py-3.5 px-6">Categorie</th>
                <th className="py-3.5 px-6">Bedrag</th>
                <th className="py-3.5 px-6">Datum</th>
                <th className="py-3.5 px-6 text-right">Actie</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400 text-sm">
                    Geen e-mails gevonden voor deze selectie.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className={`hover:bg-stone-50/80 transition-colors ${
                      inv.status === "missed" ? "bg-amber-50/30" : ""
                    }`}
                  >
                    {/* Status Badge */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      {inv.status === "forwarded" && (
                        <Badge variant="success">
                          <Check className="w-3 h-3" />
                          Doorgestuurd
                        </Badge>
                      )}
                      {inv.status === "manual_confirmed" && (
                        <Badge variant="info">
                          <CheckCheck className="w-3 h-3 text-kami-700" />
                          Handmatig gemarkeerd
                        </Badge>
                      )}
                      {inv.status === "missed" && (
                        <Badge variant="warning">
                          <AlertCircle className="w-3 h-3 text-amber-600" />
                          Niet herkend
                        </Badge>
                      )}
                      {inv.status === "pending" && (
                        <Badge variant="neutral">In verwerking</Badge>
                      )}
                    </td>

                    {/* Sender */}
                    <td className="py-4 px-6">
                      <div className="font-medium text-stone-900 truncate max-w-[180px]">
                        {inv.sender}
                      </div>
                      <div className="text-xs text-stone-400 truncate max-w-[180px]">
                        {inv.senderEmail}
                      </div>
                    </td>

                    {/* Subject & Attachment */}
                    <td className="py-4 px-6 max-w-xs">
                      <div className="font-medium text-stone-800 truncate" title={inv.subject}>
                        {inv.subject}
                      </div>
                      {inv.attachmentName && (
                        <div className="flex items-center gap-1 text-[11px] text-stone-500 mt-1">
                          <Paperclip className="w-3 h-3 text-stone-400" />
                          <span className="truncate max-w-[200px]">{inv.attachmentName}</span>
                        </div>
                      )}
                    </td>

                    {/* Category */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="inline-block px-2.5 py-0.5 rounded-lg bg-stone-100 text-stone-600 text-xs font-normal">
                        {inv.category || "Algemeen"}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="font-medium text-stone-900">
                        {inv.amount ? formatCurrency(inv.amount) : "—"}
                      </span>
                      {inv.invoiceNumber && (
                        <div className="text-[11px] text-stone-400 font-mono">
                          {inv.invoiceNumber}
                        </div>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 whitespace-nowrap text-xs text-stone-500">
                      {formatDate(inv.receivedAt)}
                    </td>

                    {/* Action */}
                    <td className="py-4 px-6 whitespace-nowrap text-right">
                      {inv.status === "missed" ? (
                        <Button
                          size="sm"
                          onClick={() => handleOpenMarkModal(inv)}
                          className="bg-amber-600 hover:bg-amber-700 text-white shadow-subtle text-xs"
                        >
                          Markeer als factuur
                        </Button>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-stone-400 font-medium">
                          {inv.accountingTarget || "Gekoppeld"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info in Table */}
        <div className="p-4 bg-stone-50/60 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <span>Weergave van {filteredInvoices.length} e-mails</span>
          <span className="italic">
            Tip: Mis je een e-mail? Klik op &lsquo;Markeer als factuur&rsquo; om het systeem te leren.
          </span>
        </div>
      </div>

      {/* MODAL: MARKEER ALS FACTUUR */}
      <Modal
        isOpen={!!selectedForReview}
        onClose={() => setSelectedForReview(null)}
        title="Markeer als Factuur & Doorsturen"
        description="Corrigeer en valideer deze inkomende e-mail voor jouw boekhouding."
      >
        {selectedForReview && (
          <div className="space-y-5">
            {/* Review Card */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
              <div>
                <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                  Afzender
                </span>
                <p className="text-sm font-semibold text-stone-900 mt-0.5">
                  {selectedForReview.sender}
                </p>
                <p className="text-xs text-stone-500">{selectedForReview.senderEmail}</p>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                  Onderwerp
                </span>
                <p className="text-xs text-stone-800 mt-0.5">{selectedForReview.subject}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-200/60 text-xs">
                <div>
                  <span className="text-stone-500">Gedetecteerd bedrag:</span>{" "}
                  <strong className="text-stone-900">
                    {selectedForReview.amount
                      ? formatCurrency(selectedForReview.amount)
                      : "Nader te bepalen"}
                  </strong>
                </div>
                {selectedForReview.attachmentName && (
                  <div className="flex items-center gap-1 text-stone-600">
                    <Paperclip className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[140px]">
                      {selectedForReview.attachmentName}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Target Select */}
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1.5">
                Doorsturen naar boekhouding
              </label>
              <select
                value={targetAccounting}
                onChange={(e) => setTargetAccounting(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-kami-500/20 focus:border-kami-600"
              >
                <option value="Moneybird (Inkoop)">Moneybird (Inkoopfacturen)</option>
                <option value="Exact Online (Boekhouding)">Exact Online</option>
                <option value="e-Boekhouden.nl (Inkomend)">e-Boekhouden.nl</option>
                <option value="Yuki (Documenten)">Yuki</option>
              </select>
            </div>

            {/* Learn sender checkbox */}
            <div className="flex items-start gap-2.5 pt-1">
              <input
                id="remember"
                type="checkbox"
                checked={rememberSender}
                onChange={(e) => setRememberSender(e.target.checked)}
                className="mt-0.5 rounded border-stone-300 text-kami-600 focus:ring-kami-500"
              />
              <label htmlFor="remember" className="text-xs text-stone-600 leading-normal">
                Onthoud <strong>{selectedForReview.sender}</strong> als vaste salonleverancier
                zodat toekomstige facturen automatisch doorgestuurd worden.
              </label>
            </div>

            {/* Buttons */}
            <div className="pt-3 flex items-center justify-end gap-3 border-t border-stone-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedForReview(null)}
              >
                Annuleren
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmMarkAsInvoice}
                className="bg-kami-600 hover:bg-kami-700 shadow-soft"
              >
                <Check className="w-4 h-4 mr-1" />
                Bevestig &amp; Direct Doorsturen
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
