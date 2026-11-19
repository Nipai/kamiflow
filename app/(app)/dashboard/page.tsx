"use client";

import * as React from "react";
import Link from "next/link";
import {
  FileText,
  Clock,
  Mail,
  AlertCircle,
  Search,
  Check,
  X,
  Paperclip,
  CheckCheck,
  Sparkles,
  CreditCard,
  ArrowRight,
  ShieldCheck,
  Building,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Switch } from "@/components/ui/Switch";
import {
  mockInvoices,
  mockDashboardStats,
  mockSalonProfile,
  mockEmailConnections,
  mockProfile,
} from "@/lib/mock-data";
import {
  InvoiceEmail,
  InvoiceStatus,
  EmailConnectionRow,
  ProfileRow,
  EmailRow,
} from "@/lib/types";
import { formatDate, formatCurrency, cn } from "@/lib/utils";
import { ZenBarometer } from "@/components/dashboard/zen-barometer";
import { ZenEmptyState } from "@/components/dashboard/zen-empty-state";
import { createClient } from "@/lib/supabase/client";

export default function DashboardPage() {
  const [invoices, setInvoices] = React.useState<InvoiceEmail[]>(mockInvoices);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedFilter, setSelectedFilter] = React.useState<"all" | "missed" | "forwarded">("all");

  // Real Supabase data states with initial fallbacks
  const [emailConnections, setEmailConnections] = React.useState<EmailConnectionRow[]>(mockEmailConnections);
  const [profile, setProfile] = React.useState<Partial<ProfileRow>>(mockProfile);
  const [recentEmails, setRecentEmails] = React.useState<EmailRow[]>([]);
  const [kpiCounts, setKpiCounts] = React.useState({
    forwardedThisMonth: 28,
    pendingOrFailedCount: 2,
  });

  // Modal state
  const [selectedForReview, setSelectedForReview] = React.useState<InvoiceEmail | null>(null);
  const [targetAccounting, setTargetAccounting] = React.useState("Moneybird (Inkoop)");
  const [rememberSender, setRememberSender] = React.useState(true);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  // Fetch Supabase data
  React.useEffect(() => {
    async function fetchSupabaseData() {
      try {
        const supabase = createClient();

        // 1. Mailbox connections
        const { data: conns } = await supabase
          .from("emailconnection")
          .select("*");
        if (conns && conns.length > 0) {
          setEmailConnections(conns);
        }

        // 2. Profile (for plan_tier & subscription_status)
        const { data: prof } = await supabase
          .from("profiles")
          .select("*")
          .limit(1)
          .single();
        if (prof) {
          setProfile(prof);
        }

        // 3. KPI counts: forwarded facturen
        const { count: forwardedCount } = await supabase
          .from("email")
          .select("*", { count: "exact", head: true })
          .eq("forward_status", "forwarded");

        // KPI counts: pending of failed
        const { count: pendingCount } = await supabase
          .from("email")
          .select("*", { count: "exact", head: true })
          .in("forward_status", ["pending", "failed"]);

        if (forwardedCount !== null || pendingCount !== null) {
          setKpiCounts({
            forwardedThisMonth: forwardedCount !== null && forwardedCount > 0 ? forwardedCount : 28,
            pendingOrFailedCount: pendingCount !== null ? pendingCount : 2,
          });
        }

        // 4. 5 meest recente e-mails uit `email`
        const { data: latestEmails } = await supabase
          .from("email")
          .select("*")
          .order("received_date", { ascending: false })
          .limit(5);

        if (latestEmails && latestEmails.length > 0) {
          setRecentEmails(latestEmails);
        }
      } catch (err) {
        // Fallback gracefully on local/mock data
      }
    }

    fetchSupabaseData();
  }, []);

  // Compute live stats based on state
  const missedCount = invoices.filter((inv) => inv.status === "missed").length;
  const forwardedCount = invoices.filter(
    (inv) => inv.status === "forwarded" || inv.status === "manual_confirmed"
  ).length;

  const activeMailboxCount = emailConnections.filter((m) => m.is_active).length;

  // Filtered invoices
  const filteredInvoices = invoices.filter((inv) => {
    if (selectedFilter === "missed" && inv.status !== "missed") return false;
    if (selectedFilter === "forwarded" && inv.status !== "forwarded" && inv.status !== "manual_confirmed") {
      return false;
    }
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

  const handleOpenDetails = (invoice: InvoiceEmail) => {
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

  const handleRejectInvoice = () => {
    if (!selectedForReview) return;

    setInvoices((prev) =>
      prev.map((item) =>
        item.id === selectedForReview.id
          ? {
              ...item,
              status: "pending" as InvoiceStatus,
            }
          : item
      )
    );

    const sender = selectedForReview.sender;
    setSelectedForReview(null);
    setToastMessage(`"${sender}" is gemarkeerd als geen factuur.`);
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
            Automatisch bijgehouden inkomende e-mails, actieve mailboxen en automatische factuurherkenning.
          </p>
        </div>

        {/* Mailbox status badges */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="info" className="px-3 py-1.5 text-xs font-normal bg-sand-100 text-stone-700 border-sand-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
            {activeMailboxCount} {activeMailboxCount === 1 ? "mailbox actief" : "mailboxen actief bijgehouden"}
          </Badge>
          <Link href="/koppelingen">
            <Button variant="outline" size="sm" className="text-xs h-7">
              Beheer koppelingen
            </Button>
          </Link>
        </div>
      </div>

      {/* ZEN STATUS BAROMETER (Prominente actiekaart bij twijfelgevallen) */}
      <ZenBarometer
        missedCount={missedCount}
        forwardedCount={forwardedCount + 24}
        onFilterMissed={() => setSelectedFilter("missed")}
        accountingSoftware={mockSalonProfile.accountingSoftware}
      />

      {/* TOAST SUCCESS NOTIFICATION */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between text-sm shadow-zen animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <CheckCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-medium">{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-xs text-emerald-700 hover:underline px-2 py-1 rounded"
          >
            Sluiten
          </button>
        </div>
      )}

      {/* STATS OVERVIEW CARDS (Compact 2x2 grid op mobiel, 4 cols op desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {/* Card 1: Doorgestuurd deze maand */}
        <Card className="hover:border-sand-300 transition-all duration-200 shadow-zen bg-white/90">
          <CardContent className="p-3.5 sm:p-5">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[11px] sm:text-xs font-medium text-stone-500 truncate">
                Doorgestuurd deze maand
              </span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-sand-100 flex items-center justify-center text-kami-700 shrink-0">
                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <div className="mt-2 sm:mt-3">
              <span className="font-serif text-2xl sm:text-3xl font-light text-stone-900">
                {forwardedCount + 24}
              </span>
              <span className="text-xs text-stone-400 ml-1.5 font-normal">facturen</span>
            </div>
            <p className="mt-1 text-[11px] sm:text-xs text-stone-500 truncate">
              Status: <span className="text-emerald-700 font-medium">Automatisch doorgestuurd</span>
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Bespaarde Tijd */}
        <Card className="hover:border-sand-300 transition-all duration-200 shadow-zen bg-white/90">
          <CardContent className="p-3.5 sm:p-5">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[11px] sm:text-xs font-medium text-stone-500 truncate">
                Bespaarde administratietijd
              </span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-sand-100 flex items-center justify-center text-kami-700 shrink-0">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <div className="mt-2 sm:mt-3">
              <span className="font-serif text-2xl sm:text-3xl font-light text-stone-900">
                ~{mockDashboardStats.hoursSaved}
              </span>
              <span className="text-xs text-stone-400 ml-1.5 font-normal">uur</span>
            </div>
            <p className="mt-1 text-[11px] sm:text-xs text-emerald-700 font-medium flex items-center gap-1 truncate">
              <Sparkles className="w-3 h-3 text-emerald-600 shrink-0" />
              <span className="truncate">Vrij voor salonklanten</span>
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Mailboxen & Status */}
        <Card className="hover:border-sand-300 transition-all duration-200 shadow-zen bg-white/90">
          <CardContent className="p-3.5 sm:p-5">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[11px] sm:text-xs font-medium text-stone-500 truncate">
                Gekoppelde mailboxen
              </span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-sand-100 flex items-center justify-center text-stone-600 shrink-0">
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <div className="mt-2 sm:mt-3">
              <span className="font-serif text-2xl sm:text-3xl font-light text-stone-900">
                {emailConnections.length || mockDashboardStats.connectedMailboxes}
              </span>
              <span className="text-xs text-stone-400 ml-1.5 font-normal">verbonden</span>
            </div>
            <div className="mt-1 text-[11px] sm:text-xs text-stone-500 flex items-center gap-1.5 truncate">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${activeMailboxCount > 0 ? "bg-emerald-500" : "bg-stone-300"}`} />
              <span className="truncate">{activeMailboxCount} actief • sync {emailConnections[0]?.mailbox_last_sync ? "recent" : "actief"}</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Aandacht Vereist / Wachtend */}
        <Card
          onClick={() => setSelectedFilter("missed")}
          className={`cursor-pointer transition-all duration-200 shadow-zen ${
            missedCount > 0
              ? "border-amber-300/90 bg-amber-50/30 hover:bg-amber-50/50"
              : "hover:border-sand-300 bg-white/90"
          }`}
        >
          <CardContent className="p-3.5 sm:p-5">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[11px] sm:text-xs font-medium text-stone-500 truncate">
                Aandacht vereist (Gemist)
              </span>
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 ${
                  missedCount > 0
                    ? "bg-amber-100 text-amber-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <div className="mt-2 sm:mt-3 flex items-baseline justify-between">
              <div>
                <span className="font-serif text-2xl sm:text-3xl font-light text-stone-900">
                  {missedCount}
                </span>
                <span className="text-xs text-stone-400 ml-1.5 font-normal">
                  {missedCount === 1 ? "e-mail" : "e-mails"}
                </span>
              </div>
              <Badge variant="info" className="text-[9px] sm:text-[10px] uppercase font-mono tracking-wider">
                {profile.plan_tier || "pro"}
              </Badge>
            </div>
            <p className="mt-1 text-[11px] sm:text-xs text-amber-700 font-medium truncate">
              {missedCount > 0 ? "Tik om te checken" : "Alles is bijgewerkt!"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* RECENTE FACTUREN & E-MAILS (COMPACTE KAARTEN) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-kami-600" />
          <h2 className="text-sm font-semibold text-stone-800 tracking-tight">
            Recente Facturen &amp; E-mails
          </h2>
        </div>

        {/* Filter- & Zoekbalk */}
        <div className="bg-white/90 rounded-2xl border border-sand-200/90 p-3 sm:p-4 shadow-subtle flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Tab Filters */}
          <div className="flex items-center gap-1.5 bg-sand-100/80 p-1 rounded-xl self-start overflow-x-auto max-w-full">
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
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-200 text-amber-900 font-semibold">
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

          {/* Zoekbalk */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Zoek op leverancier of nummer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-sand-50/60 border border-sand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kami-500/20 focus:border-kami-600 transition"
            />
          </div>
        </div>

        {/* ULTRA-CLEANE COMPACTE FACTUURKAARTEN (MAX 4) */}
        {filteredInvoices.length === 0 ? (
          <ZenEmptyState
            isMissedFilter={selectedFilter === "missed"}
            searchQuery={searchQuery}
            onResetFilter={() => setSelectedFilter("all")}
            onResetSearch={() => setSearchQuery("")}
            accountingSoftware={mockSalonProfile.accountingSoftware}
          />
        ) : (
          <div className="space-y-2.5">
            {filteredInvoices.slice(0, 4).map((inv) => {
              const isForwarded = inv.status === "forwarded" || inv.status === "manual_confirmed";
              const statusLabel =
                inv.status === "manual_confirmed"
                  ? "Handmatig gemarkeerd"
                  : isForwarded
                  ? "Doorgestuurd"
                  : "Check nodig";

              return (
                <div
                  key={inv.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedForReview(inv)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedForReview(inv);
                    }
                  }}
                  className="w-full text-left p-4 sm:p-4.5 rounded-2xl bg-white border border-sand-200/90 hover:border-kami-300 shadow-subtle hover:shadow-zen transition-all duration-200 flex items-center justify-between gap-4 cursor-pointer group active:scale-[0.99] select-none"
                  aria-label={`Factuur ${inv.sender}`}
                >
                  {/* Links: Leverancier (vet) + korte datum eronder */}
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-stone-900 truncate text-sm sm:text-base group-hover:text-kami-700 transition-colors">
                      {inv.sender}
                    </div>
                    <div className="text-xs text-stone-400 mt-0.5">
                      {formatDate(inv.receivedAt)}
                    </div>
                  </div>

                  {/* Rechts: Bedrag (indien bekend) + één zachte status-pil */}
                  <div className="flex items-center gap-3 shrink-0">
                    {inv.amount !== undefined && inv.amount !== null && (
                      <span className="font-medium text-stone-900 text-xs sm:text-sm">
                        {formatCurrency(inv.amount)}
                      </span>
                    )}
                    <span
                      className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-medium border transition-colors",
                        isForwarded
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200/60"
                          : "bg-amber-50 text-amber-800 border-amber-200/60"
                      )}
                    >
                      {statusLabel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Link / Knop naar alle facturen */}
        <div className="pt-2 flex justify-center">
          <Link
            href="/facturen"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-white border border-sand-200 hover:border-kami-300 text-stone-700 hover:text-stone-900 text-xs font-medium shadow-subtle hover:shadow-zen transition-all group"
          >
            <span>Bekijk alle facturen →</span>
          </Link>
        </div>
      </div>

      {/* BOTTOM SHEET (op mobiel) / MODAL (op desktop) */}
      <Modal
        isOpen={!!selectedForReview}
        onClose={() => setSelectedForReview(null)}
        title={
          selectedForReview?.status === "missed"
            ? "Markeer als Factuur & Doorsturen"
            : selectedForReview?.sender || "Factuur Details"
        }
        description={
          selectedForReview?.status === "missed"
            ? "Corrigeer en valideer deze inkomende e-mail voor jouw boekhouding."
            : "Controleer de factuurgegevens en gekoppelde boekhouding."
        }
      >
        {selectedForReview && (
          <div className="space-y-4 text-xs">
            {/* Details overzicht */}
            <div className="p-4 sm:p-4.5 rounded-2xl bg-sand-50/70 border border-sand-200/80 space-y-3">
              {/* Afzender e-mail */}
              <div>
                <span className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider block">
                  E-mailadres afzender
                </span>
                <p className="font-mono text-xs text-stone-800 mt-0.5 break-all">
                  {selectedForReview.senderEmail}
                </p>
              </div>

              {/* Onderwerp */}
              <div>
                <span className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider block">
                  Onderwerp
                </span>
                <p className="font-medium text-xs text-stone-900 mt-0.5">
                  {selectedForReview.subject || "(Geen onderwerp)"}
                </p>
              </div>

              {/* Tekstfragment */}
              {selectedForReview.snippet && (
                <div>
                  <span className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider block">
                    Tekstfragment
                  </span>
                  <p className="text-[11px] text-stone-600 italic bg-white/70 p-2.5 rounded-xl border border-sand-200/60 mt-0.5 leading-relaxed">
                    &ldquo;{selectedForReview.snippet}&rdquo;
                  </p>
                </div>
              )}

              {/* PDF Bestandsnaam & Boekhoudbestemming */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2.5 border-t border-sand-200/60">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider block">
                    PDF Document
                  </span>
                  <div className="flex items-center gap-1.5 text-stone-800 font-mono text-[11px] mt-0.5 truncate">
                    <Paperclip className="w-3.5 h-3.5 text-kami-600 shrink-0" />
                    <span className="truncate">
                      {selectedForReview.attachmentName || "Factuur_omgezet.pdf"}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider block">
                    Boekhoudbestemming
                  </span>
                  <div className="flex items-center gap-1.5 text-stone-800 font-mono text-[11px] mt-0.5 truncate">
                    <Building className="w-3.5 h-3.5 text-kami-600 shrink-0" />
                    <span className="truncate">
                      {selectedForReview.uploadDestination || "haarstudiopuur@moneybird.com"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actieknoppen */}
            {selectedForReview.status === "missed" ? (
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1.5">
                    Doorsturen naar boekhouding
                  </label>
                  <select
                    value={targetAccounting}
                    onChange={(e) => setTargetAccounting(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-white border border-sand-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-kami-500/20 focus:border-kami-600 shadow-subtle"
                  >
                    <option value="Moneybird (Inkoop)">Moneybird (Inkoopfacturen)</option>
                    <option value="Exact Online (Boekhouding)">Exact Online</option>
                    <option value="e-Boekhouden.nl (Inkomend)">e-Boekhouden.nl</option>
                    <option value="Yuki (Documenten)">Yuki</option>
                  </select>
                </div>

                <div className="flex items-start gap-3 pt-1">
                  <Switch
                    id="remember"
                    checked={rememberSender}
                    onCheckedChange={(val) => setRememberSender(val)}
                    aria-label={`Onthoud ${selectedForReview.sender}`}
                  />
                  <label htmlFor="remember" className="text-xs text-stone-600 leading-normal cursor-pointer select-none">
                    Onthoud <strong>{selectedForReview.sender}</strong> als vaste salonleverancier
                  </label>
                </div>

                <div className="pt-2 space-y-2">
                  <span className="text-xs font-medium text-stone-700 block">
                    Is dit een factuur voor de salon?
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={handleConfirmMarkAsInvoice}
                      className="w-full py-3.5 sm:py-3 px-4 rounded-2xl bg-kami-600 hover:bg-kami-700 text-white font-semibold text-xs shadow-soft transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Check className="w-4 h-4 shrink-0" />
                      <span>Ja, is een factuur</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleRejectInvoice}
                      className="w-full py-3.5 sm:py-3 px-4 rounded-2xl border border-stone-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-stone-600 font-medium text-xs transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <X className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>Nee, geen factuur</span>
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedForReview(null)}
                    className="text-xs text-stone-400 hover:text-stone-600 py-1 px-2"
                  >
                    Annuleren
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 pt-1">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCheck className="w-4 h-4 text-emerald-600" />
                    <span>
                      Gekoppeld en doorgestuurd naar <strong>{selectedForReview.accountingTarget || "Moneybird"}</strong>
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-mono">Doorgestuurd</span>
                </div>

                <div className="flex justify-end pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedForReview(null)}
                    className="text-xs"
                  >
                    Sluiten
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
