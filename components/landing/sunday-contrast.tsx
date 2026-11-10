import React from "react";
import { X, Check, Coffee, AlertCircle, Sparkles, Heart } from "lucide-react";

export function SundayContrast() {
  return (
    <section className="py-24 bg-[#faf9f6] bg-washi relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand-100 text-stone-600 text-xs uppercase tracking-widest font-medium">
            <Sparkles className="w-3.5 h-3.5 text-kami-600" />
            <span>Het verschil op zondagavond</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-stone-900 tracking-tight leading-[1.2]">
            Van keukentafel-administratie <br />
            <span className="font-normal italic text-kami-700">naar pure salonrust.</span>
          </h2>
          <p className="text-sm sm:text-base text-stone-600 max-w-xl mx-auto leading-relaxed">
            Als salon-ondernemer sta je de hele week voor je klanten. Je weekend hoort niet
            in het teken te staan van rondslingerende facturen en boekhoudstress.
          </p>
        </div>

        {/* Asymmetrical Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto">
          {/* Card 1: Zonder KamiFlow */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-stone-200/80 shadow-subtle flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-rose-600">
                    De oude manier
                  </span>
                  <h3 className="font-serif text-2xl font-normal text-stone-900 mt-1">
                    Zondagavond 21:15 — <span className="italic text-stone-500">Zónder KamiFlow</span>
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
              </div>

              <p className="text-xs sm:text-sm text-stone-600 italic">
                &ldquo;Laptop open aan de keukentafel, stapels verfbonnen en vermoeid je mailbox doorzoeken.&rdquo;
              </p>

              <ul className="space-y-3.5 text-xs sm:text-sm text-stone-600">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                    <X className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <span>
                    Tientallen e-mails doorspitten in Gmail of Outlook op zoek naar die ene factuur van Keune of Davines.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                    <X className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <span>
                    PDF-bijlagen één voor één downloaden naar je bureaublad, hernoemen en uploaden naar Moneybird.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                    <X className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <span>
                    Kwijtraken van afwijkende inkoopbonnen (koffie, folies, handdoeken) die tussen de reclame belanden.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                    <X className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <span>
                    Terugkerende stress vlak voor de BTW-kwartaalaangifte wanneer je boekhouder om missende stukken vraagt.
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-rose-700 bg-rose-50/60 p-3.5 rounded-2xl">
              <span className="font-medium">Gemiddelde belasting:</span>
              <span className="font-semibold">~6 uur frustratie per maand</span>
            </div>
          </div>

          {/* Card 2: Met KamiFlow (Zen, warm, luxurious) */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white/95 border-2 border-kami-500/30 shadow-zen flex flex-col justify-between relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-kami-200/20 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between pb-4 border-b border-sand-200/80">
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-kami-700">
                    De KamiFlow ervaring
                  </span>
                  <h3 className="font-serif text-2xl font-normal text-stone-900 mt-1">
                    Zondagavond 21:15 — <span className="font-serif italic text-kami-700">Mét KamiFlow</span>
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-kami-100 text-kami-800 flex items-center justify-center shrink-0">
                  <Coffee className="w-5 h-5" />
                </div>
              </div>

              <p className="text-xs sm:text-sm text-stone-700 italic">
                &ldquo;Warme thee op de bank, je salonadministratie staat 100% bijgewerkt en je hoofd is leeg.&rdquo;
              </p>

              <ul className="space-y-3.5 text-xs sm:text-sm text-stone-700">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <span>
                    Elke inkomende factuur (verf, shampoos, pinbonnen) wordt direct bij binnenkomst herkend en doorgestuurd.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <span>
                    Direct gekoppeld aan Moneybird, Exact of e-Boekhouden met de juiste categorie en PDF-bijlage.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <span>
                    Eén sereen zen-dashboard dat enkel zachte signalen geeft als een e-mail extra bevestiging vraagt.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <span>
                    Boekhouder altijd blij en op tijd aangeleverd, zonder dat jij één minuut van je weekend hebt opgeofferd.
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-sand-200/80 flex items-center justify-between text-xs text-kami-900 bg-gradient-to-r from-kami-100/70 to-sand-100/70 p-3.5 rounded-2xl relative z-10">
              <span className="font-medium inline-flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-kami-700 fill-kami-700" />
                Jouw resultaat:
              </span>
              <span className="font-semibold text-kami-800">0 min handmatig werk • Totale zondagrust</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
