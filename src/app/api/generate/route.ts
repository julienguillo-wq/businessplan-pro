import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { FormData, BusinessPlan } from "@/lib/types";

export const maxDuration = 300;

const SECTION_IDS = [
  "executive-summary",
  "company-overview",
  "market-study",
  "commercial-strategy",
  "operational-plan",
  "financial-forecast",
  "legal-status",
  "risks-opportunities",
] as const;

const SYSTEM_PROMPT = `Tu es un consultant expert en business plans pour le marché français. Génère un business plan professionnel à partir des informations fournies.

Retourne UNIQUEMENT du JSON valide (pas de \`\`\`json). Structure exacte :
{"sections":[{"id":"...","title":"...","content":"..."},…]}

Les 8 sections (dans cet ordre) : executive-summary, company-overview, market-study, commercial-strategy, operational-plan, financial-forecast, legal-status, risks-opportunities.

Règles :
- Contenu en HTML (<h3>, <p>, <ul>, <li>, <strong>, <em>, <table>). Pas de <h1>/<h2>.
- Données chiffrées réalistes pour le marché français.
- Section financial-forecast : tableaux HTML avec projections 3 ans (compte de résultat, trésorerie, seuil de rentabilité).
- Ton professionnel, adapté à un dossier bancaire.
- Sois concis mais complet.`;

function buildUserPrompt(formData: FormData): string {
  const fundingSources =
    formData.fundingSources.length > 0
      ? formData.fundingSources.join(", ")
      : "Non précisé";

  const marketingChannels =
    formData.marketingChannels.length > 0
      ? formData.marketingChannels.join(", ")
      : "Non précisé";

  return `Génère un business plan pour ce projet :

Projet : ${formData.projectName} — ${formData.description}
Secteur : ${formData.sector}
Lieu : ${formData.city} (${formData.department}), local : ${formData.localType}
Équipe : ${formData.founders} fondateur(s), ${formData.employees} employés prévus. Expérience : ${formData.experience}
Investissement : ${formData.investment}€, financement : ${fundingSources}, CA visé an 1 : ${formData.revenueTarget}€
Clients : ${formData.clientType}, cible : ${formData.idealClient}
Offre : ${formData.products} (tarification : ${formData.pricingModel})
Concurrents : ${formData.competitors}. Avantage : ${formData.competitiveAdvantage}
Marketing : ${marketingChannels}, budget : ${formData.marketingBudget}€/mois
Lancement : ${formData.launchDate}, statut : ${formData.legalStatus}, objectif BP : ${formData.bpObjective}`;
}

function validateBusinessPlan(data: unknown): data is BusinessPlan {
  if (!data || typeof data !== "object") return false;

  const plan = data as Record<string, unknown>;
  if (!Array.isArray(plan.sections)) return false;
  if (plan.sections.length !== 8) return false;

  for (const section of plan.sections) {
    if (typeof section !== "object" || section === null) return false;
    const s = section as Record<string, unknown>;
    if (typeof s.id !== "string") return false;
    if (typeof s.title !== "string") return false;
    if (typeof s.content !== "string") return false;
    if (!SECTION_IDS.includes(s.id as (typeof SECTION_IDS)[number])) return false;
  }

  return true;
}

export async function POST(request: Request) {
  try {
    const formData: FormData = await request.json();

    if (!formData.projectName || !formData.description) {
      return NextResponse.json(
        { error: "Le nom du projet et la description sont requis." },
        { status: 400 }
      );
    }

    const client = new Anthropic();

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 3000,
      messages: [
        {
          role: "user",
          content: buildUserPrompt(formData),
        },
      ],
      system: SYSTEM_PROMPT,
    });

    const textBlock = message.content.find((block) => block.type === "text");

    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json(
        { error: "Aucune réponse textuelle reçue de l'API." },
        { status: 500 }
      );
    }

    let rawText = textBlock.text.trim();

    // Strip markdown code fences if the model wraps the JSON despite instructions
    if (rawText.startsWith("```")) {
      rawText = rawText
        .replace(/^```(?:json)?\s*\n?/, "")
        .replace(/\n?\s*```$/, "");
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      // Attempt to extract JSON object from surrounding text
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[0]);
        } catch {
          return NextResponse.json(
            {
              error:
                "La réponse de l'IA n'est pas un JSON valide. Veuillez réessayer.",
            },
            { status: 500 }
          );
        }
      } else {
        return NextResponse.json(
          {
            error:
              "La réponse de l'IA n'est pas un JSON valide. Veuillez réessayer.",
          },
          { status: 500 }
        );
      }
    }

    if (!validateBusinessPlan(parsed)) {
      return NextResponse.json(
        {
          error:
            "La structure du business plan est invalide. Veuillez réessayer.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);
  } catch (error: unknown) {
    console.error("Erreur lors de la génération du business plan:", error);

    if (error instanceof Anthropic.APIError) {
      const statusMessages: Record<number, string> = {
        401: "Clé API Anthropic invalide. Vérifiez votre configuration.",
        429: "Trop de requêtes. Veuillez patienter avant de réessayer.",
        529: "L'API Anthropic est temporairement surchargée. Réessayez dans quelques instants.",
      };

      const message =
        statusMessages[error.status] ||
        `Erreur de l'API Anthropic: ${error.message}`;

      return NextResponse.json(
        { error: message },
        { status: error.status || 500 }
      );
    }

    const message =
      error instanceof Error ? error.message : "Erreur interne du serveur";

    return NextResponse.json(
      { error: `Erreur lors de la génération: ${message}` },
      { status: 500 }
    );
  }
}
