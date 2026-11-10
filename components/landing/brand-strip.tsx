import React from "react";

export function BrandStrip() {
  const salonBrands = [
    { name: "Keune", style: "font-serif tracking-widest uppercase font-light text-sm" },
    { name: "Davines", style: "font-sans tracking-[0.25em] uppercase font-light text-xs" },
    { name: "L'Oréal Professionnel", style: "font-serif italic tracking-wider font-normal text-sm" },
    { name: "Wella Professionals", style: "font-sans tracking-[0.2em] uppercase font-medium text-xs" },
    { name: "Salon Ambience", style: "font-serif tracking-widest uppercase font-light text-xs" },
    { name: "Schwarzkopf", style: "font-sans tracking-[0.15em] uppercase font-light text-xs" },
  ];

  const accountingPartners = [
    { name: "Moneybird", note: "Directe doorsluis" },
    { name: "Exact Online", note: "Inkoopboeking" },
    { name: "e-Boekhouden.nl", note: "Automatch" },
    { name: "Yuki", note: "Document sync" },
    { name: "Zettle", note: "Dagtotalen" },
  ];

  return (
    <section className="py-12 border-y border-sand-200/80 bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-stone-400 font-medium mb-8">
          Herkent direct inkoopfacturen van toonaangevende beautymerken &amp; boekhoudpakketten
        </p>

        {/* Salon Supplier Brands */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 sm:gap-x-12 gap-y-4 text-stone-400">
          {salonBrands.map((b, i) => (
            <div
              key={i}
              className={`${b.style} hover:text-stone-800 transition-colors duration-200 select-none py-1`}
            >
              {b.name}
            </div>
          ))}
        </div>

        {/* Subtle Divider */}
        <div className="my-6 max-w-xs mx-auto flex items-center gap-3">
          <div className="h-px bg-sand-200 flex-1" />
          <span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium">
            koppelt met
          </span>
          <div className="h-px bg-sand-200 flex-1" />
        </div>

        {/* Accounting & Software Partners */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs">
          {accountingPartners.map((acc, i) => (
            <div
              key={i}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand-50 border border-sand-200/80 text-stone-600 hover:text-stone-900 hover:border-sand-300 transition-colors"
            >
              <span className="font-medium text-stone-800">{acc.name}</span>
              <span className="text-[10px] text-stone-400">({acc.note})</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
