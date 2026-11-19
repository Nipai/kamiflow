export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Provider = "gmail" | "outlook" | "imap";
export type SubscriptionStatus = "trialing" | "active" | "past_due" | "canceled" | "inactive";
export type PlanTier = "free" | "starter" | "pro" | "accountant";
export type Checker = "wordlist" | "ml" | "llm" | "user";
export type CheckLabel = "invoice" | "not_invoice" | "unsure";
export type ForwardStatus = "pending" | "forwarded" | "failed" | "skipped";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          uuid_user: string;
          first_name: string | null;
          last_name: string | null;
          company_name: string | null;
          company_address: string | null;
          company_vat_number: string | null;
          bookkeeping_upload_email: string | null;
          mollie_customer_id: string | null;
          mollie_subscription_id: string | null;
          subscription_status: SubscriptionStatus | null;
          plan_tier: PlanTier | null;
          current_period_end: string | null;
          deletion_requested_at: string | null;
        };
        Insert: {
          uuid_user: string;
          first_name?: string | null;
          last_name?: string | null;
          company_name?: string | null;
          company_address?: string | null;
          company_vat_number?: string | null;
          bookkeeping_upload_email?: string | null;
          mollie_customer_id?: string | null;
          mollie_subscription_id?: string | null;
          subscription_status?: SubscriptionStatus | null;
          plan_tier?: PlanTier | null;
          current_period_end?: string | null;
          deletion_requested_at?: string | null;
        };
        Update: {
          uuid_user?: string;
          first_name?: string | null;
          last_name?: string | null;
          company_name?: string | null;
          company_address?: string | null;
          company_vat_number?: string | null;
          bookkeeping_upload_email?: string | null;
          mollie_customer_id?: string | null;
          mollie_subscription_id?: string | null;
          subscription_status?: SubscriptionStatus | null;
          plan_tier?: PlanTier | null;
          current_period_end?: string | null;
          deletion_requested_at?: string | null;
        };
        Relationships: [];
      };
      emailconnection: {
        Row: {
          id: string;
          user_id: string;
          email_address: string;
          email_provider: Provider;
          is_active: boolean;
          provider_auth_token: string | null;
          provider_refresh_token: string | null;
          token_expires_at: string | null;
          provider_auth_token_last_refresh: string | null;
          mailbox_last_sync: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          email_address: string;
          email_provider: Provider;
          is_active?: boolean;
          provider_auth_token?: string | null;
          provider_refresh_token?: string | null;
          token_expires_at?: string | null;
          provider_auth_token_last_refresh?: string | null;
          mailbox_last_sync?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          email_address?: string;
          email_provider?: Provider;
          is_active?: boolean;
          provider_auth_token?: string | null;
          provider_refresh_token?: string | null;
          token_expires_at?: string | null;
          provider_auth_token_last_refresh?: string | null;
          mailbox_last_sync?: string | null;
        };
        Relationships: [];
      };
      email: {
        Row: {
          id: string;
          emailbox_id: string;
          provider_message_id: string;
          subject: string | null;
          body: string | null;
          sender: string | null;
          pdf_flag: boolean;
          received_date: string;
          attachment_path: string | null;
          forward_status: ForwardStatus;
          forwarded_at: string | null;
        };
        Insert: {
          id?: string;
          emailbox_id: string;
          provider_message_id: string;
          subject?: string | null;
          body?: string | null;
          sender?: string | null;
          pdf_flag?: boolean;
          received_date?: string;
          attachment_path?: string | null;
          forward_status?: ForwardStatus;
          forwarded_at?: string | null;
        };
        Update: {
          id?: string;
          emailbox_id?: string;
          provider_message_id?: string;
          subject?: string | null;
          body?: string | null;
          sender?: string | null;
          pdf_flag?: boolean;
          received_date?: string;
          attachment_path?: string | null;
          forward_status?: ForwardStatus;
          forwarded_at?: string | null;
        };
        Relationships: [];
      };
      classification: {
        Row: {
          id: string;
          email_id: string;
          source: Checker;
          verdict: CheckLabel;
          confidence: number;
          model_version: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email_id: string;
          source: Checker;
          verdict: CheckLabel;
          confidence: number;
          model_version?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email_id?: string;
          source?: Checker;
          verdict?: CheckLabel;
          confidence?: number;
          model_version?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      provider: Provider;
      subscription_status: SubscriptionStatus;
      plan_tier: PlanTier;
      checker: Checker;
      check_label: CheckLabel;
      forward_status: ForwardStatus;
    };
  };
}

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export type EmailConnectionRow = Database["public"]["Tables"]["emailconnection"]["Row"];
export type EmailConnectionInsert = Database["public"]["Tables"]["emailconnection"]["Insert"];
export type EmailConnectionUpdate = Database["public"]["Tables"]["emailconnection"]["Update"];

export type EmailRow = Database["public"]["Tables"]["email"]["Row"];
export type EmailInsert = Database["public"]["Tables"]["email"]["Insert"];
export type EmailUpdate = Database["public"]["Tables"]["email"]["Update"];

export type ClassificationRow = Database["public"]["Tables"]["classification"]["Row"];
export type ClassificationInsert = Database["public"]["Tables"]["classification"]["Insert"];
export type ClassificationUpdate = Database["public"]["Tables"]["classification"]["Update"];
