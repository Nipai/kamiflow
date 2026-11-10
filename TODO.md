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

---

## 3. Wat is zojuist voltooid?
- **Fase 1 (Merk & Typografie Upgrade)**:
  - Generieke systeemfonts vervangen door Cormorant Garamond (luxe salon-serif) en Plus Jakarta Sans (ademende sans).
  - Wabi-sabi kleurenpalet uitgebreid met zand- en messingaccenten.
  - Washi-papiertextuur (`bg-washi`) en zen-schaduwen geïntroduceerd.
  - Typografische hiërarchie over alle pagina's consistent gemaakt.
  - Volledige testsuite (20/20 geslaagd) en succesvolle Next.js build.
  - Docker container op poort 3002 live bijgewerkt.

---

## 4. Welke bestanden zijn aangepast/aangemaakt?
- `tailwind.config.ts`: Typografie tokens (`font-serif`, `font-sans`), uitgebreid zand- en messing-kleurenpalet, zen-schaduwen en letterspatiëring.
- `app/layout.tsx`: Koppeling van `next/font/google` (`Cormorant_Garamond` & `Plus_Jakarta_Sans`) met CSS font-variabelen.
- `app/globals.css`: Washi papiertexturen (`.bg-washi`, `.bg-paper-grid`), float- en pulse-animaties, en optische letterspatiëring.
- `app/page.tsx`: Landing page koppen en secties verrijkt met `font-serif` en `bg-washi`.
- `components/layout/public-navbar.tsx`: Merklogo voorzien van verfijnde serif- en cursief-accenten.
- `components/layout/public-footer.tsx`: Footer merklogo bijgewerkt conform het nieuwe design.
- `app/login/page.tsx`: Inlogkop en logo geüpgraded.
- `app/dashboard/layout.tsx`: Dashboard sidebar en navigatielogo voorzien van serif typografie.
- `app/dashboard/page.tsx`: Dashboard titelkop voorzien van serif typografie.
- `app/dashboard/settings/page.tsx`: Settings titelkop voorzien van serif typografie.
- `TODO.md`: Status en iteratietracking bijgewerkt.

---

## 5. Logische volgende stap voor een volgende iteratie:
1. **Fase 2: Hero Redesign (`app/page.tsx`)**:
   - Vervangen van het macOS-venstertje (met de rode/gele/groene stipjes) door een tastbare, interactieve salon-factuurflow visual (bijv. Keune/L'Oréal factuur die met een zegel geruisloos doorstroomt naar Moneybird).
   - Monochrome leveranciersbalk met bekende salonmerken (Keune, Davines, L'Oréal, Salon Ambience, Wella, Moneybird, Exact).
   - Asymmetrisch tweeluik: *Zondagavond zonder KamiFlow vs. Zondagavond mét KamiFlow*.
2. **Authenticatie & Supabase integratie:**
   - Supabase Auth voor Google OAuth & Microsoft 365 koppelingen.
