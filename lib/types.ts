export type InvoiceStatus =
  | "forwarded"        // Automatisch herkend & doorgestuurd
  | "pending"          // In verwerking
  | "missed"           // Potentiële factuur gemist / nog niet gekoppeld
  | "manual_confirmed"; // Handmatig goedgekeurd door gebruiker

export type PdfSourceType = "attachment" | "converted_from_email";

export interface InvoiceEmail {
  id: string;
  sender: string;
  senderEmail: string;
  subject: string;
  snippet: string;
  receivedAt: string;
  status: InvoiceStatus;
  uploadDestination: string; // Bijv: "haarstudiopuur@moneybird.com" of "Exact Online"
  attachmentName: string;     // PDF bestandsnaam
  pdfSource: PdfSourceType;  // "attachment" (zat al in mail) of "converted_from_email" (HTML omgezet naar PDF)
  confidenceScore: number;    // 0-100% ML/LLM match op subject + body
  matchReason?: string;       // Toelichting waarom ML/LLM dit als factuur herkent
  category?: "Haarproducten" | "Salon Inrichting" | "Koffie & Hospitality" | "Software & Pin" | "Algemeen";
  // Optioneel voor latere fasen (buiten MVP):
  amount?: number;
  invoiceNumber?: string;
  accountingTarget?: string;
}

export interface AccountingIntegration {
  id: string;
  name: string;
  description: string;
  status: "connected" | "disconnected";
  uploadEmail?: string; // Upload e-mailadres van de administratie
  accountName?: string;
  lastSync?: string;
  logo: string;
}

export interface MailboxIntegration {
  id: string;
  provider: "gmail" | "outlook";
  email: string;
  status: "connected" | "warning" | "disconnected";
  lastSync: string;
  emailsProcessedToday: number;
  checkIntervalMinutes: number; // Frequentie periodieke check
}

export interface SalonProfile {
  name: string;
  owner: string;
  email: string;
  plan: string;
  accountingSoftware: string;
  defaultUploadEmail: string;
}
