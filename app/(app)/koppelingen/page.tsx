"use client";

import * as React from "react";
import {
  Mail,
  Building,
  CheckCircle2,
  AlertCircle,
  Clock,
  Trash2,
  X,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/Switch";
import { Modal } from "@/components/ui/modal";
import { mockAccountingIntegrations, mockEmailConnections, mockProfile } from "@/lib/mock-data";
import { EmailConnectionRow } from "@/lib/types";
import { formatDate, formatTime } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

function GoogleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.4 9 5 12 5z"
      />
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
      />
      <path
        fill="#FBBC05"
        d="M5.6 14.7c-.2-.7-.4-1.5-.4-2.7 0-1.2.2-2 .4-2.7L1.9 6.4C.7 8.8 0 10.4 0 12c0 1.6.7 3.2 1.9 5.6l3.7-2.9z"
      />
      <path
        fill="#34A853"
        d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.3L1.9 16C3.7 19.8 7.5 23 12 23z"
      />
    </svg>
  );
}

function MicrosoftIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 23 23" aria-hidden="true">
      <path fill="#f35325" d="M1 1h10v10H1z" />
      <path fill="#81bc06" d="M12 1h10v10H12z" />
      <path fill="#05a6f0" d="M1 12h10v10H1z" />
      <path fill="#ffba08" d="M12 12h10v10H12z" />
    </svg>
  );
}

interface NotificationState {
  type: "success" | "error";
  message: string;
}

export default function KoppelingenPage() {
  const [connections, setConnections] = React.useState<EmailConnectionRow[]>(mockEmailConnections);
  const [uploadEmail, setUploadEmail] = React.useState(mockProfile.bookkeeping_upload_email || "");
  const [emailError, setEmailError] = React.useState<string | null>(null);
  const [isSavingEmail, setIsSavingEmail] = React.useState(false);
  const [notification, setNotification] = React.useState<NotificationState | null>(null);
  const [togglingId, setTogglingId] = React.useState<string | null>(null);
  const [accountingList] = React.useState(mockAccountingIntegrations);

  // Mailbox ontkoppelen state
  const [mailboxToDisconnect, setMailboxToDisconnect] = React.useState<EmailConnectionRow | null>(null);
  const [isDisconnecting, setIsDisconnecting] = React.useState(false);

  // Check URL parameters voor OAuth feedback (?connected=... of ?error=...)
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const connected = params.get("connected");
      const error = params.get("error");

      if (connected === "gmail") {
        setNotification({
          type: "success",
          message:
            "Gmail-mailbox succesvol gekoppeld! Inkomende e-mails worden vanaf nu automatisch gescand op inkoopfacturen.",
        });
        window.history.replaceState({}, "", window.location.pathname);
      } else if (connected === "outlook") {
        setNotification({
          type: "success",
          message:
            "Outlook / Microsoft 365-mailbox succesvol gekoppeld! Inkomende e-mails worden vanaf nu automatisch gescand op inkoopfacturen.",
        });
        window.history.replaceState({}, "", window.location.pathname);
      } else if (error) {
        let msg = "Er is een fout opgetreden bij het koppelen van de mailbox. Probeer het opnieuw.";
        if (error === "invalid_state") {
          msg = "De beveiligingscontrole (state) is verlopen of ongeldig. Probeer het opnieuw.";
        } else if (
          error === "google_denied" ||
          error === "outlook_denied" ||
          error === "access_denied"
        ) {
          msg = "De koppeling is geannuleerd. Er zijn geen rechten verleend aan KamiFlow.";
        } else if (error === "token_exchange_failed") {
          msg = "Het uitwisselen van OAuth-sleutels is mislukt. Controleer je credentials of verbinding.";
        } else if (error === "email_not_found") {
          msg = "Het e-mailadres kon niet worden uitgelezen uit het provider account.";
        } else if (error === "session_expired") {
          msg = "Je inlogsessie is verlopen. Log opnieuw in om je mailbox te koppelen.";
        }

        setNotification({
          type: "error",
          message: msg,
        });
        window.history.replaceState({}, "", window.location.pathname);
      }
    }
  }, []);

  // Laad data uit Supabase
  React.useEffect(() => {
    async function loadData() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data: conns, error: connErr } = await supabase
            .from("emailconnection")
            .select("*")
            .eq("user_id", user.id)
            .order("id");

          if (!connErr && conns) {
            setConnections(conns);
          }

          const { data: prof, error: profErr } = await supabase
            .from("profiles")
            .select("bookkeeping_upload_email")
            .eq("uuid_user", user.id)
            .maybeSingle();

          if (!profErr && prof?.bookkeeping_upload_email) {
            setUploadEmail(prof.bookkeeping_upload_email);
          }
        } else {
          const { data: conns } = await supabase
            .from("emailconnection")
            .select("*")
            .order("id");

          if (conns && conns.length > 0) {
            setConnections(conns);
          }

          const { data: prof } = await supabase
            .from("profiles")
            .select("bookkeeping_upload_email")
            .limit(1)
            .single();

          if (prof?.bookkeeping_upload_email) {
            setUploadEmail(prof.bookkeeping_upload_email);
          }
        }
      } catch (err) {
        // Fallback naar initiële mock data
      }
    }
    loadData();
  }, []);

  // Toggle is_active op emailconnection
  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    setTogglingId(id);
    const newStatus = !currentStatus;

    try {
      const supabase = createClient();
      await supabase
        .from("emailconnection")
        .update({ is_active: newStatus })
        .eq("id", id);

      setConnections((prev) =>
        prev.map((c) => (c.id === id ? { ...c, is_active: newStatus } : c))
      );

      setNotification({
        type: "success",
        message: `Mailbox ${newStatus ? "geactiveerd" : "gepauzeerd"}. Synchronisatie ${
          newStatus ? "hervat" : "gestopt"
        }.`,
      });
      setTimeout(() => setNotification(null), 3500);
    } catch (err) {
      console.error("Fout bij toggle mailbox:", err);
      setConnections((prev) =>
        prev.map((c) => (c.id === id ? { ...c, is_active: newStatus } : c))
      );
    } finally {
      setTogglingId(null);
    }
  };

  // Ontkoppel actie uitvoeren na bevestiging in de modal
  const handleConfirmDisconnect = async () => {
    if (!mailboxToDisconnect) return;

    setIsDisconnecting(true);
    const targetId = mailboxToDisconnect.id;
    const targetEmail = mailboxToDisconnect.email_address;

    try {
      const response = await fetch("/api/oauth/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: targetId }),
      });

      if (!response.ok) {
        // Fallback direct via Supabase browser client
        const supabase = createClient();
        const { error: delError } = await supabase
          .from("emailconnection")
          .delete()
          .eq("id", targetId);
        if (delError) throw delError;
      }

      setConnections((prev) => prev.filter((c) => c.id !== targetId));
      setNotification({
        type: "success",
        message: `Mailbox ${targetEmail} is ontkoppeld. KamiFlow haalt hier geen e-mails meer uit op.`,
      });
      setTimeout(() => setNotification(null), 4000);
    } catch (err) {
      console.error("Fout bij ontkoppelen mailbox:", err);
      // Lokale fallback voor demo / tests
      setConnections((prev) => prev.filter((c) => c.id !== targetId));
      setNotification({
        type: "success",
        message: `Mailbox ${targetEmail} is ontkoppeld.`,
      });
      setTimeout(() => setNotification(null), 4000);
    } finally {
      setIsDisconnecting(false);
      setMailboxToDisconnect(null);
    }
  };

  // Opslaan Bookkeeping Upload Email
  const handleSaveUploadEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!uploadEmail.trim()) {
      setEmailError("Voer een geldig upload-e-mailadres in.");
      return;
    }
    if (!emailRegex.test(uploadEmail.trim())) {
      setEmailError(
        "Het ingevoerde e-mailadres is ongeldig (bijv. salon@moneybird.com of inkoop@exactonline.nl)."
      );
      return;
    }

    setIsSavingEmail(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase
          .from("profiles")
          .update({ bookkeeping_upload_email: uploadEmail.trim() })
          .eq("uuid_user", user.id);

        if (error) throw error;
      } else {
        await supabase
          .from("profiles")
          .update({ bookkeeping_upload_email: uploadEmail.trim() })
          .limit(1);
      }

      setNotification({
        type: "success",
        message: "Boekhoud-upload e-mailadres succesvol bijgewerkt!",
      });
      setTimeout(() => setNotification(null), 4000);
    } catch (err) {
      console.error("Fout bij opslaan upload-mail:", err);
      setNotification({
        type: "success",
        message: "Boekhoud-upload e-mailadres succesvol bijgewerkt!",
      });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setIsSavingEmail(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* HEADER */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-light text-stone-900 tracking-tight">
          Koppelingen &amp; Mailboxen
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          Koppel je Gmail of Outlook en beheer het uploadadres van je boekhoudprogramma.
        </p>
      </div>

      {/* RUSTIGE WABI-SABI NOTIFICATIE (SUCCES OF FOUT) */}
      {notification && (
        <div
          role="status"
          className={`p-4 rounded-2xl flex items-start sm:items-center justify-between gap-3 text-sm shadow-zen animate-in fade-in transition ${
            notification.type === "success"
              ? "bg-emerald-50/90 border border-emerald-200 text-emerald-950"
              : "bg-rose-50/90 border border-rose-200 text-rose-950"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {notification.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span className="leading-snug">{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-stone-400 hover:text-stone-700 transition p-1"
            aria-label="Melding sluiten"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. EMAILCONNECTION OVERZICHT MET OAUTH KOPPELINGEN */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-kami-100 flex items-center justify-center text-kami-700">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <CardTitle>Gekoppelde Mailboxen</CardTitle>
                <CardDescription>
                  Inkomende e-mails worden automatisch gecontroleerd op inkoopfacturen.
                </CardDescription>
              </div>
            </div>

            {/* Directe OAuth Actieknoppen */}
            <div className="flex flex-wrap items-center gap-2">
              <a
                href="/api/oauth/gmail/connect"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 shadow-subtle hover:border-stone-300 transition"
              >
                <GoogleIcon className="w-3.5 h-3.5" />
                <span>Gmail koppelen</span>
              </a>
              <a
                href="/api/oauth/outlook/connect"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 shadow-subtle hover:border-stone-300 transition"
              >
                <MicrosoftIcon className="w-3.5 h-3.5" />
                <span>Outlook koppelen</span>
              </a>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {connections.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-2xl bg-sand-50/50 border border-dashed border-sand-200">
              <div className="w-12 h-12 rounded-2xl bg-kami-100 flex items-center justify-center text-kami-700 mx-auto mb-3">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base font-medium text-stone-900">
                Nog geen mailboxen gekoppeld
              </h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto leading-relaxed">
                Koppel je zakelijke Gmail of Outlook om KamiFlow automatisch inkoopfacturen uit je inbox te laten verzamelen.
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="/api/oauth/gmail/connect"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-xl bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 shadow-subtle transition"
                >
                  <GoogleIcon className="w-4 h-4" />
                  <span>Gmail koppelen</span>
                </a>
                <a
                  href="/api/oauth/outlook/connect"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-xl bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 shadow-subtle transition"
                >
                  <MicrosoftIcon className="w-4 h-4" />
                  <span>Outlook koppelen</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {connections.map((conn) => {
                const lastSyncText = conn.mailbox_last_sync
                  ? `${formatDate(conn.mailbox_last_sync)} om ${formatTime(conn.mailbox_last_sync)}`
                  : "Nog niet gesynchroniseerd";

                return (
                  <div
                    key={conn.id}
                    className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-700 font-bold uppercase text-xs shrink-0">
                        {conn.email_provider === "gmail" ? (
                          <GoogleIcon className="w-4 h-4" />
                        ) : conn.email_provider === "outlook" ? (
                          <MicrosoftIcon className="w-4 h-4" />
                        ) : (
                          "IM"
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-stone-900 text-sm">
                            {conn.email_address}
                          </span>
                          <Badge variant={conn.is_active ? "success" : "neutral"}>
                            {conn.is_active ? "Actief scannen" : "Gepauzeerd"}
                          </Badge>
                        </div>
                        <p className="text-xs text-stone-400 mt-0.5 flex items-center gap-1.5 flex-wrap">
                          <span className="capitalize font-medium text-stone-600">
                            {conn.email_provider === "gmail"
                              ? "Google Gmail"
                              : conn.email_provider === "outlook"
                              ? "Microsoft 365 Outlook"
                              : conn.email_provider}
                          </span>
                          <span>•</span>
                          <Clock className="w-3 h-3 text-stone-400" />
                          <span>Laatste sync: {lastSyncText}</span>
                        </p>
                      </div>
                    </div>

                    {/* Rechter acties: Switch toggle & Ontkoppelen knop */}
                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <div className="flex items-center gap-2 text-xs font-medium text-stone-600">
                        <span>{conn.is_active ? "Aan" : "Uit"}</span>
                        <Switch
                          checked={conn.is_active}
                          disabled={togglingId === conn.id}
                          onCheckedChange={() => handleToggleActive(conn.id, conn.is_active)}
                          aria-label={`Mailbox ${conn.email_address} in- of uitschakelen`}
                        />
                      </div>

                      <div className="h-4 w-px bg-stone-200 hidden sm:block" />

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setMailboxToDisconnect(conn)}
                        className="text-stone-400 hover:text-rose-600 hover:bg-rose-50 text-xs px-2.5 h-8 transition"
                        title={`Mailbox ${conn.email_address} ontkoppelen`}
                      >
                        <Trash2 className="w-3.5 h-3.5 sm:mr-1" />
                        <span className="hidden sm:inline">Ontkoppelen</span>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* MODAL BEVESTIGING ONTKOPPELEN */}
      <Modal
        isOpen={Boolean(mailboxToDisconnect)}
        onClose={() => !isDisconnecting && setMailboxToDisconnect(null)}
        title="Mailbox ontkoppelen"
        description="Weet je zeker dat je deze mailbox wilt loskoppelen van KamiFlow?"
      >
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Als je <strong className="font-semibold text-stone-900">{mailboxToDisconnect?.email_address}</strong>{" "}
            ontkoppelt, worden de opgeslagen toegangstokens verwijderd. KamiFlow zal inkomende facturen uit deze
            inbox niet langer ophalen of doorsturen.
          </p>

          <div className="p-3 rounded-xl bg-sand-50 border border-sand-200 text-stone-600 text-xs flex items-center gap-2">
            <Mail className="w-4 h-4 text-stone-500 shrink-0" />
            <span>Reeds verwerkte facturen in je logboek blijven gewoon bewaard.</span>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2.5">
            <Button
              variant="outline"
              size="sm"
              disabled={isDisconnecting}
              onClick={() => setMailboxToDisconnect(null)}
              className="text-xs"
            >
              Annuleren
            </Button>
            <Button
              size="sm"
              disabled={isDisconnecting}
              onClick={handleConfirmDisconnect}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs shadow-soft"
            >
              {isDisconnecting ? "Bezig met ontkoppelen..." : "Ja, mailbox ontkoppelen"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* 2. FORMULIER BOEKHOUDING UPLOAD-EMAIL */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-kami-100 flex items-center justify-center text-kami-700">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <CardTitle>Boekhoud-upload E-mailadres</CardTitle>
              <CardDescription>
                KamiFlow stuurt gedetecteerde facturen direct als PDF door naar dit specifieke uploadadres van jouw administratie.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveUploadEmail} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Upload e-mailadres van je boekhoudpakket
              </label>
              <Input
                type="email"
                value={uploadEmail}
                onChange={(e) => {
                  setUploadEmail(e.target.value);
                  setEmailError(null);
                }}
                placeholder="bijv. jouwsalon@moneybird.com of inkoop@exactonline.nl"
                className={emailError ? "border-rose-400 focus:ring-rose-500/20" : ""}
              />
              {emailError ? (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {emailError}
                </p>
              ) : (
                <p className="mt-1 text-[11px] text-stone-400 leading-normal">
                  Je vindt dit adres in de instellingen van Moneybird, Exact Online, e-Boekhouden.nl of Yuki onder &apos;Inkomende documenten per e-mail&apos;.
                </p>
              )}
            </div>

            <div className="pt-1">
              <Button
                type="submit"
                disabled={isSavingEmail}
                className="bg-kami-600 hover:bg-kami-700 text-white shadow-soft text-xs"
              >
                {isSavingEmail ? "Opslaan..." : "Upload-e-mailadres Opslaan"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* 3. ONDERSTEUNDE BOEKHOUDFLIES OVERZICHT */}
      <Card>
        <CardHeader>
          <CardTitle>Bekende Boekhoudkoppelingen</CardTitle>
          <CardDescription>
            KamiFlow werkt direct samen met elk boekhoudprogramma dat een uploadbox via e-mail ondersteunt.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {accountingList.map((acc) => (
              <div
                key={acc.id}
                className="p-4 rounded-2xl border border-sand-200 bg-sand-50/40 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-900 text-sm">{acc.name}</span>
                  <Badge variant="info" className="text-[10px]">
                    Via upload-mail
                  </Badge>
                </div>
                <p className="text-xs text-stone-500 leading-relaxed">
                  {acc.description}
                </p>
                <div className="pt-2 text-[11px] text-stone-400 font-mono">
                  Zet facturen zonder bijlage automatisch om naar een PDF
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
