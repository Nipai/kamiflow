# KamiFlow Project Status & TODO

## 1. Project Overzicht
KamiFlow is een "set & forget" SaaS webapplicatie, speciaal ontwikkeld voor de beautysector (kappers, salons en schoonheidsspecialisten).
Factuur-e-mails worden automatisch herkend en direct doorgestuurd naar boekhoudpakketten (zoals Moneybird, Exact Online, e-Boekhouden en Yuki). Mocht het systeem een afwijkende e-mail missen, kan de salonhouder deze via een minimalistisch zen-dashboard eenvoudig handmatig markeren en doorsturen.

---

## 2. Status van Current Task: Het statische geraamte (UI Shells) opmaken

- [x] **Requirement 1: Rustgevende Landing / Hero Page (`app/page.tsx`)**
  - "Set & Forget" waardepropositie specifiek voor de beautysector.
  - Rustgevend design met accentkleur `#5c6d60`, veel witruimte en zachte randen.
  - Live flow simulatie: Inkomende factuur (Keune) &rarr; KamiFlow Matching &rarr; Moneybird Inkoop.
  - Voordelen voor salons, 3-stappenplan en praktijktestimonials van kapper-ondernemers.
  - Getest en geverifieerd via geautomatiseerde tests.

- [x] **Requirement 2: Statische Login UI (`app/login/page.tsx`)**
  - Minimalistische, serene login interface met afgestemde typografie.
  - Directe Google (Gmail) en Microsoft 365 (Outlook) authenticatieknoppen.
  - E-mail & wachtwoord login met toggle voor magische inloglink (passwordless).
  - Interactieve client validatie en soepele navigatie naar het dashboard.
  - Getest en geverifieerd via geautomatiseerde tests.

- [x] **Requirement 3: Dashboard Layout & Inbox Tabel (`app/dashboard/page.tsx` & `app/dashboard/layout.tsx`)**
  - Rustgevende dashboard shell met zijbalk, mobiele navigatie, actieve salonstatus en realtime sync knop.
  - 4 overzichtskaarten: Doorgestuurde facturen, Bespaarde administratietijd (~6.5 uur), Gekoppelde mailboxen en Aandacht vereist (Gemiste facturen).
  - Mock-tabel met representatieve leveranciers uit de beautybranche (Davines, Keune, Nespresso, Salon Ambience, Zettle, L'Oréal).
  - Volledige functionaliteit om gemiste e-mails te openen in een review-modal en direct te markeren als factuur voor Moneybird/Exact.
  - Zoekbalk en tab-filters (Alle e-mails, Aandacht vereist, Doorgestuurd).
  - Getest en geverifieerd via geautomatiseerde tests.

- [x] **Requirement 4: Statische Settings UI (`app/dashboard/settings/page.tsx`)**
  - Beheer van gekoppelde Gmail- en Outlook-inboxen met status en sync indicatoren.
  - Boekhoudsoftware koppelingen (Moneybird, Exact Online, e-Boekhouden.nl, Yuki) met interactieve koppel/ontkoppel acties.
  - Automatiserings- & zen-regels (drempelwaarde >90%, twijfelgevallen signalering, zondagavond samenvatting).
  - Salon profielbeheer met succesnotificaties bij opslaan.
  - Getest en geverifieerd via geautomatiseerde tests.

---

## 2.1 Fase 1: Merkidentiteit, Zen Stijl & Typografie Upgrade (Voltooid)

- [x] **Redactionele & Zen Typografie:**
  - Google Font `Cormorant Garamond` (high-end redactionele serif) gekoppeld voor koppen, logo en titels via `next/font/google`.
  - Google Font `Plus Jakarta Sans` (heldere, serene sans-serif) gekoppeld voor bodytekst en interactieve componenten met ademende letterspatiëring.
  - CSS-variabelen (`--font-serif`, `--font-sans`) geconfigureerd in `app/layout.tsx` en `tailwind.config.ts`.
- [x] **Wabi-Sabi & Zen Kleurenpalet:**
  - `kami` groen verfijnd rond `#5c6d60`, aangevuld met natuurlijke zand/rijstpapier tinten (`sand-50` t/m `sand-900`) en warme messing/goud accenten (`brass-300` t/m `brass-700`).
  - Zen-schaduwen (`boxShadow.zen`) en subtiele animaties (`animate-float-zen`, `animate-pulse-subtle`).
- [x] **Washi Papier Texturen & Ruis:**
  - Pure CSS washi en papiertexturen (`bg-washi`, `bg-paper-grid`) toegevoegd in `app/globals.css`.
- [x] **Merk- & Typografieverfijning over alle pagina's:**
  - Landing page (`app/page.tsx`): Hero H1, USP-koppen, 3-stappenplan en testimonials voorzien van redactionele `font-serif` styling en washi-achtergrond.
  - Navigatie & Footer (`components/layout/`): Logo typografie verfijnd met `font-serif` en cursief accent (`Kami*Flow*`).
  - Login (`app/login/page.tsx`): Welkomst-kop en merk verfijnd naar serene salonstijl.
  - Dashboard (`app/dashboard/`): Header en zijbalk voorzien van de nieuwe zen-typografie.
- [x] **Hosting & Deployment op Coolify / Docker (Poort 3002)**
  - Container herbouwd en actief op poort **3002** (getest via HTTP 200 OK op LAN `192.168.86.218:3002`).

- [x] **Kwaliteitsborging & Tests**
  - Vitest test suite (20 tests, 5 test suites — 100% geslaagd).
  - TypeScript strikte type-controle zonder fouten.
  - Next.js productie-build geslaagd (alle routes statisch gegenereerd).

## 2.2 Fase 2: Hero Redesign, Tastbare Salon Flow & Asymmetrisch Tweeluik (Voltooid)

- [x] **Tastbare Salon-Factuurflow Visual (`components/landing/hero-invoice-flow.tsx`):**
  - Het generieke macOS-venstertje (met de drie gekleurde bolletjes) is vervangen door een tastbare salon-factuurkaart in washi/rijstpapier-stijl.
  - Interactieve leverancierskeuze (Keune, Davines, L'Oréal) met realistische salonproducten (Tinta Color verf, Vital Nutrition shampoo, blondpoeder, OI milk).
  - Rustgevende 3-staps live visualisatie: Inkomende e-mail &rarr; KamiFlow Zen Matching (99.8% zekerheid) &rarr; Boekhoudpakket (Moneybird/Exact/e-Boekhouden).
  - Officiële KamiFlow geverifieerd-zegel/stempel ("Geverifieerd & Ingeboekt", 0 seconden handmatig werk).
- [x] **Monochrome Leveranciers- & Partnerstrip (`components/landing/brand-strip.tsx`):**
  - Luxe, redactionele typografie met salonmerken: Keune, Davines, L'Oréal Professionnel, Wella Professionals, Salon Ambience, Schwarzkopf.
  - Naadloze koppeling met boekhoudpakketten: Moneybird, Exact Online, e-Boekhouden.nl, Yuki en Zettle.
  - Subtiele hover-effecten en 'Ma' (ademende tussenruimte).
- [x] **Asymmetrisch Tweeluik / Bento Grid (`components/landing/sunday-contrast.tsx`):**
  - Emotionele vergelijking: *Zondagavond 21:15 — Zónder KamiFlow* (laptop aan keukentafel, rondslingerende verfbonnen, ~6 uur frustratie) vs. *Zondagavond 21:15 — Mét KamiFlow* (kop thee op de bank, 100% bijgewerkte boekhouding, 0 min handmatig werk, totale rust).
- [x] **Integratie Landing Page (`app/page.tsx`):**
  - Alle nieuwe componenten naadloos samengevoegd met behoud van de 100% testdekking in Vitest.
- [x] **Kwaliteitsborging & Deployment:**
  - Vitest test suite (20 tests geslaagd).
  - Next.js 14 productie-build (7/7 statische routes foutloos gegenereerd).
  - Docker container herbouwd en live geverifieerd op poort **3002**.

## 2.3 Fase 3: Dashboard & Zen Inbox Verfijning (Voltooid)

- [x] **Zen Barometer ("Alles is rustig in de salon" Status) (`components/dashboard/zen-barometer.tsx`):**
  - Realtime Wabi-Sabi statusbarometer bovenaan het dashboard.
  - Wanneer alles is doorgestuurd (`missedCount === 0`): Rustgevende Zen banner met *"Alles is rustig in de salon — 28 facturen geruisloos verwerkt deze maand naar Moneybird. Geen actie vereist."* met 100% Zen Matching indicator.
  - Wanneer er aandachtspunten zijn (`missedCount > 0`): Geruststellende status met *"X e-mails vragen om een snelle blik"* en een directe filterknop.
- [x] **Zen Feed (Washi Salon Kaarten) (`components/dashboard/invoice-feed-card.tsx`):**
  - De kille, administratieve datatabel is getransformeerd naar een esthetische feed met salon-bonkaarten.
  - Leverancier-monogrammen (Davines, Keune, Nespresso, Salon Ambience, Zettle, L'Oréal).
  - Categorie-tags (`Haarproducten`, `Koffie & Hospitality`, `Salon Inrichting`, `Software & Pin`).
  - Duidelijke weergave van factuurbedrag, BTW-indicatie, bijlagenaam en KamiFlow herkenningsscore.
  - Directe actieknop voor twijfelgevallen (*"Markeer als factuur"*).
- [x] **Dubbele Weergavemodus (Zen Feed & Salon Register):**
  - Snelle view-switcher toegevoegd zodat salonhouders naadloos kunnen schakelen tussen de visuele **Zen Feed** en het gestroomlijnde **Register (Tabel)**.
- [x] **"Totale Rust" Zero-State (`components/dashboard/zen-empty-state.tsx`):**
  - Wanneer de salonhouder het filter "Aandacht vereist" opent en alle facturen zijn afgehandeld: een serene visuele illustratie met kop koffie, *"Totale rust — Geen openstaande facturen"* en een snelle terugkeerknop.
- [x] **Verfijnde Factuur Preview & Validatie Modal:**
  - Uitgebreide factuur-preview met leveranciersgegevens, e-mail snippet, BTW-uitsplitsing, PDF-bijlage en AI-zekerheidsscore.
  - Gevalideerde doorstuuractie naar Moneybird, Exact Online, e-Boekhouden of Yuki met salonleverancier leervoorkeur.
- [x] **Kwaliteitsborging & Tests:**
  - Testsuite uitgebreid in `__tests__/dashboard.test.tsx` van 5 naar 7 tests (totaal 22/22 geslaagd).
  - Getest op weergave-omschakeling, Zen Barometer statusveranderingen en serene zero-state.
  - Next.js 14 productie-build (7/7 routes) foutloos.

---

## 3. Wat is zojuist voltooid?
- **Fase 3 (Dashboard & Zen Inbox Verfijning)**:
  - Zen Barometer geïmplementeerd die direct rust en vertrouwen geeft over de status van de salonadministratie.
  - Zen Feed met esthetische Washi-salonbonnen toegevoegd met leveranciers-monogrammen, categorieën en BTW-uitsplitsing.
  - Naadloze view-toggle tussen Zen Feed en Klassiek Register.
  - Serene "Totale rust" zero-state als alle facturen geruisloos zijn afgehandeld.
  - Uitgebreide preview modal voor salonfacturen en herkenningsvalidatie.
  - Vitest testsuite uitgebreid naar 22 tests (100% geslaagd).

---

## 4. Welke bestanden zijn aangepast/aangemaakt?
- `components/dashboard/zen-barometer.tsx`: Realtime Zen Barometer met "Alles is rustig in de salon" status en geruststellende meldingen.
- `components/dashboard/zen-empty-state.tsx`: Rustgevende zero-state illustratie en teksten bij een lege aandachts-inbox of zoekopdracht.
- `components/dashboard/invoice-feed-card.tsx`: Washi salon-bonkaart component voor de Zen Feed met leveranciers-monogram, categorie, bedrag en actieknoppen.
- `app/dashboard/page.tsx`: Volledige integratie van de Zen Barometer, Zen Feed, view switcher en verfijnde preview modal.
- `__tests__/dashboard.test.tsx`: Uitgebreid met tests voor de Zen Barometer, weergave-toggle en de serene zero-state.
- `TODO.md`: Status en documentatie van Fase 3 bijgewerkt.

---

## 5. Logische volgende stap voor een volgende iteratie:
1. **Authenticatie & Supabase integratie:**
   - Supabase Auth inrichten voor Google OAuth (Gmail) & Microsoft 365 (Outlook).
2. **E-mail parsing & IMAP/Webhook logica:**
   - Echte e-mail connectiviteit en factuurherkenning.
