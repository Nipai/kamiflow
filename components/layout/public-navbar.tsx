import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const PublicNavbar = () => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#faf9f6]/90 border-b border-stone-200/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-kami-600 flex items-center justify-center text-white shadow-soft group-hover:bg-kami-700 transition">
            <Sparkles className="w-5 h-5 text-kami-100" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-lg text-stone-900 tracking-tight">
              Kami<span className="text-kami-600">Flow</span>
            </span>
            <span className="text-[10px] text-stone-500 font-medium tracking-wide uppercase">
              Voor de Beautysector
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
          <Link
            href="#waarom-kamiflow"
            className="hover:text-kami-700 transition"
          >
            Waarom KamiFlow
          </Link>
          <Link
            href="#hoe-het-werkt"
            className="hover:text-kami-700 transition"
          >
            Hoe het werkt
          </Link>
          <Link
            href="#boekhouding"
            className="hover:text-kami-700 transition"
          >
            Koppelingen
          </Link>
          <Link
            href="#faq"
            className="hover:text-kami-700 transition"
          >
            Veelgestelde Vragen
          </Link>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-stone-700">
              Inloggen
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="sm" className="hidden sm:inline-flex group shadow-soft">
              Open Dashboard
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
