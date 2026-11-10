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

---

## 3. Wat is zojuist voltooid?
- **Fase 2 (Hero Redesign & Salon Zen Experience)**:
  - Generieke SaaS-mockup definitief verwijderd.
  - Tastbare, interactieve salon-factuur visual gebouwd met salonproducten van Keune, Davines en L'Oréal.
  - Monochrome leveranciersstrip met bekende kappersmerken en boekhoudpakketten toegevoegd.
  - Emotioneel Bento-tweeluik *Zondagavond zonder vs. mét KamiFlow* geïmplementeerd.
  - Volledige testsuite (20/20 geslaagd), productie-build voltooid en Docker container geüpdatet.

---

## 4. Welke bestanden zijn aangepast/aangemaakt?
- `components/landing/hero-invoice-flow.tsx`: Nieuw interactief client component met tastbare salon-factuur visual, leverancier-tabs en KamiFlow verificatiezegel.
- `components/landing/brand-strip.tsx`: Nieuw redactioneel monochroom merkenoverzicht voor beautymerken en boekhoudpartners.
- `components/landing/sunday-contrast.tsx`: Nieuw asymmetrisch Bento-tweeluik met de emotionele zondagavond-vergelijking.
- `app/page.tsx`: Volledige integratie van de nieuwe componenten en verfijning van de landingspagina.
- `TODO.md`: Status en documentatie van Fase 2 bijgewerkt.

---

## 5. Logische volgende stap voor een volgende iteratie:
1. **Fase 3: Dashboard & Zen Inbox Verfijning (`app/dashboard/page.tsx`)**:
   - Vervangen van de standaard datatabel door een rustgevende minimalistische feed met een "Alles is rustig" statusanimatie wanneer er geen gemiste facturen zijn.
   - Verbeterde salonfactuur preview modal in de inbox.
2. **Authenticatie & Supabase integratie:**
   - Supabase Auth voor Google OAuth & Microsoft 365 koppelingen.
