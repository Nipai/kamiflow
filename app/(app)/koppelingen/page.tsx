"use client";

import * as React from "react";
import {
  Mail,
  Building,
  CheckCircle2,
  RefreshCw,
  Plus,
  Check,
  AlertCircle,
  HelpCircle,
  Clock,
  Sparkles,
  Link2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/Switch";
import { mockMailboxes, mockAccountingIntegrations, mockEmailConnections, mockProfile } from "@/lib/mock-data";
import { EmailConnectionRow, ProfileRow } from "@/lib/types";
import { formatDate, formatTime } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

export default function KoppelingenPage() {
  const [connections, setConnections] = React.useState<EmailConnectionRow[]>(mockEmailConnections);
  const [uploadEmail, setUploadEmail] = React.useState(mockProfile.bookkeeping_upload_email || "");
  const [emailError, setEmailError] = React.useState<string | null>(null);
  const [isSavingEmail, setIsSavingEmail] = React.useState(false);
  const [savedNotice, setSavedNotice] = React.useState<string | null>(null);
  const [togglingId, setTogglingId] = React.useState<string | null>(null);
  const [accountingList, setAccountingList] = React.useState(mockAccountingIntegrations);

  // Load from Supabase
  React.useEffect(() => {
    async function loadData() {
      try {
        const supabase = createClient();
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
      } catch (err) {
        // Fallback to mock data
      }
    }
    loadData();
  }, []);

  // Toggle is_active on emailconnection
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

      setSavedNotice(
        `Mailbox ${newStatus ? "geactiveerd" : "gepauzeerd"}. Synchronisatie ${
          newStatus ? "hervat" : "gestopt"
        }.`
      );
      setTimeout(() => setSavedNotice(null), 3000);
    } catch (err) {
      console.error("Fout bij toggle mailbox:", err);
      // Fallback local update
      setConnections((prev) =>
        prev.map((c) => (c.id === id ? { ...c, is_active: newStatus } : c))
      );
    } finally {
      setTogglingId(null);
    }
  };

  // Save Bookkeeping Upload Email with Validation
  const handleSaveUploadEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);

    // E-mailvalidatie regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!uploadEmail.trim()) {
      setEmailError("Voer een geldig upload-e-mailadres in.");
      return;
    }
    if (!emailRegex.test(uploadEmail.trim())) {
      setEmailError("Het ingevoerde e-mailadres is ongeldig (bijv. salon@moneybird.com of inkoop@exactonline.nl).");
      return;
    }

    setIsSavingEmail(true);
    try {
      const supabase = createClient();
      await supabase
        .from("profiles")
        .update({ bookkeeping_upload_email: uploadEmail.trim() })
        .limit(1);

      setSavedNotice("Boekhoud-upload e-mailadres succesvol bijgewerkt!");
      setTimeout(() => setSavedNotice(null), 4000);
    } catch (err) {
      console.error("Fout bij opslaan upload-mail:", err);
      setSavedNotice("Upload-e-mailadres lokaal opgeslagen!");
      setTimeout(() => setSavedNotice(null), 3000);
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
          Beheer inkomende e-mailaccounts en het uploadadres van je boekhoudpakket.
        </p>
      </div>

      {/* TOAST SUCCESS NOTIFICATION */}
      {savedNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2 text-sm shadow-zen animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{savedNotice}</span>
        </div>
      )}

      {/* 1. EMAILCONNECTION OVERZICHT MET TOGGLE */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
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
            <Button variant="outline" size="sm" className="hidden sm:inline-flex text-xs">
              <Plus className="w-3.5 h-3.5 mr-1" />
              Nieuwe Mailbox
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
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
                    <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-700 font-bold uppercase text-xs">
                      {conn.email_provider === "gmail" ? "G" : conn.email_provider === "outlook" ? "O" : "IM"}
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
                      <p className="text-xs text-stone-400 mt-0.5 flex items-center gap-1.5">
                        <span className="capitalize">{conn.email_provider}</span>
                        <span>•</span>
                        <Clock className="w-3 h-3 text-stone-400" />
                        <span>Laatste sync: {lastSyncText}</span>
                      </p>
                    </div>
                  </div>

                  {/* Custom Toggle Switch */}
                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <div className="flex items-center gap-2.5 text-xs font-medium text-stone-600">
                      <span>{conn.is_active ? "Aan" : "Uit"}</span>
                      <Switch
                        checked={conn.is_active}
                        disabled={togglingId === conn.id}
                        onCheckedChange={() => handleToggleActive(conn.id, conn.is_active)}
                        aria-label={`Mailbox ${conn.email_address} in- of uitschakelen`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

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
                    E-mail Passthrough
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
