import { PlanTier } from "./database.types";

export interface PlanPricingDetail {
  name: string;
  amount: string;
  description: string;
}

export const PLAN_PRICING: Record<PlanTier, PlanPricingDetail> = {
  free: {
    name: "KamiFlow Free",
    amount: "0.00",
    description: "KamiFlow Free Tier (tot 20 facturen/maand)",
  },
  starter: {
    name: "KamiFlow Starter",
    amount: "19.00",
    description: "KamiFlow Starter Abonnement (1 gekoppelde mailbox)",
  },
  pro: {
    name: "KamiFlow Pro Zen",
    amount: "49.00",
    description: "KamiFlow Pro Zen Abonnement (Onbeperkt mailboxen)",
  },
  accountant: {
    name: "KamiFlow Accountant",
    amount: "99.00",
    description: "KamiFlow Accountant Suite (Multi-salon beheer)",
  },
};
