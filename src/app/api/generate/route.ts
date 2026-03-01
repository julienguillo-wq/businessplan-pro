import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { FormData, BusinessPlan } from "@/lib/types";

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

const SYSTEM_PROMPT = `Tu es un consultant expert en business plans pour le marché français. Tu possèdes une expertise approfondie en création d'entreprise, analyse de marché, stratégie commerciale, prévisionnel financier et droit des sociétés en France.

Ta mission est de générer un business plan complet, professionnel et détaillé à partir des informations fournies par l'utilisateur. Le business plan doit être équivalent à un document de 40 pages ou plus.

Tu dois retourner UNIQUEMENT du JSON valide, sans aucun balisage markdown (pas de \`\`\`json, pas de \`\`\`). La réponse doit être directement parsable par JSON.parse().

La structure JSON attendue est exactement :
{
  "sections": [
    { "id": "executive-summary", "title": "Résumé Exécutif", "content": "..." },
    { "id": "company-overview", "title": "Présentation de l'Entreprise", "content": "..." },
    { "id": "market-study", "title": "Étude de Marché", "content": "..." },
    { "id": "commercial-strategy", "title": "Stratégie Commerciale", "content": "..." },
    { "id": "operational-plan", "title": "Plan Opérationnel", "content": "..." },
    { "id": "financial-forecast", "title": "Prévisionnel Financier", "content": "..." },
    { "id": "legal-status", "title": "Statut Juridique", "content": "..." },
    { "id": "risks-opportunities", "title": "Risques & Opportunités", "content": "..." }
  ]
}

Règles impératives pour le contenu :
- Le contenu de chaque section doit être en HTML valide utilisant les balises : <h3>, <p>, <ul>, <li>, <ol>, <strong>, <em>, <table>, <thead>, <tbody>, <tr>, <th>, <td>.
- N'utilise PAS de balises <h1> ou <h2> (réservées à la mise en page globale). Utilise <h3> pour les sous-titres au sein de chaque section.
- Chaque section doit être très détaillée et approfondie (minimum 500 mots par section, idéalement 800-1200 mots).
- Inclus des données chiffrées réalistes, des pourcentages, des analyses concrètes basées sur le marché français.
- La section "Prévisionnel Financier" doit impérativement contenir des tableaux HTML avec des projections sur 3 ans incluant : compte de résultat prévisionnel, plan de trésorerie, seuil de rentabilité, et plan de financement.
- Adapte le vocabulaire et les références réglementaires au contexte français (URSSAF, INSEE, CCI, BPI France, etc.).
- Sois précis sur les aspects juridiques, fiscaux et sociaux propres à la France.
- Utilise un ton professionnel mais accessible, adapté à un dossier bancaire ou une levée de fonds.
- Assure-toi que les données financières sont cohérentes entre elles et réalistes pour le secteur d'activité.
- Fournis des recommandations actionables et spécifiques, pas des généralités.`;

function buildUserPrompt(formData: FormData): string {
  const fundingSources =
    formData.fundingSources.length > 0
      ? formData.fundingSources.join(", ")
      : "Non précisé";

  const marketingChannels =
    formData.marketingChannels.length > 0
      ? formData.marketingChannels.join(", ")
      : "Non précisé";

  return `Génère un business plan complet et détaillé pour le projet suivant :

=== INFORMATIONS DU PROJET ===

**Nom du projet :** ${formData.projectName}
**Description :** ${formData.description}

**Secteur d'activité :** ${formData.sector}

**Localisation :**
- Ville : ${formData.city}
- Département : ${formData.department}
- Type de local : ${formData.localType}

**Équipe :**
- Nombre de fondateurs : ${formData.founders}
- Expérience dans le domaine : ${formData.experience}
- Nombre d'employés prévus : ${formData.employees}

**Financement :**
- Investissement initial estimé : ${formData.investment}
- Sources de financement : ${fundingSources}
- Objectif de chiffre d'affaires (année 1) : ${formData.revenueTarget}

**Clientèle :**
- Type de clients : ${formData.clientType}
- Client idéal : ${formData.idealClient}

**Offre :**
- Produits / Services : ${formData.products}
- Modèle de tarification : ${formData.pricingModel}

**Concurrence :**
- Principaux concurrents : ${formData.competitors}
- Avantage concurrentiel : ${formData.competitiveAdvantage}

**Marketing :**
- Canaux de marketing : ${marketingChannels}
- Budget marketing : ${formData.marketingBudget}

**Informations complémentaires :**
- Date de lancement prévue : ${formData.launchDate}
- Statut juridique envisagé : ${formData.legalStatus}
- Objectif principal du business plan : ${formData.bpObjective}

=== FIN DES INFORMATIONS ===

Génère maintenant le business plan complet avec les 8 sections demandées. Assure-toi que chaque section est très détaillée, avec des données chiffrées réalistes et des analyses approfondies adaptées au marché français. Le prévisionnel financier doit contenir des tableaux HTML détaillés avec des projections sur 3 ans.`;
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
      max_tokens: 8000,
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
