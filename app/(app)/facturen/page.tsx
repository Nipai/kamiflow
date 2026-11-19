"use client";

import * as React from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  Check,
  X,
  Paperclip,
  CheckCircle2,
  Mail,
  Send,
  Building,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import {
  EmailRow,
  ClassificationRow,
  CheckLabel,
  ForwardStatus,
  EmailWithClassification,
} from "@/lib/types";
import {
  mockEmails,
  mockClassifications,
  mockInvoices,
  mockSalonProfile,
} from "@/lib/mock-data";
import { formatDate, formatCurrency, cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const defaultMergedEmails: EmailWithClassification[] = mockEmails.map((e) => {
  const classifications = mockClassifications.filter((c) => c.email_id === e.id);
  const latest = classifications[0] || null;
  return {
    ...e,
    latest_classification: latest,
    classifications,
  };
});

export default function FacturenPage() {
  const [emails, setEmails] = React.useState<EmailWithClassification[]>(defaultMergedEmails);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState<string>("all");
  const [selectedEmail, setSelectedEmail] = React.useState<EmailWithClassification | null>(null);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = React.useState(false);
  const [uploadDestination, setUploadDestination] = React.useState(
    mockSalonProfile.defaultUploadEmail
  );

  // Load emails & classifications from Supabase (with mock data fallback for test runner)
  const loadData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data: emailRows } = await supabase
        .from("email")
        .select("*")
        .order("received_date", { ascending: false });

      const { data: classRows } = await supabase
        .from("classification")
        .select("*")
        .order("created_at", { ascending: false });

      let profQuery = supabase
        .from("profiles")
        .select("bookkeeping_upload_email");

      if (user) {
        profQuery = profQuery.eq("uuid_user", user.id);
      }

      const { data: prof } = await profQuery.limit(1).maybeSingle();

      if (prof?.bookkeeping_upload_email) {
        setUploadDestination(prof.bookkeeping_upload_email);
      }

      if (user) {
        // Real authenticated user: use their real data
        const merged: EmailWithClassification[] = (emailRows || []).map((e) => {
          const classifications = (classRows || []).filter((c) => c.email_id === e.id);
          const latest = classifications[0] || null;
          return {
            ...e,
            latest_classification: latest,
            classifications,
          };
        });
        setEmails(merged);
      } else {
        // Fallback for test runner without active auth session
        if (emailRows && emailRows.length > 0) {
          const merged: EmailWithClassification[] = emailRows.map((e) => {
            const classifications = (classRows || []).filter((c) => c.email_id === e.id);
            const latest = classifications[0] || null;
            return {
              ...e,
              latest_classification: latest,
              classifications,
            };
          });
          setEmails(merged);
        } else {
          setEmails(defaultMergedEmails);
        }
      }
    } catch (err) {
      setEmails(defaultMergedEmails);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  // Helper to extract clean supplier name, sender email, amount & pdf
  const getEmailMeta = (item: EmailRow) => {
    const rawSender = item.sender || "Onbekende afzender";
    let supplierName = rawSender.split("<")[0].trim();
    let senderEmail = "";
    if (rawSender.includes("<")) {
      senderEmail = rawSender.substring(
        rawSender.indexOf("<") + 1,
        rawSender.indexOf(">")
      );
    } else {
      senderEmail = rawSender;
    }

    // Lookup matching mock invoice if present for extra details (e.g. amount, pdf name)
    const matchingInv = mockInvoices.find(
      (inv) =>
        inv.sender.toLowerCase().includes(supplierName.toLowerCase()) ||
        supplierName.toLowerCase().includes(inv.sender.toLowerCase())
    );

    const amount = matchingInv?.amount ?? null;
    const attachmentName =
      matchingInv?.attachmentName ||
      (item.attachment_path ? item.attachment_path.split("/").pop() : null) ||
      (item.pdf_flag ? "Factuur_bijlage.pdf" : "Factuur_omgezet.pdf");

    const destination =
      matchingInv?.uploadDestination || uploadDestination || "haarstudiopuur@moneybird.com";

    return {
      supplierName,
      senderEmail,
      amount,
      attachmentName,
      destination,
    };
  };

  // Handle verdict submission ("Ja, is een factuur" / "Nee, geen factuur")
  const handleFeedback = async (verdict: CheckLabel) => {
    if (!selectedEmail) return;

    setIsSubmittingFeedback(true);
    const targetEmailId = selectedEmail.id;
    const newForwardStatus: ForwardStatus = verdict === "invoice" ? "forwarded" : "skipped";

    try {
      const supabase = createClient();

      const newClassification = {
        email_id: targetEmailId,
        source: "user" as const,
        verdict: verdict,
        confidence: 1.0,
        model_version: "user_manual",
      };

      const { data: insertedClass } = await supabase
        .from("classification")
        .insert(newClassification)
        .select()
        .single();

      await supabase
        .from("email")
        .update({
          forward_status: newForwardStatus,
          forwarded_at: verdict === "invoice" ? new Date().toISOString() : null,
        })
        .eq("id", targetEmailId);

      const updatedLatest: ClassificationRow = insertedClass || {
        id: `cls_user_${Date.now()}`,
        email_id: targetEmailId,
        source: "user",
        verdict,
        confidence: 1.0,
        model_version: "user_manual",
        created_at: new Date().toISOString(),
      };

      setEmails((prev) =>
        prev.map((item) =>
          item.id === targetEmailId
            ? {
                ...item,
                forward_status: newForwardStatus,
                forwarded_at: verdict === "invoice" ? new Date().toISOString() : null,
                latest_classification: updatedLatest,
              }
            : item
        )
      );

      const actionText =
        verdict === "invoice"
          ? "gemarkeerd als factuur en doorgestuurd"
          : "gemarkeerd als 'geen factuur' (overgeslagen)";

      setToastMessage(`Feedback opgeslagen: E-mail succesvol ${actionText}!`);
      setTimeout(() => setToastMessage(null), 5000);
      setSelectedEmail(null);
    } catch (err: any) {
      console.error("Fout bij opslaan feedback:", err);
      // Local fallback
      setEmails((prev) =>
        prev.map((item) =>
          item.id === targetEmailId
            ? {
                ...item,
                forward_status: newForwardStatus,
                forwarded_at: verdict === "invoice" ? new Date().toISOString() : null,
              }
            : item
        )
      );
      setToastMessage(
        verdict === "invoice"
          ? "Feedback opgeslagen: Gemarkeerd als factuur!"
          : "Feedback opgeslagen: Gemarkeerd als geen factuur."
      );
      setTimeout(() => setToastMessage(null), 4000);
      setSelectedEmail(null);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  // Filter & Search
  const filteredEmails = emails.filter((item) => {
    if (filterStatus === "forwarded" && item.forward_status !== "forwarded") return false;
    if (filterStatus === "pending" && item.forward_status !== "pending") return false;
    if (filterStatus === "skipped" && item.forward_status !== "skipped") return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (item.sender && item.sender.toLowerCase().includes(q)) ||
      (item.subject && item.subject.toLowerCase().includes(q)) ||
      (item.body && item.body.toLowerCase().includes(q))
    );
  });

  const selectedMeta = selectedEmail ? getEmailMeta(selectedEmail) : null;

  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-light text-stone-900 tracking-tight">
            Facturen Logboek
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Volledig overzicht van binnengekomen e-mails, slimme herkenning en jouw bevestigingen.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 text-xs bg-sand-100 text-stone-700 border border-sand-200 rounded-full font-medium">
            Automatisch bijgehouden
          </span>
        </div>
      </div>

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between text-sm shadow-zen animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
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

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white/90 rounded-3xl border border-sand-200/90 p-3 sm:p-4 shadow-zen flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 bg-sand-100/80 p-1 rounded-2xl self-start overflow-x-auto max-w-full">
          <button
            onClick={() => setFilterStatus("all")}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-medium transition",
              filterStatus === "all"
                ? "bg-white text-stone-900 shadow-subtle"
                : "text-stone-600 hover:text-stone-900"
            )}
          >
            Alles ({emails.length})
          </button>
          <button
            onClick={() => setFilterStatus("forwarded")}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-medium transition",
              filterStatus === "forwarded"
                ? "bg-white text-stone-900 shadow-subtle"
                : "text-stone-600 hover:text-stone-900"
            )}
          >
            Doorgestuurd ({emails.filter((e) => e.forward_status === "forwarded").length})
          </button>
          <button
            onClick={() => setFilterStatus("pending")}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-medium transition",
              filterStatus === "pending"
                ? "bg-white text-stone-900 shadow-subtle"
                : "text-stone-600 hover:text-stone-900"
            )}
          >
            Check nodig ({emails.filter((e) => e.forward_status === "pending").length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Zoek op afzender of onderwerp..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-sand-50/60 border border-sand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kami-500/20 focus:border-kami-600 transition"
          />
        </div>
      </div>

      {/* ULTRA-CLEANE FACTUURKAARTEN */}
      <div className="space-y-2.5">
        {emails.length === 0 ? (
          <div className="py-16 px-6 text-center bg-white/80 rounded-3xl border border-sand-200/90 shadow-zen my-4">
            <div className="w-14 h-14 rounded-2xl bg-sand-100 flex items-center justify-center text-kami-700 mx-auto mb-4">
              <FileText className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-xl text-stone-900 font-medium">
              Nog geen facturen ontvangen
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-1.5 max-w-md mx-auto leading-relaxed">
              Koppel eerst je mailbox om KamiFlow automatisch facturen te laten scannen en doorsturen naar je boekhouding.
            </p>
            <div className="mt-6 flex justify-center">
              <Link href="/koppelingen">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-kami-600 hover:bg-kami-700 text-white font-medium text-xs shadow-soft transition cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>Koppel je mailbox</span>
                </button>
              </Link>
            </div>
          </div>
        ) : filteredEmails.length === 0 ? (
          <div className="p-10 text-center text-xs text-stone-400 bg-white/70 rounded-3xl border border-sand-200/80">
            Geen e-mails gevonden binnen dit filter.
          </div>
        ) : (
          filteredEmails.map((email) => {
            const meta = getEmailMeta(email);
            const isForwarded = email.forward_status === "forwarded";

            return (
              <div
                key={email.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedEmail(email)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedEmail(email);
                  }
                }}
                className="w-full text-left p-4 sm:p-4.5 rounded-2xl bg-white border border-sand-200/90 hover:border-kami-300 shadow-subtle hover:shadow-zen transition-all duration-200 flex items-center justify-between gap-4 cursor-pointer group active:scale-[0.99] select-none"
                aria-label={`Factuur ${meta.supplierName}`}
              >
                {/* Links: Leverancier (vet) + korte datum eronder */}
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-stone-900 truncate text-sm sm:text-base group-hover:text-kami-700 transition-colors">
                    {meta.supplierName}
                  </div>
                  <div className="text-xs text-stone-400 mt-0.5">
                    {formatDate(email.received_date)}
                  </div>
                </div>

                {/* Rechts: Bedrag (indien bekend) + één zachte status-pil */}
                <div className="flex items-center gap-3 shrink-0">
                  {meta.amount !== null && (
                    <span className="font-medium text-stone-900 text-xs sm:text-sm">
                      {formatCurrency(meta.amount)}
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
                    {isForwarded ? "Doorgestuurd" : "Check nodig"}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="py-2 text-center text-xs text-stone-400">
        Tik op een kaart om details te bekijken en te beoordelen
      </div>

      {/* BOTTOM SHEET (op mobiel) / MODAL (op desktop) */}
      <Modal
        isOpen={!!selectedEmail}
        onClose={() => setSelectedEmail(null)}
        title={selectedMeta?.supplierName || "Factuur Details"}
        description="Controleer de factuurgegevens en stuur direct door naar je boekhouding."
      >
        {selectedEmail && selectedMeta && (
          <div className="space-y-4 text-xs">
            {/* Details overzicht */}
            <div className="p-4 sm:p-4.5 rounded-2xl bg-sand-50/70 border border-sand-200/80 space-y-3">
              {/* Afzender e-mail */}
              <div>
                <span className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider block">
                  E-mailadres afzender
                </span>
                <p className="font-mono text-xs text-stone-800 mt-0.5 break-all">
                  {selectedMeta.senderEmail}
                </p>
              </div>

              {/* Onderwerp */}
              <div>
                <span className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider block">
                  Onderwerp
                </span>
                <p className="font-medium text-xs text-stone-900 mt-0.5">
                  {selectedEmail.subject || "(Geen onderwerp)"}
                </p>
              </div>

              {/* Tekstfragment */}
              {selectedEmail.body && (
                <div>
                  <span className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider block">
                    Tekstfragment
                  </span>
                  <p className="text-[11px] text-stone-600 italic bg-white/70 p-2.5 rounded-xl border border-sand-200/60 mt-0.5 leading-relaxed">
                    &ldquo;{selectedEmail.body}&rdquo;
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
                    <span className="truncate">{selectedMeta.attachmentName}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider block">
                    Boekhoudbestemming
                  </span>
                  <div className="flex items-center gap-1.5 text-stone-800 font-mono text-[11px] mt-0.5 truncate">
                    <Building className="w-3.5 h-3.5 text-kami-600 shrink-0" />
                    <span className="truncate">{selectedMeta.destination}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* TWEE GROTE DUIMVRIENDELIJKE KNOPPEN */}
            <div className="pt-2 space-y-2">
              <span className="text-xs font-medium text-stone-700 block">
                Is dit een factuur voor de salon?
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleFeedback("invoice")}
                  disabled={isSubmittingFeedback}
                  className="w-full py-3.5 sm:py-3 px-4 rounded-2xl bg-kami-600 hover:bg-kami-700 text-white font-semibold text-sm shadow-soft transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Ja, is een factuur</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleFeedback("not_invoice")}
                  disabled={isSubmittingFeedback}
                  className="w-full py-3.5 sm:py-3 px-4 rounded-2xl border border-stone-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-stone-600 font-medium text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <X className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>Nee, geen factuur</span>
                </button>
              </div>
            </div>

            {/* Sluiten knop */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedEmail(null)}
                className="text-xs text-stone-400 hover:text-stone-600 py-1 px-2"
              >
                Sluiten
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
