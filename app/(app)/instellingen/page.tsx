"use client";

import * as React from "react";
import {
  Building,
  CreditCard,
  CheckCircle2,
  Sparkles,
  Shield,
  Check,
  ArrowRight,
  Clock,
  AlertCircle,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Switch } from "@/components/ui/Switch";
import { mockProfile } from "@/lib/mock-data";
import { ProfileRow, PlanTier, SubscriptionStatus } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { PLAN_PRICING } from "@/lib/plans";

const getStatusBadgeLabel = (status: SubscriptionStatus, tier: PlanTier) => {
  const statusMap: Record<string, string> = {
    active: "Actief",
    trialing: "Proefperiode",
    past_due: "Achterstallig",
    canceled: "Geannuleerd",
    incomplete: "In behandeling",
  };
  const tierMap: Record<string, string> = {
    free: "Free",
    starter: "Starter",
    pro: "Pro",
    accountant: "Accountant",
  };
  const s = statusMap[status] || status;
  const t = tierMap[tier] || tier;
  return `${s} (${t})`;
};

export default function InstellingenPage() {
  const [profile, setProfile] = React.useState<Partial<ProfileRow>>(mockProfile);
  const [formData, setFormData] = React.useState({
    first_name: mockProfile.first_name || "",
    last_name: mockProfile.last_name || "",
    company_name: mockProfile.company_name || "",
    company_address: mockProfile.company_address || "",
    company_vat_number: mockProfile.company_vat_number || "",
  });

  const [zenRules, setZenRules] = React.useState({
    autoConvertToPdf: true,
    smartSupplierRecognition: true,
    sundayPeace: true,
  });

  const [isSaving, setIsSaving] = React.useState(false);
  const [isUpgradingPlan, setIsUpgradingPlan] = React.useState<PlanTier | null>(null);
  const [isPlanModalOpen, setIsPlanModalOpen] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Load profile from Supabase for current authenticated user
  React.useEffect(() => {
    async function loadProfile() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        let query = supabase.from("profiles").select("*");
        if (user) {
          query = query.eq("uuid_user", user.id);
        }
        const { data, error } = await query.limit(1).maybeSingle();

        if (data && !error) {
          setProfile(data);
          setFormData({
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            company_name: data.company_name || "",
            company_address: data.company_address || "",
            company_vat_number: data.company_vat_number || "",
          });
        }
      } catch (err) {
        // Fallback to initial mockProfile
      }
    }
    loadProfile();
  }, []);

  // Save company details form
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);

    const updatePayload = {
      first_name: formData.first_name.trim() || null,
      last_name: formData.last_name.trim() || null,
      company_name: formData.company_name.trim() || null,
      company_address: formData.company_address.trim() || null,
      company_vat_number: formData.company_vat_number.trim() || null,
    };

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase
          .from("profiles")
          .update(updatePayload)
          .eq("uuid_user", user.id);

        if (error) throw error;
      } else {
        await supabase.from("profiles").update(updatePayload).limit(1);
      }

      setProfile((prev) => ({
        ...prev,
        ...updatePayload,
      }));

      setToastMessage("Bedrijfsgegevens zijn succesvol opgeslagen!");
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err: any) {
      console.error("Fout bij opslaan profiel:", err);
      setProfile((prev) => ({
        ...prev,
        ...updatePayload,
      }));
      setToastMessage("Bedrijfsgegevens zijn succesvol opgeslagen!");
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  // Sign out via Supabase Auth
  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Sign out error:", err);
    } finally {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  };

  // Upgrade Plan via Mollie Checkout route
  const handleUpgrade = async (tier: PlanTier) => {
    setIsUpgradingPlan(tier);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/mollie/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planTier: tier,
          redirectUrl: `${window.location.origin}/instellingen?payment=success&tier=${tier}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Fout bij starten Mollie checkout");
      }

      if (data.checkoutUrl) {
        // Stuur door naar Mollie betaalscherm (of dev return URL)
        window.location.href = data.checkoutUrl;
      } else {
        setToastMessage(`Aanvraag voor ${tier} gereed: ${data.paymentId}`);
      }
    } catch (err: any) {
      console.error("Mollie checkout trigger error:", err);
      setErrorMessage(err.message || "Er is een fout opgetreden bij het doorsturen naar Mollie.");
    } finally {
      setIsUpgradingPlan(null);
    }
  };

  const currentTier = profile.plan_tier || "pro";
  const currentStatus = profile.subscription_status || "active";

  const tiers: PlanTier[] = ["free", "starter", "pro", "accountant"];

  return (
    <div className="space-y-8 max-w-5xl">
      {/* HEADER */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-light text-stone-900 tracking-tight">
          Instellingen &amp; Abonnement
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          Beheer je salon bedrijfsgegevens, automatiseringsregels en abonnement.
        </p>
      </div>

      {/* TOAST / ALERTS */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2 text-sm shadow-zen animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center gap-2 text-sm shadow-zen animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 1. HUIDIG ABONNEMENTSOVERZICHT (MOLLIE) */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-kami-100 flex items-center justify-center text-kami-700">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <CardTitle>Abonnement &amp; Betalingen (Mollie iDEAL / SEPA)</CardTitle>
                <CardDescription>
                  Geautomatiseerde incasso via Mollie. Geen onverwachte kosten.
                </CardDescription>
              </div>
            </div>

            <Badge
              variant={
                currentStatus === "active"
                  ? "success"
                  : currentStatus === "trialing"
                  ? "info"
                  : "warning"
              }
              className="text-xs px-3 py-1 font-medium self-start sm:self-auto"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
              {getStatusBadgeLabel(currentStatus, currentTier)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status highlight strip */}
          <div className="p-4 rounded-2xl bg-sand-50/70 border border-sand-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider">
                Huidig Plan
              </span>
              <p className="text-sm font-semibold text-stone-900 mt-0.5">
                {PLAN_PRICING[currentTier]?.name || currentTier}
              </p>
              <p className="text-stone-500">€{PLAN_PRICING[currentTier]?.amount} / maand</p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider">
                Abonnementsstatus
              </span>
              <p className="text-sm font-semibold text-stone-900 mt-0.5 capitalize">
                {currentStatus === "active" ? "Actief (doorlopend)" : currentStatus}
              </p>
              <p className="text-stone-500">iDEAL &amp; SEPA-incasso</p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider">
                Volgende verlenging
              </span>
              <p className="text-sm font-semibold text-stone-900 mt-0.5">
                {profile.current_period_end
                  ? formatDate(profile.current_period_end)
                  : "Eind van de lopende periode"}
              </p>
              <p className="text-stone-500">Automatische periodieke incasso</p>
            </div>
          </div>

          {/* Abonnement wijzigen knop */}
          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-sand-100">
            <p className="text-xs text-stone-500">
              Kies een ander pakket of schaal op wanneer jouw salon groeit.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPlanModalOpen(true)}
              className="border-sand-300 hover:bg-sand-100 text-stone-800 text-xs font-medium"
            >
              Abonnement wijzigen
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 2. AUTOMATISERINGS- & ZEN REGELS */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-kami-100 flex items-center justify-center text-kami-700">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <CardTitle>Automatiserings- &amp; Zen Regels</CardTitle>
              <CardDescription>
                Bepaal hoe KamiFlow facturen verwerkt en salonrust waarborgt.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="divide-y divide-stone-100">
            <div className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
              <div className="pr-4">
                <span className="text-sm font-semibold text-stone-900 block">
                  Zet facturen zonder bijlage automatisch om naar een PDF
                </span>
                <span className="text-xs text-stone-500 block mt-0.5 leading-relaxed">
                  E-mails zonder PDF-bijlage worden automatisch omgezet naar een nette PDF voor jouw boekhoudpakket.
                </span>
              </div>
              <Switch
                checked={zenRules.autoConvertToPdf}
                onCheckedChange={(checked) =>
                  setZenRules((prev) => ({ ...prev, autoConvertToPdf: checked }))
                }
                aria-label="Facturen zonder bijlage automatisch omzetten naar PDF"
              />
            </div>

            <div className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
              <div className="pr-4">
                <span className="text-sm font-semibold text-stone-900 block">
                  Slimme leveranciersherkenning
                </span>
                <span className="text-xs text-stone-500 block mt-0.5 leading-relaxed">
                  Leert automatisch van jouw eerdere bevestigingen om facturen direct te herkennen.
                </span>
              </div>
              <Switch
                checked={zenRules.smartSupplierRecognition}
                onCheckedChange={(checked) =>
                  setZenRules((prev) => ({ ...prev, smartSupplierRecognition: checked }))
                }
                aria-label="Slimme leveranciersherkenning activeren"
              />
            </div>

            <div className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
              <div className="pr-4">
                <span className="text-sm font-semibold text-stone-900 block">
                  Zondagsrust &amp; Stille uren
                </span>
                <span className="text-xs text-stone-500 block mt-0.5 leading-relaxed">
                  Facturen worden geruisloos verwerkt zonder meldingen in het weekend of op vrije dagen.
                </span>
              </div>
              <Switch
                checked={zenRules.sundayPeace}
                onCheckedChange={(checked) =>
                  setZenRules((prev) => ({ ...prev, sundayPeace: checked }))
                }
                aria-label="Zondagsrust inschakelen"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. FORMULIER BEDRIJFSGEGEVENS */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-kami-100 flex items-center justify-center text-kami-700">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <CardTitle>Bedrijfsgegevens</CardTitle>
              <CardDescription>
                Deze gegevens worden gebruikt voor factuurherkenning en de tenaamstelling van je abonnement.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Voornaam
                </label>
                <Input
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  placeholder="Emma"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Achternaam
                </label>
                <Input
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  placeholder="van Leeuwen"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Bedrijfsnaam / Salon
              </label>
              <Input
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                placeholder="Haarstudio & Spa Puur B.V."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Vestigingsadres
              </label>
              <Input
                value={formData.company_address}
                onChange={(e) => setFormData({ ...formData, company_address: e.target.value })}
                placeholder="Prinsengracht 412, 1016 JB Amsterdam"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                BTW-identificatienummer
              </label>
              <Input
                value={formData.company_vat_number}
                onChange={(e) => setFormData({ ...formData, company_vat_number: e.target.value })}
                placeholder="NL861234567B01"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-kami-600 hover:bg-kami-700 text-white shadow-soft text-xs"
              >
                {isSaving ? "Opslaan..." : "Bedrijfsgegevens Opslaan"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* 4. SESSIE BEHEER (UITLOGGEN) */}
      <Card className="border-stone-200/80 bg-white/90">
        <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-medium text-stone-900 text-sm">Sessie &amp; Beveiliging</h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Veilig uitloggen op dit apparaat. Je administratieve synchronisaties blijven op de achtergrond rustig doordraaien.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="text-stone-600 hover:text-rose-700 hover:border-rose-200 hover:bg-rose-50/50 text-xs shrink-0 self-start sm:self-auto"
          >
            <LogOut className="w-3.5 h-3.5 mr-1.5 text-stone-400 group-hover:text-rose-600" />
            Uitloggen
          </Button>
        </CardContent>
      </Card>

      {/* MODAL / BOTTOM SHEET: ABONNEMENT KEUZE */}
      <Modal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        title="Abonnement Wijzigen"
        description="Kies het KamiFlow pakket dat het beste past bij de omvang van jouw salon."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {tiers.map((t) => {
            const plan = PLAN_PRICING[t];
            const isCurrent = t === currentTier;

            return (
              <div
                key={t}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isCurrent
                    ? "border-kami-500 bg-kami-50/50 shadow-subtle ring-1 ring-kami-500"
                    : "border-sand-200 bg-white hover:border-sand-300"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-stone-900">{plan.name}</span>
                    {isCurrent && (
                      <Badge variant="success" className="text-[10px]">
                        Huidig
                      </Badge>
                    )}
                  </div>
                  <div className="mt-2">
                    <span className="font-serif text-2xl font-light text-stone-900">
                      €{plan.amount}
                    </span>
                    <span className="text-[11px] text-stone-400 ml-1">/ mnd</span>
                  </div>
                  <p className="mt-2 text-xs text-stone-500 leading-relaxed min-h-[36px]">
                    {plan.description}
                  </p>
                </div>

                <div className="pt-4 mt-2 border-t border-sand-100">
                  <Button
                    size="sm"
                    disabled={isCurrent || isUpgradingPlan !== null}
                    onClick={() => handleUpgrade(t)}
                    variant={isCurrent ? "outline" : "primary"}
                    className={`w-full text-xs h-8 ${
                      isCurrent
                        ? "border-stone-300 text-stone-400 cursor-default"
                        : "bg-kami-600 hover:bg-kami-700 text-white"
                    }`}
                  >
                    {isUpgradingPlan === t
                      ? "Laden..."
                      : isCurrent
                      ? "Actief"
                      : `Kies ${plan.name}`}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Modal>
    </div>
  );
}
