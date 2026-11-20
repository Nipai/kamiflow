# KamiFlow Project Status & TODO

## 1. Project Overzicht
KamiFlow is een "set & forget" SaaS webapplicatie, speciaal ontwikkeld voor de beautysector (kappers, beautysalons en spa's).
In de MVP koppelt de gebruiker eenmalig zijn e-mail (Gmail of Outlook). Een achtergrondtaak controleert de mailbox periodiek met behulp van een ML- of LLM-model die op basis van het **onderwerp (subject)** en de **e-mailinhoud (body)** bepaalt of het een inkoopfactuur of salonbon betreft. 
- **Zit er een PDF-bijlage in?** Dan wordt het originele PDF-bestand direct doorgestuurd naar het upload-e-mailadres van de boekhouding (Moneybird, Exact Online, e-Boekhouden.nl, Yuki).
- **Zit er géén PDF in (HTML/tekst factuur of orderbon)?** Dan zet KamiFlow de e-mail automatisch om naar een strak PDF-bestand en stuurt dit door naar het upload-adres.
- **Buiten scope voor MVP:** Diepe regels- en bedragenparsing en XML/UBL-creatie zijn uitgesteld tot een latere fase; het boekhoudpakket doet via zijn eigen scan- en uploadmechanisme de administratieve OCR.

---

## 2. Status van Current Task: Supabase Schema Upgrade & Mollie Flow (Voltooid)

- [x] **Database-schema & TypeScript Types (`lib/database.types.ts` & `lib/types.ts`)**
  - Alle enums exact geïmplementeerd: `provider`, `subscription_status`, `plan_tier`, `checker`, `check_label`, `forward_status`.
  - Tabellen getypeerd met Supabase v2 interfaces en relaties: `profiles`, `emailconnection`, `email`, `classification`.
  - Oude typfouten zoals `clasification` en `company_adress` opgeschoond.
- [x] **Supabase Client Architectuur in Next.js 14 App Router**
  - `lib/supabase/client.ts`: Browser-client voor client components met veilige fallbacks.
  - `lib/supabase/server.ts`: Server-client met `@supabase/ssr` en cookie-based authenticatie via `next/headers`.
  - `lib/supabase/admin.ts`: Standalone service role client met `SUPABASE_SERVICE_ROLE_KEY` voor webhook-verwerking.
- [x] **Route Group `app/(app)/` & Gedeelde Zen Dashboard Layout**
  - Alle 4 ingelogde routes delen de Zen layout via `app/(app)/layout.tsx`:
    - `/dashboard`: Overzicht & KPI-kaarten
    - `/facturen`: Facturen Logboek & AI Inspectie
    - `/koppelingen`: Mailboxen & Boekhoud-upload
    - `/instellingen`: Bedrijfsgegevens & Mollie abonnement
- [x] **Pagina 1: Dashboard (`/dashboard`)**
  - Mailbox status indicatoren (`is_active` & `mailbox_last_sync`).
  - KPI-kaarten gevoed door Supabase queries: doorgestuurd deze maand (`forward_status = 'forwarded'`), wachtend/mislukt (`forward_status in ('pending', 'failed')`) en abonnementstatus (`plan_tier` + `subscription_status`).
  - Recente e-mails scan-widget (5 meest recente e-mails uit `email`).
- [x] **Pagina 2: Facturen Logboek (`/facturen`) & ML Feedback**
  - Overzichtstabel met datum, afzender, onderwerp, PDF-indicator (`pdf_flag`), forward status en meest recente AI/ML-classificatie.
  - ML Feedback loop met interactieve modal: *"Markeer als factuur"* en *"Geen factuur"*.
  - Schrijft direct naar `classification` met `source: 'user'`, `confidence: 1.0`, `model_version: 'user_manual'` en het gekozen oordeel (`verdict`), en update de e-mailstatus.
- [x] **Pagina 3: Koppelingen (`/koppelingen`)**
  - Overzicht van `emailconnection` rijen met toggle om `is_active` aan/uit te zetten en laatste synchronisatietijd.
  - Formulier om `profiles.bookkeeping_upload_email` bij te werken met e-mailvalidatie en succesmelding.
- [x] **Pagina 4: Instellingen & Abonnement (`/instellingen`)**
  - Formulier voor salonbedrijfsgegevens (`company_name`, `company_address`, `company_vat_number`, `first_name`, `last_name`).
  - Abonnementsoverzicht op basis van `plan_tier`, `subscription_status` en `current_period_end`.
  - Upgrade-knoppen per plan tier direct gekoppeld aan de Mollie checkout route.
- [x] **Mollie Subscriptions API Structuur**
  - `lib/mollie.ts`: Mollie client setup via `MOLLIE_API_KEY` en definitie van plan pricing (`free`, `starter`, `pro`, `accountant`).
  - `POST /api/mollie/checkout`: Maakt (of haalt) Mollie Customer op, slaat `mollie_customer_id` op in `profiles`, en start eerste betaling (`sequenceType: 'first'`) voor iDEAL/SEPA mandaat.
  - `POST /api/webhooks/mollie`: Verwerkt webhook, haalt betaling op, voert idempotency-check uit tegen dubbele subscriptions (`profiles.mollie_subscription_id`), maakt bij geslaagde eerste betaling een Mollie Subscription aan en werkt Supabase profiel bij via service role.

---

## 3. Wat is zojuist voltooid?
- Volledige overstap naar het nieuwe Supabase-schema (`profiles`, `emailconnection`, `email`, `classification`).
- Mollie betalings- en subscription flow gebouwd inclusief webhook idempotency.
- Gecentraliseerde `app/(app)/` route group zodat `/dashboard`, `/facturen`, `/koppelingen` en `/instellingen` dezelfde Zen Layout delen.
- **Mobile-First UI/UX Polish & Vereenvoudiging:**
  - Vaste Bottom Tab Bar op mobiel (`app/(app)/layout.tsx`) met safe-area padding voor iPhone en 4 duidelijke tabs (Overzicht, Facturen, Koppelingen, Instellingen).
  - Compacte mobiele top-header (klein logo + sync-knop; welkomstbalk verborgen op mobiel).
  - Compact 2x2 KPI grid op het dashboard (`/dashboard`) met behoud van de prominente Zen Barometer aandacht-kaart.
  - Ultra-cleane factuurkaarten in `/facturen` (links: leverancier + datum; rechts: bedrag + zachte status-pil) met native-feeling Bottom Sheet op mobiel en gecentreerde modal op desktop.
  - Twee grote duimvriendelijke knoppen in de sheet: *"Ja, is een factuur"* en *"Nee, geen factuur"*.
  - Custom `<Switch />` component (`components/ui/Switch.tsx`) in kami-600 saliegroen met vloeiende animatie (ter vervanging van alle browser-checkboxes).
  - Volledige revisie naar mensentaal i.p.v. vakjargon (*Slimme herkenning*, *Automatisch bijgehouden*, etc.).
  - Technische bundeloptimalisatie: `PLAN_PRICING` verplaatst naar `lib/plans.ts` (bundelgrootte `/instellingen` gereduceerd van 150 kB naar 4.43 kB).
- Alle 29 Vitest tests slagen en `next build` compileert 100% foutloos.

---

## 4. Welke bestanden zijn aangepast/aangemaakt?
- `lib/database.types.ts`: Nieuw schema types voor Supabase v2.
- `lib/types.ts`: Geüpdatet met database exports en helper types.
- `lib/mock-data.ts`: Mock data uitgebreid met schema-conforme objecten en mensentaal.
- `lib/plans.ts`: Standalone pakketprijzen zonder `@mollie/api-client`.
- `lib/supabase/client.ts`: Browser-client voor client-side data ophalen.
- `lib/supabase/server.ts`: Server-client met `@supabase/ssr` cookies.
- `lib/supabase/admin.ts`: Supabase service role client voor webhook updates.
- `lib/mollie.ts`: Mollie client initialisatie en re-export van plan pricing.
- `components/ui/Switch.tsx`: Herbruikbaar custom toggle switch component.
- `components/ui/modal.tsx`: Responsive modal & bottom sheet component.
- `app/api/mollie/checkout/route.ts`: Checkout API endpoint voor Mollie betalingen.
- `app/api/webhooks/mollie/route.ts`: Idempotente Mollie webhook endpoint.
- `app/(app)/layout.tsx`: Gedeelde Zen Dashboard shell met mobiele Bottom Tab Bar.
- `app/(app)/dashboard/page.tsx`: Vernieuwd dashboard met compact 2x2 KPI grid.
- `app/(app)/facturen/page.tsx`: Ultra-cleane factuurkaarten met Bottom Sheet review flow.
- `app/(app)/koppelingen/page.tsx`: Mailbox status management, Gmail & Outlook OAuth acties en ontkoppel flow.
- `lib/crypto.ts`: AES-256-GCM token encryptie en decryptie helpers met 32-byte sleutel validatie.
- `lib/oauth.ts`: OAuth base URL resolutie, redirect URI helpers en provider configuratie.
- `app/api/oauth/gmail/connect/route.ts`: Gmail OAuth autorisatie redirect met CSRF state cookie.
- `app/api/oauth/gmail/callback/route.ts`: Gmail OAuth code exchange, email extractie, versleuteling en upsert.
- `app/api/oauth/outlook/connect/route.ts`: Microsoft 365 OAuth autorisatie redirect.
- `app/api/oauth/outlook/callback/route.ts`: Microsoft 365 token exchange, Graph profile email en upsert.
- `app/api/oauth/disconnect/route.ts`: Veilige server-side mailbox ontkoppel API route.
- `__tests__/crypto.test.ts`: Vitest suite voor encryptie, decryptie, tampering en env validatie.
- `__tests__/oauth.test.ts`: Vitest suite voor OAuth routes, redirects, token exchange en CSRF beveiliging.

---

## 5. Status van Stap 2: Google & Microsoft OAuth Koppeling + Token Encryptie (Voltooid)
- [x] **AES-256-GCM Encryptie (`lib/crypto.ts`)**
  - Veilige versleuteling (`encryptToken`, `decryptToken`) met random 12-byte IV en 16-byte GCM authentication tag.
  - Strikte validatie van `ENCRYPTION_KEY` / `APP_ENCRYPTION_KEY` (32 bytes / 64 hex karakters).
- [x] **Gmail OAuth Routes (`/api/oauth/gmail/connect` & `/api/oauth/gmail/callback`)**
  - Scopes: `gmail.readonly` en `userinfo.email` met `access_type=offline` en `prompt=consent`.
  - CSRF state beveiliging via SameSite=Lax cookie.
  - Token encryptie en upsert in `emailconnection`.
- [x] **Outlook OAuth Routes (`/api/oauth/outlook/connect` & `/api/oauth/outlook/callback`)**
  - Scopes: `offline_access User.Read Mail.Read`.
  - Microsoft Graph `/v1.0/me` email extractie, token encryptie en upsert in `emailconnection`.
- [x] **Koppelingen Pagina (`/koppelingen`)**
  - Knoppen "Gmail koppelen" en "Outlook koppelen" in header en empty state.
  - Wabi-Sabi succes- en foutmeldingen op basis van URL query parameters (`?connected=...`, `?error=...`).
  - Bevestigingsmodal voor "Ontkoppelen" en verwijdering via `/api/oauth/disconnect`.

---

## 6. Logische volgende stap voor een volgende iteratie:
1. **Achtergrond Worker / Cron:**
   - Worker die periodiek actieve mailboxen uit `emailconnection` ophaalt, tokens ontsleutelt via `decryptToken`, e-mails ophaalt via Gmail API of Microsoft Graph, de classificatie-pipeline aanroept en factuur-PDF's doorstuurt naar `bookkeeping_upload_email`.
