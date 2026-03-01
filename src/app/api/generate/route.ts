import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { FormData } from "@/lib/types";

export const maxDuration = 300;

const SECTION_CONFIGS: Record<string, { title: string; instruction: string }> = {
  "executive-summary": {
    title: "Résumé Exécutif",
    instruction: "Rédige le résumé exécutif : vision du projet, opportunité de marché, modèle économique, besoins de financement et objectifs clés. Clair et percutant pour un banquier.",
  },
  "company-overview": {
    title: "Présentation de l'Entreprise",
    instruction: "Présente l'entreprise : histoire, mission, valeurs, structure juridique, équipe fondatrice et compétences clés. Détaille l'expérience des fondateurs.",
  },
  "market-study": {
    title: "Étude de Marché",
    instruction: "Réalise l'étude de marché : taille du marché, tendances, segments de clientèle, analyse de la demande, profil du client idéal. Utilise des données chiffrées réalistes pour la France.",
  },
  "commercial-strategy": {
    title: "Stratégie Commerciale",
    instruction: "Détaille la stratégie commerciale : positionnement, politique de prix, canaux de distribution, plan marketing, analyse concurrentielle et avantages compétitifs.",
  },
  "operational-plan": {
    title: "Plan Opérationnel",
    instruction: "Décris le plan opérationnel : processus de production/livraison, locaux, équipements, fournisseurs, planning de lancement et jalons clés.",
  },
  "financial-forecast": {
    title: "Prévisionnel Financier",
    instruction: "Génère le prévisionnel financier avec des tableaux HTML détaillés : compte de résultat prévisionnel sur 3 ans, plan de trésorerie, seuil de rentabilité, plan de financement. Les chiffres doivent être cohérents et réalistes.",
  },
  "legal-status": {
    title: "Statut Juridique",
    instruction: "Recommande et justifie le statut juridique : avantages/inconvénients, régime fiscal et social, obligations légales, démarches de création en France.",
  },
  "risks-opportunities": {
    title: "Risques & Opportunités",
    instruction: "Analyse les risques et opportunités : analyse SWOT, risques identifiés avec plans de mitigation, opportunités de développement et facteurs clés de succès.",
  },
};

const VALID_SECTION_IDS = Object.keys(SECTION_CONFIGS);

function buildSystemPrompt(sectionId: string): string {
  const config = SECTION_CONFIGS[sectionId];
  return `Tu es un consultant expert en business plans pour le marché français.

Réponds UNIQUEMENT avec du JSON valide. Pas de backticks, pas de texte avant ou après. Juste le JSON.

Structure exacte de ta réponse :
{"id":"${sectionId}","title":"${config.title}","content":"..."}

Règles pour le contenu :
- HTML valide uniquement : <h3>, <p>, <ul>, <li>, <ol>, <strong>, <em>, <table>, <thead>, <tbody>, <tr>, <th>, <td>. Pas de <h1>/<h2>.
- Données chiffrées réalistes pour le marché français.
- Ton professionnel, adapté à un dossier bancaire.
- Section détaillée et complète.

${config.instruction}`;
}

function buildUserPrompt(formData: FormData): string {
  const fundingSources =
    formData.fundingSources.length > 0
      ? formData.fundingSources.join(", ")
      : "Non précisé";

  const marketingChannels =
    formData.marketingChannels.length > 0
      ? formData.marketingChannels.join(", ")
      : "Non précisé";

  return `Projet : ${formData.projectName} — ${formData.description}
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

function cleanAndParse(raw: string): Record<string, unknown> | null {
  let text = raw.trim();

  // Remove markdown code fences
  text = text.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?\s*```\s*$/i, "");

  // Remove any text before the first { and after the last }
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    text = text.substring(firstBrace, lastBrace + 1);
  }

  // Try parsing
  try {
    return JSON.parse(text);
  } catch {
    console.log("Échec parsing direct, tentative extraction braces...");
  }

  // Regex fallback for content extraction
  const idMatch = raw.match(/"id"\s*:\s*"([^"]+)"/);
  const titleMatch = raw.match(/"title"\s*:\s*"((?:[^"\\]|\\.)*)"/);
  const contentMatch = raw.match(/"content"\s*:\s*"((?:[^"\\]|\\.)*)"/);


  if (idMatch && contentMatch) {
    let content = contentMatch[1];
    try {
      content = JSON.parse(`"${content}"`);
    } catch {
      // keep as-is
    }
    return {
      id: idMatch[1],
      title: titleMatch ? titleMatch[1] : idMatch[1],
      content,
    };
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sectionId: string | undefined = body.section;
    const formData: FormData = body.formData || body;

    if (!formData.projectName || !formData.description) {
      return NextResponse.json(
        { error: "Le nom du projet et la description sont requis." },
        { status: 400 }
      );
    }

    if (!sectionId || !VALID_SECTION_IDS.includes(sectionId)) {
      return NextResponse.json(
        { error: `Section invalide : ${sectionId}. Sections valides : ${VALID_SECTION_IDS.join(", ")}` },
        { status: 400 }
      );
    }

    console.log(`[API] Génération section: ${sectionId}`);

    const client = new Anthropic();

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: buildUserPrompt(formData),
        },
      ],
      system: buildSystemPrompt(sectionId),
    });

    const textBlock = message.content.find((block) => block.type === "text");

    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json(
        { error: "Aucune réponse textuelle reçue de l'API." },
        { status: 500 }
      );
    }

    const rawText = textBlock.text;
    console.log(`[API] Réponse brute (${sectionId}):`, rawText.substring(0, 200), "...");

    const parsed = cleanAndParse(rawText);

    if (!parsed || typeof parsed.content !== "string") {
      console.error(`[API] Parsing échoué pour ${sectionId}. Réponse brute:`, rawText);
      return NextResponse.json(
        { error: "La réponse de l'IA n'est pas un JSON valide. Veuillez réessayer." },
        { status: 500 }
      );
    }

    const config = SECTION_CONFIGS[sectionId];
    const section = {
      id: sectionId,
      title: (typeof parsed.title === "string" && parsed.title) || config.title,
      content: parsed.content,
    };

    console.log(`[API] Section ${sectionId} générée (${section.content.length} chars)`);

    return NextResponse.json(section);
  } catch (error: unknown) {
    console.error("Erreur lors de la génération:", error);

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
