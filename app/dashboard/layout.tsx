"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  Inbox,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Bell,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockSalonProfile } from "@/lib/mock-data";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [syncNotice, setSyncNotice] = React.useState<string | null>(null);

  const navItems = [
    {
      name: "Overzicht & Inbox",
      href: "/dashboard",
      icon: Inbox,
      exact: true,
    },
    {
      name: "Instellingen & Koppelingen",
      href: "/dashboard/settings",
      icon: Settings,
      exact: false,
    },
  ];

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncNotice("Mailboxen succesvol gesynchroniseerd!");
      setTimeout(() => setSyncNotice(null), 3000);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col md:flex-row">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex md:w-64 flex-col bg-white border-r border-stone-200/80 p-6 justify-between shrink-0">
        <div className="space-y-8">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-kami-600 flex items-center justify-center text-white shadow-soft group-hover:bg-kami-700 transition">
              <Sparkles className="w-5 h-5 text-kami-100" />
            </div>
            <div>
              <span className="font-semibold text-lg text-stone-900 tracking-tight">
                Kami<span className="text-kami-600">Flow</span>
              </span>
              <p className="text-[10px] text-stone-400 uppercase tracking-wider font-medium">
                Zen Dashboard
              </p>
            </div>
          </Link>

          {/* Salon Card */}
          <div className="p-3.5 rounded-2xl bg-kami-50/60 border border-kami-100">
            <p className="text-xs font-semibold text-stone-800 truncate">
              {mockSalonProfile.name}
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
            <span>Boekhouding:</span>
            <span className="font-medium text-stone-800">
              {mockSalonProfile.accountingSoftware}
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

      {/* MOBILE NAVBAR */}
      <div className="md:hidden bg-white border-b border-stone-200 px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-kami-600 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4 text-kami-100" />
          </div>
          <span className="font-semibold text-stone-900">KamiFlow</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg text-stone-600 hover:bg-stone-100"
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium",
                  isActive
                    ? "bg-kami-600 text-white"
                    : "text-stone-600 hover:bg-stone-50"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
          <div className="pt-2 border-t border-stone-100">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 text-sm text-stone-500"
            >
              <LogOut className="w-4 h-4" />
              <span>Uitloggen</span>
            </Link>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP STATUS BAR */}
        <header className="h-16 bg-white/70 backdrop-blur-md border-b border-stone-200/60 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs sm:text-sm font-medium text-stone-500">
              Welkom, <strong className="text-stone-800 font-semibold">{mockSalonProfile.owner}</strong>
            </span>
            <span className="hidden sm:inline-block text-stone-300">|</span>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-stone-500">
              Laatste check: 2 min. geleden
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
              <span className="hidden sm:inline">
                {isSyncing ? "Zoeken..." : "Sync nu"}
              </span>
            </button>

            <Link
              href="https://moneybird.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 text-xs text-stone-500 hover:text-stone-800 bg-stone-50 hover:bg-stone-100 px-3 py-1.5 rounded-lg border border-stone-200/60 transition"
            >
              <span>Moneybird</span>
              <ExternalLink className="w-3 h-3 text-stone-400" />
            </Link>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
