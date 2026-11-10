"use client";

import * as React from "react";
import {
  Mail,
  CheckCircle2,
  Building,
  Bell,
  Sliders,
  RefreshCw,
  Plus,
  Check,
  Shield,
  HelpCircle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { mockMailboxes, mockAccountingIntegrations, mockSalonProfile } from "@/lib/mock-data";

export default function SettingsPage() {
  const [salonName, setSalonName] = React.useState(mockSalonProfile.name);
  const [contactPerson, setContactPerson] = React.useState(mockSalonProfile.owner);
  const [emailAddress, setEmailAddress] = React.useState(mockSalonProfile.email);

  // Settings toggles
  const [autoForwardHighConfidence, setAutoForwardHighConfidence] = React.useState(true);
  const [notifyOnMissed, setNotifyOnMissed] = React.useState(true);
  const [weeklyDigest, setWeeklyDigest] = React.useState(true);
  const [accountingList, setAccountingList] = React.useState(mockAccountingIntegrations);

  const [savedNotice, setSavedNotice] = React.useState(false);

  const handleToggleAccounting = (id: string) => {
    setAccountingList((prev) =>
      prev.map((acc) => {
        if (acc.id === id) {
          return {
            ...acc,
            status: acc.status === "connected" ? "disconnected" : "connected",
            accountName: acc.status === "connected" ? undefined : `${salonName} Administratie`,
          };
        }
        return acc;
      })
    );
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* HEADER */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-light text-stone-900 tracking-tight">
          Instellingen &amp; Koppelingen
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          Beheer je gekoppelde mailboxen, boekhoudsoftware en herkenningsregels.
        </p>
      </div>

      {savedNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2 text-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Instellingen zijn succesvol opgeslagen!</span>
        </div>
      )}

      {/* 1. MAILBOX KOPPELINGEN */}
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
                  Inkomende e-mails van deze adressen worden automatisch geanalyseerd op facturen.
                </CardDescription>
              </div>
            </div>
            <Button variant="outline" size="sm" className="hidden sm:inline-flex">
              <Plus className="w-3.5 h-3.5 mr-1" />
              Mailbox toevoegen
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="divide-y divide-stone-100">
            {mockMailboxes.map((mb) => (
              <div
                key={mb.id}
                className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-700 font-bold uppercase text-xs">
                    {mb.provider === "gmail" ? "G" : "O"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-stone-900 text-sm">{mb.email}</span>
                      <Badge variant="success">Actief</Badge>
                    </div>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {mb.provider === "gmail" ? "Google Workspace / Gmail" : "Microsoft Outlook 365"} •
                      Laatste sync: {mb.lastSync}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Button variant="outline" size="sm" className="text-xs h-8">
                    <RefreshCw className="w-3 h-3 mr-1 text-stone-400" />
                    Sync
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs h-8 text-stone-500 hover:text-stone-800">
                    Beheer
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 sm:hidden">
            <Button variant="outline" size="sm" className="w-full">
              <Plus className="w-3.5 h-3.5 mr-1" />
              Extra mailbox toevoegen
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 2. BOEKHOUDSOFTWARE KOPPELINGEN */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-kami-100 flex items-center justify-center text-kami-700">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <CardTitle>Boekhoudpakket Koppeling</CardTitle>
              <CardDescription>
                Kies naar welk boekhoudprogramma KamiFlow automatisch facturen moet doorsluizen.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accountingList.map((acc) => {
              const isConnected = acc.status === "connected";
              return (
                <div
                  key={acc.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isConnected
                      ? "border-kami-400/80 bg-kami-50/40 shadow-subtle"
                      : "border-stone-200/80 bg-white hover:border-stone-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-stone-900 text-sm flex items-center gap-2">
                        {acc.name}
                        {isConnected && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        )}
                      </h4>
                      <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                        {acc.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-xs text-stone-400">
                      {isConnected ? (
                        <span className="text-emerald-700 font-medium flex items-center gap-1">
                          <Check className="w-3 h-3" /> Gekoppeld
                        </span>
                      ) : (
                        "Niet gekoppeld"
                      )}
                    </span>
                    <Button
                      size="sm"
                      variant={isConnected ? "outline" : "primary"}
                      onClick={() => handleToggleAccounting(acc.id)}
                      className="text-xs h-8"
                    >
                      {isConnected ? "Ontkoppelen" : "Koppelen"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 3. FACTUUR MATCHING REGELS */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-kami-100 flex items-center justify-center text-kami-700">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <CardTitle>Automatiserings- &amp; Zen Regels</CardTitle>
              <CardDescription>
                Bepaal hoe zelfstandig KamiFlow beslissingen neemt bij inkomende e-mails.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Rule 1 */}
          <div className="flex items-start justify-between gap-4 py-2">
            <div>
              <p className="text-sm font-medium text-stone-900">
                Automatisch doorsturen bij hoge betrouwbaarheid (&gt;90%)
              </p>
              <p className="text-xs text-stone-500 mt-0.5">
                Inkoopfacturen van bekende beauty leveranciers worden zonder handmatige tussenkomst doorgestuurd.
              </p>
            </div>
            <input
              type="checkbox"
              checked={autoForwardHighConfidence}
              onChange={(e) => setAutoForwardHighConfidence(e.target.checked)}
              className="mt-1 h-5 w-5 rounded border-stone-300 text-kami-600 focus:ring-kami-500"
            />
          </div>

          {/* Rule 2 */}
          <div className="flex items-start justify-between gap-4 py-2 border-t border-stone-100">
            <div>
              <p className="text-sm font-medium text-stone-900">
                Waarschuwing bij twijfelgevallen of ontbrekende bijlagen
              </p>
              <p className="text-xs text-stone-500 mt-0.5">
                Plaats e-mails die mogelijk een factuur zijn direct onder &lsquo;Aandacht vereist&rsquo; in het dashboard.
              </p>
            </div>
            <input
              type="checkbox"
              checked={notifyOnMissed}
              onChange={(e) => setNotifyOnMissed(e.target.checked)}
              className="mt-1 h-5 w-5 rounded border-stone-300 text-kami-600 focus:ring-kami-500"
            />
          </div>

          {/* Rule 3 */}
          <div className="flex items-start justify-between gap-4 py-2 border-t border-stone-100">
            <div>
              <p className="text-sm font-medium text-stone-900">
                Wekelijkse rust-samenvatting op zondagavond
              </p>
              <p className="text-xs text-stone-500 mt-0.5">
                Ontvang een kort overzicht van alle verwerkte inkoopfacturen zodat je week fris en overzichtelijk begint.
              </p>
            </div>
            <input
              type="checkbox"
              checked={weeklyDigest}
              onChange={(e) => setWeeklyDigest(e.target.checked)}
              className="mt-1 h-5 w-5 rounded border-stone-300 text-kami-600 focus:ring-kami-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* 4. SALON GEGEVENS */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-kami-100 flex items-center justify-center text-kami-700">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <CardTitle>Salon Profiel</CardTitle>
              <CardDescription>
                Jouw contactgegevens voor facturatie en support.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Salonnaam"
                value={salonName}
                onChange={(e) => setSalonName(e.target.value)}
                required
              />
              <Input
                label="Eigenaar / Contactpersoon"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                label="E-mailadres voor meldingen"
                type="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                required
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" size="sm" className="shadow-subtle">
                Wijzigingen Opslaan
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
