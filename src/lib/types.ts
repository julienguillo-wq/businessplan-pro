export interface FormData {
  // Step 1
  projectName: string;
  description: string;
  // Step 2
  sector: string;
  // Step 3
  city: string;
  department: string;
  localType: string;
  // Step 4
  founders: string;
  experience: string;
  employees: string;
  // Step 5
  investment: string;
  fundingSources: string[];
  revenueTarget: string;
  // Step 6
  clientType: string;
  idealClient: string;
  // Step 7
  products: string;
  pricingModel: string;
  // Step 8
  competitors: string;
  competitiveAdvantage: string;
  // Step 9
  marketingChannels: string[];
  marketingBudget: string;
  // Step 10
  launchDate: string;
  legalStatus: string;
  bpObjective: string;
}

export interface BusinessPlanSection {
  id: string;
  title: string;
  content: string;
}

export interface BusinessPlan {
  sections: BusinessPlanSection[];
}

export const INITIAL_FORM_DATA: FormData = {
  projectName: "",
  description: "",
  sector: "",
  city: "",
  department: "",
  localType: "",
  founders: "1",
  experience: "",
  employees: "0",
  investment: "",
  fundingSources: [],
  revenueTarget: "",
  clientType: "",
  idealClient: "",
  products: "",
  pricingModel: "",
  competitors: "",
  competitiveAdvantage: "",
  marketingChannels: [],
  marketingBudget: "",
  launchDate: "",
  legalStatus: "",
  bpObjective: "",
};

export const SECTORS = [
  "Restaurant / Bar / Café",
  "Commerce de détail",
  "E-commerce",
  "Services B2B",
  "Services aux particuliers",
  "Artisanat / BTP",
  "Santé / Bien-être",
  "Tech / SaaS",
  "Formation / Coaching",
  "Transport / Logistique",
  "Immobilier",
  "Autre",
];

export const FUNDING_SOURCES = [
  "Apport personnel",
  "Prêt bancaire",
  "Love money (famille/amis)",
  "Business angels",
  "Subventions / Aides publiques",
  "Crowdfunding",
  "Prêt d'honneur",
  "Capital-risque",
];

export const MARKETING_CHANNELS = [
  "Réseaux sociaux (Instagram, Facebook, TikTok)",
  "Google Ads / SEA",
  "Référencement naturel (SEO)",
  "Emailing / Newsletter",
  "Bouche-à-oreille",
  "Événements / Salons",
  "Partenariats",
  "Affichage / Flyers",
  "Relations presse",
  "Influenceurs",
];

export const LEGAL_STATUSES = [
  "Auto-entrepreneur (micro-entreprise)",
  "EURL",
  "SARL",
  "SAS",
  "SASU",
  "SA",
  "SCI",
  "Association",
  "Je ne sais pas encore",
];

export const BP_SECTIONS = [
  { id: "executive-summary", title: "Résumé Exécutif" },
  { id: "company-overview", title: "Présentation de l'Entreprise" },
  { id: "market-study", title: "Étude de Marché" },
  { id: "commercial-strategy", title: "Stratégie Commerciale" },
  { id: "operational-plan", title: "Plan Opérationnel" },
  { id: "financial-forecast", title: "Prévisionnel Financier" },
  { id: "legal-status", title: "Statut Juridique" },
  { id: "risks-opportunities", title: "Risques & Opportunités" },
];
