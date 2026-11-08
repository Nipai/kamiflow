export type InvoiceStatus =
  | "forwarded"        // Automatisch herkend & doorgestuurd
  | "pending"          // In verwerking
  | "missed"           // Potentiële factuur gemist / nog niet gekoppeld
  | "manual_confirmed"; // Handmatig goedgekeurd door gebruiker

export interface InvoiceEmail {
  id: string;
  sender: string;
  senderEmail: string;
  subject: string;
  snippet: string;
  receivedAt: string;
  amount?: number;
  invoiceNumber?: string;
  status: InvoiceStatus;
  accountingTarget?: string; // Bijv: "Moneybird (Inkoop)", "Exact Online"
  attachmentName?: string;
  confidenceScore: number; // 0-100%
  category?: "Haarproducten" | "Salon Inrichting" | "Koffie & Hospitality" | "Software & Pin" | "Algemeen";
}

export interface AccountingIntegration {
  id: string;
  name: string;
  description: string;
  status: "connected" | "disconnected";
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
}

export interface SalonProfile {
  name: string;
  owner: string;
  email: string;
  plan: string;
  accountingSoftware: string;
}
