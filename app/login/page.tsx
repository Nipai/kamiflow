"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Mail, Lock, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("emma@haarstudiopuur.nl");
  const [password, setPassword] = React.useState("••••••••••••");
  const [isLoading, setIsLoading] = React.useState(false);
  const [useMagicLink, setUseMagicLink] = React.useState(false);
  const [magicLinkSent, setMagicLinkSent] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (useMagicLink) {
      setTimeout(() => {
        setIsLoading(false);
        setMagicLinkSent(true);
      }, 600);
    } else {
      // Direct navigation to dashboard (mock UI)
      setTimeout(() => {
        setIsLoading(false);
        router.push("/dashboard");
      }, 500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-[#faf9f6] py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Zen Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-kami-100/40 rounded-full blur-3xl -z-10" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand Logo */}
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-11 h-11 rounded-2xl bg-kami-600 flex items-center justify-center text-white shadow-soft group-hover:bg-kami-700 transition">
            <Sparkles className="w-5 h-5 text-kami-100" />
          </div>
          <span className="font-semibold text-2xl text-stone-900 tracking-tight">
            Kami<span className="text-kami-600">Flow</span>
          </span>
        </Link>
        <h2 className="mt-6 text-2xl font-light text-stone-900 tracking-tight sm:text-3xl">
          Welkom terug in de rust
        </h2>
        <p className="mt-2 text-sm text-stone-500">
          Beheer je salon facturen en koppelingen zonder stress
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/90 backdrop-blur-sm py-8 px-6 sm:px-10 shadow-card rounded-3xl border border-stone-200/80">
          {magicLinkSent ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-medium text-stone-900">Check je inbox!</h3>
              <p className="text-sm text-stone-600">
                We hebben een inloglink gestuurd naar <strong className="font-semibold">{email}</strong>.
              </p>
              <div className="pt-4">
                <Button
                  onClick={() => router.push("/dashboard")}
                  className="w-full"
                >
                  Ga direct door naar Dashboard (Demo)
                </Button>
              </div>
              <button
                type="button"
                onClick={() => setMagicLinkSent(false)}
                className="text-xs text-stone-400 hover:text-stone-600 underline"
              >
                Opnieuw inloggen
              </button>
            </div>
          ) : (
            <>
              {/* Quick OAuth options */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => router.push("/dashboard")}
                  className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-stone-200 rounded-xl bg-stone-50/50 hover:bg-stone-50 text-stone-700 text-sm font-medium transition shadow-subtle"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                  Verder met Google (Gmail)
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/dashboard")}
                  className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-stone-200 rounded-xl bg-stone-50/50 hover:bg-stone-50 text-stone-700 text-sm font-medium transition shadow-subtle"
                >
                  <svg className="w-4 h-4" viewBox="0 0 23 23">
                    <path fill="#f35325" d="M1 1h10v10H1z" />
                    <path fill="#81bc06" d="M12 1h10v10H12z" />
                    <path fill="#05a6f0" d="M1 12h10v10H1z" />
                    <path fill="#ffba08" d="M12 12h10v10H12z" />
                  </svg>
                  Verder met Microsoft 365 (Outlook)
                </button>
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-stone-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-3 text-stone-400 uppercase tracking-wider">
                    of met salon e-mail
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    label="Zakelijk e-mailadres"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="naam@jouwsalon.nl"
                    required
                  />
                </div>

                {!useMagicLink && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-medium text-stone-700">
                        Wachtwoord
                      </label>
                      <button
                        type="button"
                        onClick={() => setUseMagicLink(true)}
                        className="text-xs text-kami-700 hover:underline"
                      >
                        Inloggen zonder wachtwoord?
                      </button>
                    </div>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                    />
                  </div>
                )}

                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full shadow-soft"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      "Bezig met inloggen..."
                    ) : useMagicLink ? (
                      "Stuur mij een magische inloglink"
                    ) : (
                      <>
                        Naar Salon Dashboard
                        <ArrowRight className="w-4 h-4 ml-1.5" />
                      </>
                    )}
                  </Button>
                </div>
              </form>

              {useMagicLink && (
                <div className="mt-3 text-center">
                  <button
                    type="button"
                    onClick={() => setUseMagicLink(false)}
                    className="text-xs text-stone-500 hover:text-stone-800 underline"
                  >
                    Toch inloggen met wachtwoord
                  </button>
                </div>
              )}
            </>
          )}

          <div className="mt-6 pt-5 border-t border-stone-100 flex items-center justify-center gap-2 text-xs text-stone-400">
            <ShieldCheck className="w-4 h-4 text-kami-600" />
            <span>Versleutelde 256-bit verbinding &amp; AVG conform</span>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-stone-500">
          Nog geen KamiFlow account?{" "}
          <Link
            href="/"
            className="font-medium text-kami-700 hover:underline"
          >
            Start je gratis proefperiode
          </Link>
        </p>
      </div>
    </div>
  );
}
