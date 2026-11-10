# KamiFlow Project Status & TODO

## 1. Project Overzicht
KamiFlow is een "set & forget" SaaS webapplicatie, speciaal ontwikkeld voor de beautysector (kappers, beautysalons en spa's).
In de MVP koppelt de gebruiker eenmalig zijn e-mail (Gmail of Outlook). Een achtergrondtaak controleert de mailbox periodiek met behulp van een ML- of LLM-model die op basis van het **onderwerp (subject)** en de **e-mailinhoud (body)** bepaalt of het een inkoopfactuur of salonbon betreft. 
- **Zit er een PDF-bijlage in?** Dan wordt het originele PDF-bestand direct doorgestuurd naar het upload-e-mailadres van de boekhouding (Moneybird, Exact Online, e-Boekhouden.nl, Yuki).
- **Zit er géén PDF in (HTML/tekst factuur of orderbon)?** Dan zet KamiFlow de e-mail automatisch om naar een strak PDF-bestand en stuurt dit door naar het upload-adres.
- **Buiten scope voor MVP:** Diepe regels- en bedragenparsing en XML/UBL-creatie zijn uitgesteld tot een latere fase; het boekhoudpakket doet via zijn eigen scan- en uploadmechanisme de administratieve OCR.

---

## 2. Status van Current Task: Het statische geraamte (UI Shells) opmaken

- [x] **Requirement 1: Rustgevende Landing / Hero Page (`app/page.tsx`)**
  - "Set & Forget" waardepropositie specifiek voor de beautybranche.
  - Rustgevend design met accentkleur `#5c6d60`, washi-achtergrond, veel witruimte en zachte randen.
  - Live flow simulatie: Periodieke check &rarr; Slimme PDF-handling (origineel vs. omgezet) &rarr; Upload-e-mail boekhouding.
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
  - Zen Feed & Tabel met representatieve leveranciers uit de beautybranche (Davines, Keune, Nespresso, Salon Ambience, Zettle, L'Oréal).
  - Duidelijke status of een document een originele PDF is of automatisch vanuit een e-mail is omgezet.
  - Volledige functionaliteit om gemiste e-mails te openen in een review-modal en direct te markeren als factuur voor doorsturing naar het boekhoud-uploadadres.
  - Zoekbalk en tab-filters (Alle e-mails, Aandacht vereist, Doorgestuurd).
  - Getest en geverifieerd via geautomatiseerde tests.

- [x] **Requirement 4: Statische Settings UI (`app/dashboard/settings/page.tsx`)**
  - Beheer van gekoppelde Gmail- en Outlook-inboxen met status, check-frequentie en sync indicatoren.
  - Boekhoudsoftware upload-mail koppeling (Moneybird, Exact Online, e-Boekhouden.nl, Yuki) met interactieve koppel/ontkoppel acties en zichtbaar uploadadres.
  - Automatiserings- & zen-regels (drempelwaarde >90%, HTML-naar-PDF conversie toggle, twijfelgevallen signalering, zondagavond samenvatting).
  - Salon profielbeheer met succesnotificaties bij opslaan.
  - Getest en geverifieerd via geautomatiseerde tests.

---

## 2.1 Fase 1: Merkidentiteit, Zen Stijl & Typografie Upgrade (Voltooid)
- [x] Google Font `Cormorant Garamond` (high-end serif) gekoppeld voor koppen, logo en titels via `next/font/google`.
- [x] Google Font `Plus Jakarta Sans` (serene sans-serif) gekoppeld voor bodytekst en interactieve componenten.
- [x] `kami` groen `#5c6d60`, aangevuld met natuurlijke zand/rijstpapier tinten (`sand-50..900`) en warme messingaccenten (`brass-300..700`).
- [x] Washi papiertexturen (`bg-washi`, `bg-paper-grid`) toegevoegd in `app/globals.css`.

## 2.2 Fase 2: Hero Redesign & Asymmetrisch Tweeluik (Voltooid)
- [x] Tactiele salon-factuurflow visueel gemaakt in `components/landing/hero-invoice-flow.tsx`.
- [x] Monochrome leveranciers- en partnerstrip (`components/landing/brand-strip.tsx`) met herkenbare salonmerken (Keune, Davines, L'Oréal) en boekhoudpakketten.
- [x] Asymmetrisch Bento-tweeluik (`components/landing/sunday-contrast.tsx`): Zondagavond zonder KamiFlow vs. Zondagavond mét KamiFlow.

## 2.3 Fase 3: Dashboard & Zen Inbox Verfijning (Voltooid)
- [x] Zen Barometer met "Alles is rustig in de salon" status en realtime meldingen.
- [x] Zen Feed met esthetische washi-kaarten, leveranciers-monogrammen, categorieën en duidelijke upload-bestemmingen.
- [x] View switcher toggle tussen Zen Feed en Klassiek Register.
- [x] "Totale rust" serene zero-state bij een lege aandachts-inbox.

## 2.4 Product Definitie & MVP Flow Uitlijning (Voltooid)
- [x] **Afstemming met de werkelijke productmechaniek:**
  - E-mail koppelen &rarr; periodiek scannen via ML/LLM op onderwerp (subject) en inhoud (body).
  - Heeft de mail een PDF? &rarr; PDF direct doorsturen naar de upload-e-mail van de boekhouding.
  - Geen PDF in de mail (HTML orderbon of afschrift)? &rarr; E-mail automatisch omzetten naar PDF en doorsturen naar de upload-e-mail.
  - Uitdrukkelijk buiten MVP scope: XML/UBL 2.1 generatie en diepe factuurparsing (bedragen, regels); de boekhouding doet zelf de OCR via de upload-inbox.
- [x] **Codebase & UI Componenten gelijkgetrokken:**
  - `lib/types.ts` & `lib/mock-data.ts`: velden `pdfSource` (`attachment` vs `converted_from_email`), `uploadDestination`, en `matchReason` toegevoegd.
  - `components/landing/hero-invoice-flow.tsx`: simulatie omgebouwd naar de werkelijke PDF-afhandeling (Keune PDF vs Nespresso omgezet van HTML naar PDF vs Davines PDF) en aflevering via het upload-adres.
  - `components/landing/sunday-contrast.tsx`: teksten over HTML-mails en upload-mail aangescherpt.
  - `components/dashboard/invoice-feed-card.tsx`: toont nu direct of het een originele PDF was of omgezet vanuit een e-mail, en het doel-uploadadres.
  - `app/dashboard/page.tsx`: review modal en tabel aangepast met upload-adres en PDF-status in plaats van fictieve bedrag-parsing.
  - `app/dashboard/settings/page.tsx`: upload-e-mailadres per boekhoudpakket inzichtelijk gemaakt en regel toegevoegd voor automatische HTML-naar-PDF conversie.

---

## 3. Wat is zojuist voltooid?
- De volledige productpropositie, typen, landingspagina, hero visualisatie, dashboard review flow, settings en mock-data zijn 100% uitgelijnd met de MVP:
  1. Periodieke check op e-mails via ML/LLM (onderwerp + body).
  2. Mails met PDF direct doorsturen naar het upload-e-mailadres van de boekhouding.
  3. Mails zonder PDF (HTML facturen) automatisch omzetten naar PDF en doorsturen.
  4. Geen verwarrende fictieve bedragparsing of XML in de MVP.
- Documentatie in `kamiflow-task.md` en `TODO.md` actueel gemaakt.

---

## 4. Welke bestanden zijn aangepast/aangemaakt?
- `kamiflow-task.md`: MVP definitie en post-MVP scope geactualiseerd.
- `lib/types.ts`: Uitgebreid met `pdfSource`, `uploadDestination` en `matchReason`.
- `lib/mock-data.ts`: Geactualiseerd met realistische PDF-bronnen en uploadadressen.
- `components/landing/hero-invoice-flow.tsx`: Hero visual herschreven naar PDF-handling en upload-mail route.
- `components/landing/sunday-contrast.tsx`: Teksten verfijnd voor HTML-mail naar PDF conversie.
- `app/page.tsx`: 3-stappenplan afgestemd op upload-mail en PDF conversie.
- `components/dashboard/invoice-feed-card.tsx`: Badges en weergave voor originele PDF vs omgezet naar PDF.
- `app/dashboard/page.tsx`: Modal preview en tabel bijgewerkt voor upload-bestemming en PDF-type.
- `app/dashboard/settings/page.tsx`: Upload-e-mailadressen en HTML-naar-PDF conversie toggle toegevoegd.
- `TODO.md`: Status en documentatie bijgewerkt.

---

## 5. Logische volgende stap voor een volgende iteratie:
1. **Authenticatie & Supabase integratie:**
   - Supabase Auth inrichten voor Google OAuth (Gmail) & Microsoft 365 (Outlook).
2. **Achtergrondtaak & E-mail connector (IMAP/Gmail API):**
   - Periodieke cron of webhook voor inbox scanning.
   - LLM/ML prompt & modelaanroep voor classificatie op subject + body.
   - HTML-to-PDF rendering utility en SMTP forwarder naar de upload-e-mailadressen.
