"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  Inbox,
  Settings,
  LogOut,
  RefreshCw,
  FileText,
  Link2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockProfile, mockSalonProfile } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/client";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [syncNotice, setSyncNotice] = React.useState<string | null>(null);
  const [profile, setProfile] = React.useState({
    companyName: mockProfile.company_name || mockSalonProfile.name,
    ownerName: `${mockProfile.first_name} ${mockProfile.last_name}`.trim() || mockSalonProfile.owner,
    uploadEmail: mockProfile.bookkeeping_upload_email || mockSalonProfile.defaultUploadEmail,
  });

  React.useEffect(() => {
    async function loadProfile() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("profiles")
          .select("company_name, first_name, last_name, bookkeeping_upload_email")
          .limit(1)
          .single();

        if (!error && data) {
          setProfile({
            companyName: data.company_name || mockSalonProfile.name,
            ownerName: `${data.first_name || ""} ${data.last_name || ""}`.trim() || mockSalonProfile.owner,
            uploadEmail: data.bookkeeping_upload_email || mockSalonProfile.defaultUploadEmail,
          });
        }
      } catch (err) {
        // Fallback to initial state
      }
    }
    loadProfile();
  }, []);

  const navItems = [
    {
      name: "Overzicht",
      shortLabel: "Overzicht",
      href: "/dashboard",
      icon: Inbox,
      exact: true,
    },
    {
      name: "Facturen Logboek",
      shortLabel: "Facturen",
      href: "/facturen",
      icon: FileText,
      exact: false,
    },
    {
      name: "Koppelingen",
      shortLabel: "Koppelingen",
      href: "/koppelingen",
      icon: Link2,
      exact: false,
    },
    {
      name: "Instellingen & Abonnement",
      shortLabel: "Instellingen",
      href: "/instellingen",
      icon: Settings,
      exact: false,
    },
  ];

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncNotice("Mailboxen gesynchroniseerd!");
      setTimeout(() => setSyncNotice(null), 3000);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col md:flex-row">
      {/* DESKTOP SIDEBAR (>= md) */}
      <aside className="hidden md:flex md:w-64 flex-col bg-white border-r border-stone-200/80 p-6 justify-between shrink-0">
        <div className="space-y-8">
          {/* Brand */}
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-kami-600 flex items-center justify-center text-white shadow-soft group-hover:bg-kami-700 transition">
              <Sparkles className="w-5 h-5 text-kami-100" />
            </div>
            <div>
              <span className="font-serif text-xl font-medium text-stone-900 tracking-tight">
                Kami<span className="text-kami-600 font-normal italic">Flow</span>
              </span>
              <p className="text-[10px] text-stone-400 uppercase tracking-widest font-medium">
                Zen Dashboard
              </p>
            </div>
          </Link>

          {/* Salon Card */}
          <div className="p-3.5 rounded-2xl bg-kami-50/60 border border-kami-100">
            <p className="text-xs font-semibold text-stone-800 truncate">
              {profile.companyName}
            </p>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-kami-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Matching actief</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1.5" aria-label="Zijbalknavigatie">
            {navItems.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                    isActive
                      ? "bg-kami-600 text-white shadow-subtle"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100/70"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4",
                      isActive ? "text-white" : "text-stone-400"
                    )}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info & Logout */}
        <div className="space-y-4 pt-6 border-t border-stone-100 text-xs">
          <div className="flex items-center justify-between text-stone-500">
            <span>Upload-mail:</span>
            <span className="font-medium text-stone-800 truncate max-w-[120px]" title={profile.uploadEmail}>
              {profile.uploadEmail ? profile.uploadEmail.split("@")[0] : "Niet ingesteld"}
            </span>
          </div>

          <Link
            href="/"
            className="flex items-center gap-2 text-stone-500 hover:text-rose-600 transition pt-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Uitloggen</span>
          </Link>
        </div>
      </aside>

      {/* COMPACT MOBILE TOP HEADER (< md) */}
      <header className="md:hidden sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200/80 px-4 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-kami-600 flex items-center justify-center text-white shadow-soft">
            <Sparkles className="w-4 h-4 text-kami-100" />
          </div>
          <span className="font-serif text-lg font-medium text-stone-900 tracking-tight">
            Kami<span className="text-kami-600 font-normal italic">Flow</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {syncNotice && (
            <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 animate-in fade-in">
              {syncNotice}
            </span>
          )}
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200/80 px-2.5 py-1.5 rounded-lg transition disabled:opacity-60"
            title="Synchroniseer e-mails nu"
          >
            <RefreshCw
              className={cn("w-3.5 h-3.5", isSyncing && "animate-spin text-kami-600")}
            />
            <span className="text-xs">
              {isSyncing ? "Zoeken..." : "Sync"}
            </span>
          </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* DESKTOP TOP STATUS BAR (>= md) */}
        <header className="hidden md:flex h-16 bg-white/70 backdrop-blur-md border-b border-stone-200/60 px-8 items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-stone-500">
              Welkom, <strong className="text-stone-800 font-semibold">{profile.ownerName}</strong>
            </span>
            <span className="text-stone-300">|</span>
            <span className="inline-flex items-center gap-1.5 text-xs text-stone-500">
              Laatste check: zojuist
            </span>
          </div>

          <div className="flex items-center gap-3">
            {syncNotice && (
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 animate-in fade-in">
                {syncNotice}
              </span>
            )}
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="flex items-center gap-1.5 text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200/80 px-3 py-1.5 rounded-lg transition disabled:opacity-60"
              title="Synchroniseer e-mails nu"
            >
              <RefreshCw
                className={cn("w-3.5 h-3.5", isSyncing && "animate-spin text-kami-600")}
              />
              <span>{isSyncing ? "Zoeken..." : "Sync nu"}</span>
            </button>

            {profile.uploadEmail && (
              <div className="flex items-center gap-1 text-xs text-stone-500 bg-sand-100/70 px-3 py-1.5 rounded-lg border border-sand-200/60">
                <span className="text-stone-400">Uploadbox:</span>
                <span className="font-mono text-stone-700">{profile.uploadEmail}</span>
              </div>
            )}
          </div>
        </header>

        {/* PAGE CONTENT: Added bottom padding on mobile for Bottom Tab Bar */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full pb-24 md:pb-8">
          {children}
        </main>
      </div>

      {/* FIXED MOBILE BOTTOM TAB BAR (< md) */}
      <nav
        aria-label="Mobiele navigatie"
        className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white/90 backdrop-blur-md border-t border-stone-200/80 px-2 py-1.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-lg flex items-center justify-around"
      >
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-150 relative",
                isActive
                  ? "text-kami-600 font-semibold"
                  : "text-stone-400 hover:text-stone-600 font-normal"
              )}
            >
              <div
                className={cn(
                  "p-1 rounded-xl transition-all",
                  isActive && "bg-kami-50 text-kami-700"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5",
                    isActive ? "text-kami-600" : "text-stone-400"
                  )}
                />
              </div>
              <span
                className={cn(
                  "text-[10px] tracking-tight mt-0.5",
                  isActive ? "font-semibold text-kami-700" : "text-stone-500"
                )}
              >
                {item.shortLabel}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
