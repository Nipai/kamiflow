# Project: KamiFlow

## 1. Globale Context & MVP Definitie
KamiFlow is een "set & forget" SaaS webapplicatie, specifiek ontworpen voor de beautysector (kappers, beautysalons en spa's).

**De MVP (De kern):**
1. **E-mail koppeling:** De gebruiker koppelt eenmalig zijn e-mailaccount (Google Workspace/Gmail of Microsoft Outlook 365).
2. **Periodieke achtergrondcheck:** Het systeem controleert de inbox periodiek (elke X minuten).
3. **ML/LLM Classificatie:** Een ML-model of LLM inspecteert het **onderwerp (subject)** en de **inhoud (body)** van e-mails om te bepalen of het een factuur of inkoopbon betreft.
4. **Slimme PDF-handling:**
   - **Heeft de mail al een PDF-bijlage?** &rarr; Stuur het originele PDF-bestand direct door naar het upload-e-mailadres van het boekhoudprogramma (bijv. `jouwsalon@moneybird.com` of `inkoop@exactonline.nl`).
   - **Heeft de mail géén PDF (HTML/tekst factuur of orderbon)?** &rarr; KamiFlow zet de e-mailtekst/HTML automatisch om naar een nette PDF en stuurt dit gegenereerde PDF-bestand door naar het upload-e-mailadres van het boekhoudprogramma!
5. **Dashboard & Twijfelgevallen:** Mocht het systeem twijfelen of een afwijkende bestelbon missen, kan de gebruiker dit via een rustgevend Zen-dashboard inzien en met één klik alsnog als PDF laten doorsturen.

**Post-MVP (Toekomstmuziek — Uitdrukkelijk NIET voor nu):**
- **Diepe OCR & bedragen-parsing:** Het parsen van afzonderlijke factuurregels, BTW-uitsplitsingen en exacte bedragen in de factuur zelf. In de MVP doet het boekhoudpakket (zoals Moneybird of Exact) dit zelf via hun eigen ingebouwde OCR zodra de PDF binnenkomt op hun upload-mail!
- **XML / UBL 2.1 creatie:** Het genereren van UBL-facturen is niet van toepassing op de MVP en komt pas in een latere fase.
- **Mollie / Subscription billing integratie.**

---

## 2. Tech Stack & Architectuur
- **Frontend/Backend:** Next.js 14 (App Router), TypeScript, Server Actions.
- **Database/Auth:** Supabase (buiten scope voor statische UI-fase).
- **Styling & UI:** Tailwind CSS, Lucide React iconen, Cormorant Garamond (Serif) & Plus Jakarta Sans (Sans).
- **Design Systeem & Vibe:** Wabi-sabi salonrust (`#5c6d60` kami-groen, `sand-50..900` rijstpapier-tinten, `brass` messingaccenten, washi-texturen en royale witruimte).
- **Architectuur Regels:** 
  - Strikte scheiding tussen UI (Client Components) en data-logica (Server Actions).
  - Business logica leeft in losse utility functies in `/lib` of `/utils`.

---

## 3. AI Workflow & Status Tracking (Verplicht!)
Voordat je code schrijft, MOET je de volgende workflow aanhouden:
1. **Lees de status:** Bekijk het bestand `TODO.md` om te zien wat er al gedaan is.
2. **Maak een plan:** Bedenk welke bestanden je gaat aanmaken of aanpassen voor de huidige taak.
3. **Schrijf code:** Voer de taak uit volgens de requirements.
4. **Update de status:** Zodra de taak klaar is, update je `TODO.md` met:
   - Wat is er zojuist voltooid?
   - Welke bestanden zijn aangepast?
   - Wat is de logische volgende stap voor een volgende iteratie?

---

## 4. Current Status: Statisch geraamte afgerond & productdefinitie uitgelijnd
De UI shells (Landing, Hero, Zen Contrast, Login, Zen Feed Dashboard, Review Modal, Settings) zijn gereed en uitgelijnd met de MVP-werkelijkheid:
- [x] Requirement 1: Rustgevende hero/landing page in `app/page.tsx` met de "Set & Forget" waardepropositie en slimme PDF-handling.
- [x] Requirement 2: Statische Login UI in `app/login/page.tsx`.
- [x] Requirement 3: Zen Dashboard in `app/dashboard/page.tsx` met Zen Barometer, Zen Feed, weergave-toggle en validatiemodal voor upload-mail forwarding.
- [x] Requirement 4: Settings UI in `app/dashboard/settings/page.tsx` met upload-e-mailadres configuratie en checkfrequentie.
- [x] Product Align: PDF passthrough vs. HTML-to-PDF conversie & upload-mail routing expliciet vastgelegd; XML en diepe bedrag-parsing uitgesteld tot post-MVP.

---

## 5. Out of Scope voor nu (Niet doen!):
- [ ] Ga nog GEEN database-connectie (Supabase) of echte authenticatie bouwen.
- [ ] Ga nog GEEN echte Gmail API of Outlook OAuth credentials afhandelen.
- [ ] Ga nog GEEN XML/UBL 2.1 export bouwen.
- [ ] Ga nog GEEN diepe factuur-OCR of bedragen parseren.
- [ ] Ga nog GEEN Mollie betaallinks implementeren.
