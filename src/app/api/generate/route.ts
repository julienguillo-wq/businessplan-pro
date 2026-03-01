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

const SECTION_TITLES: Record<string, string> = {
  "executive-summary": "Résumé Exécutif",
  "company-overview": "Présentation de l'Entreprise",
  "market-study": "Étude de Marché",
  "commercial-strategy": "Stratégie Commerciale",
  "operational-plan": "Plan Opérationnel",
  "financial-forecast": "Prévisionnel Financier",
  "legal-status": "Statut Juridique",
  "risks-opportunities": "Risques & Opportunités",
};

const SYSTEM_PROMPT = `Tu es un consultant expert en business plans pour le marché français. Génère un business plan professionnel à partir des informations fournies.

Réponds UNIQUEMENT avec du JSON valide, sans backticks, sans texte avant ou après. Pas de \`\`\`json, pas de \`\`\`, pas de commentaire. Juste le JSON.

Structure exacte :
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

function cleanRawResponse(raw: string): string {
  let text = raw.trim();

  // Remove markdown code fences (```json ... ``` or ``` ... ```)
  text = text.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?\s*```\s*$/i, "");

  // Remove any text before the first {
  const firstBrace = text.indexOf("{");
  if (firstBrace > 0) {
    text = text.substring(firstBrace);
  }

  // Remove any text after the last }
  const lastBrace = text.lastIndexOf("}");
  if (lastBrace >= 0 && lastBrace < text.length - 1) {
    text = text.substring(0, lastBrace + 1);
  }

  return text.trim();
}

function extractSectionsWithRegex(raw: string): BusinessPlan | null {
  const sections: BusinessPlan["sections"] = [];

  for (const id of SECTION_IDS) {
    // Match "id":"<section-id>" ... "content":"<content>"
    // Account for varying key order: id/title/content can appear in any order
    const sectionRegex = new RegExp(
      `\\{[^{}]*"id"\\s*:\\s*"${id}"[^{}]*"content"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"[^{}]*\\}`,
      "s"
    );
    let match = raw.match(sectionRegex);

    // Try alternate key order: content before id
    if (!match) {
      const altRegex = new RegExp(
        `\\{[^{}]*"content"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"[^{}]*"id"\\s*:\\s*"${id}"[^{}]*\\}`,
        "s"
      );
      match = raw.match(altRegex);
    }

    if (match) {
      let content = match[1];
      // Unescape JSON string escapes
      try {
        content = JSON.parse(`"${content}"`);
      } catch {
        // Keep as-is if unescape fails
      }
      sections.push({
        id,
        title: SECTION_TITLES[id] || id,
        content,
      });
    }
  }

  if (sections.length >= 4) {
    // Fill missing sections with placeholder
    for (const id of SECTION_IDS) {
      if (!sections.find((s) => s.id === id)) {
        sections.push({
          id,
          title: SECTION_TITLES[id] || id,
          content: "<p><em>Section en cours de génération. Veuillez régénérer le business plan.</em></p>",
        });
      }
    }
    // Sort by SECTION_IDS order
    sections.sort(
      (a, b) => SECTION_IDS.indexOf(a.id as typeof SECTION_IDS[number]) - SECTION_IDS.indexOf(b.id as typeof SECTION_IDS[number])
    );
    return { sections };
  }

  return null;
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

    const rawText = textBlock.text;
    console.log("=== RÉPONSE BRUTE CLAUDE ===");
    console.log(rawText.substring(0, 500));
    console.log("...");
    console.log(rawText.substring(rawText.length - 300));
    console.log("=== FIN RÉPONSE (longueur:", rawText.length, "chars) ===");

    // Step 1: Clean the response
    const cleaned = cleanRawResponse(rawText);
    console.log("=== APRÈS NETTOYAGE (premiers 200 chars) ===");
    console.log(cleaned.substring(0, 200));

    // Step 2: Try direct JSON parse
    let parsed: unknown;
    try {
      parsed = JSON.parse(cleaned);
      console.log("JSON parsé directement avec succès");
    } catch (parseError) {
      console.log("Échec parsing direct:", parseError instanceof Error ? parseError.message : parseError);

      // Step 3: Try extracting the outermost JSON object
      const firstBrace = cleaned.indexOf("{");
      const lastBrace = cleaned.lastIndexOf("}");
      if (firstBrace >= 0 && lastBrace > firstBrace) {
        const extracted = cleaned.substring(firstBrace, lastBrace + 1);
        try {
          parsed = JSON.parse(extracted);
          console.log("JSON parsé après extraction braces");
        } catch {
          console.log("Échec parsing après extraction braces");
        }
      }

      // Step 4: Fallback — extract sections individually with regex
      if (!parsed) {
        console.log("Tentative extraction par regex...");
        const regexResult = extractSectionsWithRegex(rawText);
        if (regexResult) {
          console.log(`Regex: ${regexResult.sections.length} sections extraites`);
          parsed = regexResult;
        } else {
          console.error("Toutes les méthodes de parsing ont échoué");
          console.error("Réponse brute complète:", rawText);
          return NextResponse.json(
            {
              error:
                "La réponse de l'IA n'est pas un JSON valide. Veuillez réessayer.",
            },
            { status: 500 }
          );
        }
      }
    }

    if (!validateBusinessPlan(parsed)) {
      console.error("Validation échouée. Structure reçue:", JSON.stringify(parsed).substring(0, 500));
      // Try regex fallback on validation failure too
      const regexResult = extractSectionsWithRegex(rawText);
      if (regexResult && validateBusinessPlan(regexResult)) {
        console.log("Récupéré via regex après échec validation");
        return NextResponse.json(regexResult);
      }
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
