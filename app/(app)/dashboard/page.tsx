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
  Paperclip,
  CheckCheck,
  Sparkles,
  LayoutGrid,
  List,
  CreditCard,
  ArrowRight,
  ShieldCheck,
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
import { formatDate } from "@/lib/utils";
import { ZenBarometer } from "@/components/dashboard/zen-barometer";
import { ZenEmptyState } from "@/components/dashboard/zen-empty-state";
import { InvoiceFeedCard } from "@/components/dashboard/invoice-feed-card";
import { createClient } from "@/lib/supabase/client";

export default function DashboardPage() {
  const [invoices, setInvoices] = React.useState<InvoiceEmail[]>(mockInvoices);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedFilter, setSelectedFilter] = React.useState<"all" | "missed" | "forwarded">("all");
  const [viewMode, setViewMode] = React.useState<"feed" | "table">("feed");

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

      {/* RECENT EMAILS BANNER (5 meest recente e-mails uit `email`) */}
      {recentEmails.length > 0 && (
        <div className="p-5 rounded-3xl bg-white border border-sand-200 shadow-zen space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-kami-600" />
              <h3 className="text-xs font-semibold text-stone-800 uppercase tracking-wider">
                Recente e-mailactiviteit (Laatste 5 scans)
              </h3>
            </div>
            <Link
              href="/facturen"
              className="text-xs text-kami-700 hover:text-kami-800 font-medium flex items-center gap-1"
            >
              <span>Bekijk compleet logboek</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-stone-100 text-xs">
            {recentEmails.map((item) => {
              const subject = item.subject || "Geen onderwerp";
              const sender = item.sender || "Onbekende afzender";
              const date = item.received_date;
              const status = item.forward_status;
              const hasPdf = item.pdf_flag;

              return (
                <div
                  key={item.id}
                  className="py-2.5 flex items-center justify-between gap-3 first:pt-1 last:pb-0"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        status === "forwarded"
                          ? "bg-emerald-500"
                          : status === "failed"
                          ? "bg-rose-500"
                          : "bg-amber-400"
                      }`}
                    />
                    <div className="truncate">
                      <span className="font-medium text-stone-800 mr-2">{sender.split("<")[0].trim()}</span>
                      <span className="text-stone-500 truncate">{subject}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 text-stone-400">
                    {hasPdf ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-stone-600 bg-sand-100 px-2 py-0.5 rounded">
                        <Paperclip className="w-3 h-3 text-kami-600" /> PDF
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                        HTML
                      </span>
                    )}
                    <span className="hidden sm:inline text-[11px]">{formatDate(date)}</span>
                    <Badge
                      variant={
                        status === "forwarded"
                          ? "success"
                          : status === "failed"
                          ? "danger"
                          : "warning"
                      }
                      className="text-[10px] py-0 px-2"
                    >
                      {status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* INBOX SECTION: CONTROLS & CONTENT */}
      <div className="space-y-4">
        {/* Controls Bar */}
        <div className="bg-white/90 rounded-3xl border border-sand-200/90 p-4 sm:p-5 shadow-zen flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Tab Filters */}
          <div className="flex items-center gap-1.5 bg-sand-100/80 p-1 rounded-2xl self-start overflow-x-auto max-w-full">
            <button
              onClick={() => setSelectedFilter("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition ${
                selectedFilter === "all"
                  ? "bg-white text-stone-900 shadow-subtle"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Alle e-mails ({invoices.length})
            </button>
            <button
              onClick={() => setSelectedFilter("missed")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 ${
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
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition ${
                selectedFilter === "forwarded"
                  ? "bg-white text-stone-900 shadow-subtle"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Doorgestuurd ({forwardedCount})
            </button>
          </div>

          {/* Right: Search Box & View Mode Toggle */}
          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Zoek op leverancier of nummer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-xs bg-sand-50/60 border border-sand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kami-500/20 focus:border-kami-600 transition"
              />
            </div>

            <div className="hidden sm:flex items-center bg-sand-100/80 p-1 rounded-xl">
              <button
                onClick={() => setViewMode("feed")}
                className={`p-1.5 rounded-lg text-xs transition ${
                  viewMode === "feed"
                    ? "bg-white text-stone-900 shadow-subtle"
                    : "text-stone-500 hover:text-stone-900"
                }`}
                title="Zen Kaarten Feed"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg text-xs transition ${
                  viewMode === "table"
                    ? "bg-white text-stone-900 shadow-subtle"
                    : "text-stone-500 hover:text-stone-900"
                }`}
                title="Overzicht Tabel"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* CONTENT AREA: ZEN FEED OR TABLE */}
        {filteredInvoices.length === 0 ? (
          <ZenEmptyState
            isMissedFilter={selectedFilter === "missed"}
            searchQuery={searchQuery}
            onResetFilter={() => setSelectedFilter("all")}
            onResetSearch={() => setSearchQuery("")}
            accountingSoftware={mockSalonProfile.accountingSoftware}
          />
        ) : viewMode === "feed" ? (
          <div className="space-y-3.5">
            {filteredInvoices.map((inv) => (
              <InvoiceFeedCard
                key={inv.id}
                invoice={inv}
                onOpenDetails={handleOpenDetails}
                onMarkInvoice={handleOpenMarkModal}
              />
            ))}
            <div className="py-3 px-4 text-center text-xs text-stone-400">
              Weergave van {filteredInvoices.length} e-mails in de Zen Feed
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-sand-200/90 shadow-zen overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm" role="table">
                <thead>
                  <tr className="border-b border-sand-200/80 bg-sand-50/60 text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6">Leverancier</th>
                    <th className="py-3.5 px-6">Onderwerp &amp; Bijlage</th>
                    <th className="py-3.5 px-6">Categorie</th>
                    <th className="py-3.5 px-6">Datum</th>
                    <th className="py-3.5 px-6 text-right">Actie</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {filteredInvoices.map((inv) => (
                    <tr
                      key={inv.id}
                      className={`hover:bg-sand-50/60 transition-colors ${
                        inv.status === "missed" ? "bg-amber-50/30" : ""
                      }`}
                    >
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

                      <td className="py-4 px-6">
                        <div className="font-medium text-stone-900 truncate max-w-[180px]">
                          {inv.sender}
                        </div>
                        <div className="text-xs text-stone-400 truncate max-w-[180px]">
                          {inv.senderEmail}
                        </div>
                      </td>

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

                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className="inline-block px-2.5 py-0.5 rounded-lg bg-stone-100 text-stone-600 text-xs font-normal">
                          {inv.category || "Algemeen"}
                        </span>
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap text-xs text-stone-500">
                        {formatDate(inv.receivedAt)}
                      </td>

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
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDetails(inv)}
                            className="text-xs text-stone-500 hover:text-stone-800"
                          >
                            {inv.accountingTarget || "Gekoppeld"}
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-sand-50/50 border-t border-sand-200/80 flex items-center justify-between text-xs text-stone-500">
              <span>Weergave van {filteredInvoices.length} e-mails</span>
              <span className="italic">
                Tip: Mis je een e-mail? Klik op &lsquo;Markeer als factuur&rsquo; om het systeem te leren.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* RICH MODAL: MARKEER ALS FACTUUR / INVOICE PREVIEW */}
      <Modal
        isOpen={!!selectedForReview}
        onClose={() => setSelectedForReview(null)}
        title={
          selectedForReview?.status === "missed"
            ? "Markeer als Factuur & Doorsturen"
            : "Salonfactuur Details & Doorsturing"
        }
        description={
          selectedForReview?.status === "missed"
            ? "Corrigeer en valideer deze inkomende e-mail voor jouw boekhouding."
            : "Inzage in de geverifieerde salonfactuur en gekoppelde boekhouding."
        }
      >
        {selectedForReview && (
          <div className="space-y-5">
            <div className="p-4 sm:p-5 rounded-2xl bg-sand-50/70 border border-sand-200 space-y-3.5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                    Afzender &amp; Leverancier
                  </span>
                  <p className="text-base font-semibold text-stone-900 mt-0.5">
                    {selectedForReview.sender}
                  </p>
                  <p className="text-xs text-stone-500">{selectedForReview.senderEmail}</p>
                </div>
                {selectedForReview.category && (
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-sand-200 text-stone-600 text-xs font-medium shadow-subtle">
                    {selectedForReview.category}
                  </span>
                )}
              </div>

              <div>
                <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                  Onderwerp
                </span>
                <p className="text-xs text-stone-800 mt-0.5 leading-relaxed">{selectedForReview.subject}</p>
                {selectedForReview.snippet && (
                  <p className="text-[11px] text-stone-500 italic mt-1 bg-white/60 p-2 rounded-lg border border-sand-200/50">
                    &ldquo;{selectedForReview.snippet}&rdquo;
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-sand-200/70 text-xs">
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase tracking-wider font-medium">
                    Upload Bestemming
                  </span>
                  <strong className="text-xs font-mono font-semibold text-stone-900 mt-0.5 block truncate">
                    {selectedForReview.uploadDestination || "haarstudiopuur@moneybird.com"}
                  </strong>
                  <span className="text-[10px] text-stone-400">
                    Boekhoud-upload inbox
                  </span>
                </div>

                <div>
                  <span className="text-stone-400 block text-[10px] uppercase tracking-wider font-medium">
                    PDF Document
                  </span>
                  <div className="flex items-center gap-1.5 text-stone-700 mt-0.5">
                    <Paperclip className="w-3.5 h-3.5 text-kami-600 shrink-0" />
                    <span className="truncate max-w-[150px] font-mono text-[11px]">
                      {selectedForReview.attachmentName}
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-700 block mt-0.5 font-medium">
                    {selectedForReview.pdfSource === "converted_from_email"
                      ? "Geen PDF in mail → Wordt omgezet naar PDF"
                      : "Originele PDF bijlage"}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-sand-200/60 space-y-1 text-xs text-stone-500">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 text-kami-600" />
                    Slimme herkenning (Onderwerp &amp; Bericht)
                  </span>
                  <span className="font-semibold text-stone-800">
                    {selectedForReview.confidenceScore}% zekerheid
                  </span>
                </div>
                {selectedForReview.matchReason && (
                  <p className="text-[11px] text-stone-500 italic">
                    {selectedForReview.matchReason}
                  </p>
                )}
              </div>
            </div>

            {selectedForReview.status === "missed" ? (
              <>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1.5">
                    Doorsturen naar boekhouding
                  </label>
                  <select
                    value={targetAccounting}
                    onChange={(e) => setTargetAccounting(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-sand-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-kami-500/20 focus:border-kami-600 shadow-subtle"
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
                    zodat toekomstige facturen automatisch doorgestuurd worden.
                  </label>
                </div>

                <div className="pt-3 flex items-center justify-end gap-3 border-t border-stone-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedForReview(null)}
                    className="text-xs"
                  >
                    Annuleren
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleConfirmMarkAsInvoice}
                    className="bg-kami-600 hover:bg-kami-700 shadow-soft text-xs"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Bevestig &amp; Direct Doorsturen
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-4 pt-1">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCheck className="w-4 h-4 text-emerald-600" />
                    <span>Gekoppeld en doorgestuurd naar <strong>{selectedForReview.accountingTarget || "Moneybird"}</strong></span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-mono">0 sec. handmatig werk</span>
                </div>

                <div className="flex justify-end pt-2">
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
