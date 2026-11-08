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

- [x] **Kwaliteitsborging & Tests**
  - Vitest & React Testing Library test suite (20 tests, 5 test suites — 100% geslaagd).
  - TypeScript strikte type-controle zonder fouten.
  - Next.js productie-build geslaagd (alle routes statisch gegenereerd).

---

## 3. Wat is zojuist voltooid?
- Volledige implementatie van het statische geraamte (alle 4 requirements uit `kamiflow-task.md`).
- Opzet van het design systeem rond `#5c6d60` (Tailwind palette, zachte schaduwen, afgeronde hoeken, serene beauty vibe).
- Schone modulaire architectuur met herbruikbare UI componenten (`Button`, `Input`, `Badge`, `Card`, `Modal`).
- Domein types en realistische beauty mock data in `/lib`.
- Uitgebreide test suite met 20 geautomatiseerde tests die functionaliteit en interacties borgen.
- Succesvolle Next.js productie build (`npm run build`).

---

## 4. Welke bestanden zijn aangepast/aangemaakt?
- `package.json`: Projectconfiguratie, scripts en dependencies (Next.js 14, Tailwind, Lucide, Vitest, Testing Library).
- `tsconfig.json`: TypeScript compiler configuratie met path aliases (`@/*`).
- `tailwind.config.ts`: Merkkleuren `#5c6d60`, styling tokens en zachte schaduwen.
- `postcss.config.js`: PostCSS met Tailwind en Autoprefixer.
- `next.config.mjs`: Next.js configuratie.
- `vitest.config.ts` & `vitest.setup.ts`: Vitest configuratie met jsdom en React Testing Library.
- `.gitignore`: Schone repo configuratie.
- `app/globals.css`: Basisstijlen en serene kleurenpalette variabelen.
- `app/layout.tsx`: Root HTML layout met SEO metadata voor de beautysector.
- `app/page.tsx`: Requirement 1 (Landing page met "set & forget" propositie).
- `app/login/page.tsx`: Requirement 2 (Statische Login UI met OAuth en Magic Link).
- `app/dashboard/layout.tsx`: Dashboard shell met sidebar, responsive navigatie en header.
- `app/dashboard/page.tsx`: Requirement 3 (Dashboard overzicht & interactieve inbox tabel met markeer-modal).
- `app/dashboard/settings/page.tsx`: Requirement 4 (Settings UI voor mailboxen, boekhoudpakketten en zen-regels).
- `components/ui/button.tsx`: Herbruikbare knopcomponent.
- `components/ui/badge.tsx`: Statusbadges.
- `components/ui/card.tsx`: Zen kaartencomponent.
- `components/ui/input.tsx`: Formulierveld component.
- `components/ui/modal.tsx`: Toegankelijke dialoogcomponent voor het markeren van facturen.
- `components/layout/public-navbar.tsx`: Navigatiebalk voor publieke pagina's.
- `components/layout/public-footer.tsx`: Voettekst met productlinks en sectoraccenten.
- `lib/types.ts`: TypeScript interfaces voor facturen, mailboxen, integraties en profielen.
- `lib/mock-data.ts`: Rijke, contextuele data voor kapsalons en beauty professionals.
- `lib/utils.ts`: Hulpfuncties voor `cn`, datum-, tijd- en valutaformattering.
- `__tests__/utils.test.ts`: Unittests voor utilities.
- `__tests__/landing.test.tsx`: Componenttests voor de landing page.
- `__tests__/login.test.tsx`: Component- en interactietests voor de login pagina.
- `__tests__/dashboard.test.tsx`: Tests voor statistieken, tabelweergave, zoeken, filteren en markeeractie.
- `__tests__/settings.test.tsx`: Tests voor mailboxen, boekhoudkoppelingen, regels en profielupdate.
- `TODO.md`: Status en iteratietracking conform de AI Workflow.

---

## 5. Logische volgende stap voor een volgende iteratie:
1. **Authenticatie & Supabase integratie (zodra de scope wordt geopend):**
   - Supabase Auth voor Google OAuth & Microsoft 365 OAuth koppelingen.
   - User sessiebeheer en beveiligde route middleware.
2. **Database schema & Tabellen:**
   - Tabellen voor `salons`, `mailboxes`, `invoices`, `accounting_connections` en `matching_rules`.
   - Server Actions voor data mutaties (in plaats van client state).
3. **E-mail parsing & integratielaag:**
   - Webhook of IMAP / Gmail API worker voor het periodiek ophalen van inkomende e-mails.
   - Heuristische matching logica in `/lib/matching/` voor trefwoorden, leveranciers-domeinen en PDF-bijlagen.
