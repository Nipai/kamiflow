# Project: KamiFlow

## 1. Globale Context
KamiFlow is een "set & forget" SaaS webapplicatie, specifiek ontworpen voor de beautysector. 
**De MVP:** Gebruikers koppelen hun e-mail (Outlook/Gmail), waarna KamiFlow automatisch factuur-e-mails herkent (via subject/body matching) en deze direct doorstuurt naar hun boekhoudsoftware. 
**Het probleem dat we oplossen:** Kappers en schoonheidsspecialisten willen rust en overzicht. Ze willen geen facturen meer handmatig hoeven doorsturen. Mocht het systeem een e-mail missen, kan de gebruiker dit via een simpel dashboard alsnog handmatig toevoegen of markeren.
**Toekomst (Niet voor nu):** AI OCR, UBL 2.1 generatie, ML-training voor betere matching, en Mollie integratie.

*Let op: Behoud altijd het overzicht over dit grotere geheel, maar focus je in deze sessie UITSLUITEND op de taak onder 'Current Task'.*

## 2. Tech Stack & Architectuur
- **Frontend/Backend:** Next.js (App Router), TypeScript, Server Actions.
- **Database/Auth:** Supabase (logica buiten scope voor nu).
- **Styling & UI:** Tailwind CSS, shadcn/ui, Lucide React iconen.
- **Design Systeem & Vibe:** De applicatie moet extreme rust en gebruiksvriendelijkheid uitstralen (aansluitend bij de beautysector). Gebruik veel witruimte, zachte randen en implementeer `#5c6d60` als de primaire accentkleur in Tailwind.
- **Architectuur Regels:** 
  - Strikte scheiding tussen UI (Client Components) en data-logica (Server Actions).
  - Business logica leeft in losse utility functies in een `/lib` of `/utils` map.

## 3. AI Workflow & Status Tracking (Verplicht!)
Voordat je code schrijft, MOET je de volgende workflow aanhouden:
1. **Lees de status:** Bekijk het bestand `TODO.md` (als dit bestaat) om te zien wat er al gedaan is.
2. **Maak een plan:** Bedenk welke bestanden je gaat aanmaken of aanpassen voor de huidige taak.
3. **Schrijf code:** Voer de taak uit volgens de requirements.
4. **Update de status:** Zodra de taak klaar is, update je `TODO.md` (of maak je deze aan) met:
   - Wat is er zojuist voltooid?
   - Welke bestanden zijn aangepast?
   - Wat is de logische volgende stap voor een volgende iteratie?

## 4. Current Task: Het statische geraamte (UI Shells) opmaken
**Doel van deze iteratie:** Bouw de algemene folder-structuur en de statische UI (dummy data) voor de kernpagina's.

**Requirements:**
- [ ] Requirement 1: Maak een simpele, rustgevende hero/landing page in `app/page.tsx` die de "set & forget" waardepropositie communiceert.
- [ ] Requirement 2: Maak een statische Login UI in `app/login/page.tsx`.
- [ ] Requirement 3: Maak de layout voor het Dashboard in `app/dashboard/page.tsx`, inclusief een mock-tabel voor de inbox waar gemiste e-mails gemarkeerd kunnen worden.
- [ ] Requirement 4: Maak een statische Settings UI in `app/dashboard/settings/page.tsx`.

## 5. Out of Scope voor nu (Niet doen!):
- [ ] Ga nog GEEN database-connectie (Supabase) of echte authenticatie bouwen.
- [ ] Ga nog GEEN e-mail parsing logica (IMAP/Gmail API) bouwen.
- [ ] Ga nog GEEN XML/UBL export of OCR bouwen.
- [ ] Ga nog GEEN Mollie betaallinks of subscriptions implementeren.
