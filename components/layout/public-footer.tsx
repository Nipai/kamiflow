import Link from "next/link";
import { Sparkles, Heart } from "lucide-react";

export const PublicFooter = () => {
  return (
    <footer className="bg-stone-100/70 border-t border-stone-200/80 py-16 text-sm text-stone-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-kami-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4 text-kami-100" />
              </div>
              <span className="font-semibold text-lg text-stone-900 tracking-tight">
                Kami<span className="text-kami-600">Flow</span>
              </span>
            </div>
            <p className="text-stone-500 max-w-sm leading-relaxed">
              De &ldquo;set &amp; forget&rdquo; factuur-assistent die kappers en schoonheidsspecialisten
              bevrijdt van administratieve rompslomp. Koppel eenmalig, geniet voor altijd van rust.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-xs text-stone-500">
              Gemaakt met <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> speciaal voor beautyprofessionals.
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-stone-900 mb-3 text-xs uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="#hoe-het-werkt" className="hover:text-kami-700 transition">
                  Hoe het werkt
                </Link>
              </li>
              <li>
                <Link href="#waarom-kamiflow" className="hover:text-kami-700 transition">
                  Voordelen voor salons
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-kami-700 transition">
                  Live demo dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/settings" className="hover:text-kami-700 transition">
                  Boekhoudkoppelingen
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-stone-900 mb-3 text-xs uppercase tracking-wider">
              Ondersteunde systemen
            </h4>
            <ul className="space-y-2.5 text-stone-500">
              <li>Moneybird Inkoop</li>
              <li>Exact Online</li>
              <li>e-Boekhouden.nl</li>
              <li>Yuki Accounting</li>
              <li>Gmail &amp; Outlook</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-stone-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>&copy; {new Date().getFullYear()} KamiFlow. Alle rechten voorbehouden.</p>
          <div className="flex gap-6">
            <span>Privacybeleid</span>
            <span>Algemene Voorwaarden</span>
            <span>Beveiliging &amp; AVG</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
