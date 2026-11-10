import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Coffee,
  Scissors,
  Check,
} from "lucide-react";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { Button } from "@/components/ui/button";
import { HeroInvoiceFlow } from "@/components/landing/hero-invoice-flow";
import { BrandStrip } from "@/components/landing/brand-strip";
import { SundayContrast } from "@/components/landing/sunday-contrast";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f6] bg-washi selection:bg-kami-200">
      <PublicNavbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sand-100 border border-sand-300 text-stone-700 text-xs sm:text-sm font-medium animate-pulse-subtle">
                <Sparkles className="w-4 h-4 text-kami-600" />
                <span>Set &amp; Forget factuurverwerking voor de beautybranche</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-stone-900 tracking-tight leading-[1.18]">
                Rust in je salon. <br />
                <span className="font-normal italic text-kami-700">
                  Nooit meer handmatig facturen doorsturen.
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-stone-600 font-normal leading-relaxed max-w-2xl mx-auto">
                Koppel eenmalig je mailbox. KamiFlow herkent automatisch inkoopfacturen
                van je leveranciers en stuurt ze direct door naar je boekhoudpakket.
              </p>

              {/* CTA Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/login" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto px-8 py-3.5 text-base shadow-card group bg-kami-600 hover:bg-kami-700 text-white">
                    Start in 2 minuten
                    <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto px-7 py-3.5 text-base border-sand-300 text-stone-700 hover:bg-sand-50">
                    Bekijk Demo Dashboard
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-stone-500">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-kami-600" />
                  Geen creditcard nodig
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-kami-600" />
                  AVG &amp; Privacy-proof
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-kami-600" />
                  Gemiddeld 6 uur per maand bespaard
                </span>
              </div>
            </div>

            {/* HERO VISUAL: TACTILE SALON INVOICE FLOW (Replaces old macOS dots window) */}
            <div className="mt-14">
              <HeroInvoiceFlow />
            </div>
          </div>
        </section>

        {/* MONOCHROME LEVERANCIERS & PARTNERS BALK */}
        <BrandStrip />

        {/* ASYMMETRISCH TWEELUIK: ZONDAGAVOND ZONDER VS MET KAMIFLOW */}
        <SundayContrast />

        {/* VALUE PROPOSITION: DE RUST VAN DE BEAUTYSECTOR */}
        <section id="waarom-kamiflow" className="py-20 bg-white border-y border-sand-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
              <h2 className="text-xs uppercase font-semibold tracking-widest text-kami-600">
                Waarom KamiFlow
              </h2>
              <p className="font-serif text-3xl font-light text-stone-900 tracking-tight sm:text-4xl">
                Jouw focus hoort bij je klanten, <br />
                <span className="font-normal italic text-kami-700">niet bij administratieve zoektochten.</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-8 rounded-3xl bg-sand-50/70 border border-sand-200/70 hover:shadow-soft transition-all">
                <div className="w-12 h-12 rounded-2xl bg-kami-100 flex items-center justify-center text-kami-700 mb-6">
                  <Scissors className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-medium text-stone-900 mb-2">
                  Gebouwd voor de beautybranche
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Herkent direct facturen van L&apos;Oréal, Keune, Davines, Salon Ambience, Wella,
                  en pinleveranciers zoals Zettle en Mollie.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-8 rounded-3xl bg-sand-50/70 border border-sand-200/70 hover:shadow-soft transition-all">
                <div className="w-12 h-12 rounded-2xl bg-kami-100 flex items-center justify-center text-kami-700 mb-6">
                  <Coffee className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-medium text-stone-900 mb-2">
                  Echte zondagrust
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Geen stapels PDF-bestanden downloaden en één voor één uploaden naar je boekhouder.
                  Elke inkoopfactuur staat direct op de juiste plek.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-8 rounded-3xl bg-sand-50/70 border border-sand-200/70 hover:shadow-soft transition-all">
                <div className="w-12 h-12 rounded-2xl bg-kami-100 flex items-center justify-center text-kami-700 mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-medium text-stone-900 mb-2">
                  Nooit een factuur kwijt
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Mocht er ooit een afwijkende e-mail binnenkomen, dan signaleert je zen-dashboard
                  deze vriendelijk. Eén tik en hij is alsnog doorgestuurd.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="hoe-het-werkt" className="py-20 bg-[#faf9f6]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
              <h2 className="text-xs uppercase font-semibold tracking-widest text-kami-600">
                Hoe het werkt
              </h2>
              <p className="font-serif text-3xl font-light text-stone-900 tracking-tight sm:text-4xl">
                In 3 stappen naar complete ontzorging
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="p-8 rounded-3xl bg-white border border-sand-200/80 shadow-subtle">
                <div className="w-10 h-10 rounded-full bg-sand-100 text-stone-700 font-bold flex items-center justify-center mb-6">
                  1
                </div>
                <h3 className="text-lg font-semibold text-stone-900 mb-2">
                  Koppel je mailbox
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Met 1 klik verbind je je vertrouwde zakelijke Gmail of Outlook adres via een beveiligde OAuth koppeling.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-white border border-sand-200/80 shadow-subtle">
                <div className="w-10 h-10 rounded-full bg-kami-100 text-kami-800 font-bold flex items-center justify-center mb-6">
                  2
                </div>
                <h3 className="text-lg font-semibold text-stone-900 mb-2">
                  Koppel je upload-mail
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Vul het unieke upload-e-mailadres in van je administratie in Moneybird, Exact of e-Boekhouden.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-white border border-sand-200/80 shadow-subtle">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center mb-6">
                  3
                </div>
                <h3 className="text-lg font-semibold text-stone-900 mb-2">
                  Set &amp; Forget
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  KamiFlow checkt periodiek je mails. PDF&apos;s worden direct doorgestuurd; mails zonder PDF worden automatisch omgezet naar een PDF-bestand.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-20 bg-white border-t border-sand-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
              <span className="text-xs uppercase font-semibold tracking-wider text-kami-600">
                Ervaringen uit de praktijk
              </span>
              <h2 className="font-serif text-3xl font-light text-stone-900">
                Geliefd bij kapper-ondernemers
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="p-8 rounded-3xl bg-sand-50/70 border border-sand-200/80">
                <p className="text-stone-700 italic text-sm leading-relaxed mb-6">
                  &ldquo;Vroeger zat ik op zondagavond altijd met tegenzin inkoopfacturen van verf en shampoo op te zoeken in mijn mailbox. Sinds KamiFlow staan ze al in Moneybird voordat ik het doorheb. Wat een rust.&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-kami-200 text-kami-800 flex items-center justify-center font-semibold text-sm">
                    EL
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-stone-900">Emma van Leeuwen</h4>
                    <p className="text-xs text-stone-500">Eigenaresse Haarstudio Puur, Utrecht</p>
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-sand-50/70 border border-sand-200/80">
                <p className="text-stone-700 italic text-sm leading-relaxed mb-6">
                  &ldquo;Mijn boekhouder vroeg ineens waarom mijn inkoopbonnen deze maand zo keurig op tijd binnen waren. KamiFlow heeft zichzelf in week één al terugverdiend in pure tijdwinst.&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sand-200 text-stone-800 flex items-center justify-center font-semibold text-sm">
                    SB
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-stone-900">Sander Berends</h4>
                    <p className="text-xs text-stone-500">Barbershop &amp; Spa De Meester, Haarlem</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="py-20 bg-kami-600 text-white relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-tight">
              Klaar voor meer rust en overzicht in jouw salon?
            </h2>
            <p className="text-kami-100 text-base max-w-xl mx-auto leading-relaxed">
              Sluit je aan bij tientallen beauty-ondernemers die hun administratie op de automatische piloot hebben gezet.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login">
                <Button size="lg" className="bg-white text-kami-800 hover:bg-stone-50 shadow-soft">
                  Start nu gratis proefperiode
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost" size="lg" className="text-white hover:bg-white/10 hover:text-white">
                  Bekijk demo dashboard
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
