"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  FormData,
  INITIAL_FORM_DATA,
  SECTORS,
  FUNDING_SOURCES,
  MARKETING_CHANNELS,
  LEGAL_STATUSES,
} from "@/lib/types";
import { saveFormData, loadFormData } from "@/lib/store";

const STEP_TITLES = [
  "Votre projet",
  "Secteur d'activit\u00e9",
  "Localisation",
  "L'\u00e9quipe",
  "Financement",
  "Client\u00e8le",
  "Offre",
  "Concurrence",
  "Marketing",
  "Lancement",
];

const LOCAL_TYPES = [
  "Pas de local",
  "Bureau",
  "Commerce/Boutique",
  "Atelier/Entrep\u00f4t",
  "Restaurant/Bar",
  "\u00c0 domicile",
  "Coworking",
];

const PRICING_MODELS = [
  "Prix fixe",
  "Abonnement",
  "Commission",
  "Freemium",
  "\u00c0 l'heure/journ\u00e9e",
  "Sur devis",
  "Mixte",
];

const BP_OBJECTIVES = [
  "Obtenir un pr\u00eat bancaire",
  "Convaincre des investisseurs",
  "Structurer mon projet",
  "Demander des aides/subventions",
  "Autre",
];

const TOTAL_STEPS = 10;

export default function CreerPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load form data from localStorage on mount
  useEffect(() => {
    const saved = loadFormData();
    setFormData(saved);
    setIsLoaded(true);
  }, []);

  // Save form data to localStorage on each step change
  useEffect(() => {
    if (isLoaded) {
      saveFormData(formData);
    }
  }, [step, isLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateField = useCallback(
    (field: keyof FormData, value: string | string[]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    []
  );

  const toggleArrayField = useCallback(
    (field: "fundingSources" | "marketingChannels", value: string) => {
      setFormData((prev) => {
        const current = prev[field] as string[];
        const next = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value];
        return { ...prev, [field]: next };
      });
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    []
  );

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.projectName.trim())
          newErrors.projectName = "Le nom du projet est requis.";
        if (!formData.description.trim())
          newErrors.description = "La description est requise.";
        break;
      case 2:
        if (!formData.sector) newErrors.sector = "Veuillez choisir un secteur.";
        break;
      case 3:
        if (!formData.city.trim()) newErrors.city = "La ville est requise.";
        if (!formData.department.trim())
          newErrors.department = "Le d\u00e9partement est requis.";
        if (!formData.localType)
          newErrors.localType = "Veuillez choisir un type de local.";
        break;
      case 4:
        if (!formData.founders)
          newErrors.founders = "Veuillez indiquer le nombre de fondateurs.";
        if (!formData.experience.trim())
          newErrors.experience = "L'exp\u00e9rience est requise.";
        if (!formData.employees.trim())
          newErrors.employees = "Veuillez indiquer le nombre d'employ\u00e9s pr\u00e9vus.";
        break;
      case 5:
        if (!formData.investment.trim())
          newErrors.investment = "L'investissement initial est requis.";
        if (formData.fundingSources.length === 0)
          newErrors.fundingSources =
            "Veuillez s\u00e9lectionner au moins une source de financement.";
        if (!formData.revenueTarget.trim())
          newErrors.revenueTarget =
            "L'objectif de chiffre d'affaires est requis.";
        break;
      case 6:
        if (!formData.clientType)
          newErrors.clientType = "Veuillez choisir un type de client\u00e8le.";
        if (!formData.idealClient.trim())
          newErrors.idealClient = "La description du client id\u00e9al est requise.";
        break;
      case 7:
        if (!formData.products.trim())
          newErrors.products =
            "La description des produits ou services est requise.";
        if (!formData.pricingModel)
          newErrors.pricingModel =
            "Veuillez choisir un mod\u00e8le de tarification.";
        break;
      case 8:
        if (!formData.competitors.trim())
          newErrors.competitors =
            "Veuillez d\u00e9crire vos principaux concurrents.";
        if (!formData.competitiveAdvantage.trim())
          newErrors.competitiveAdvantage =
            "Veuillez d\u00e9crire votre avantage concurrentiel.";
        break;
      case 9:
        if (formData.marketingChannels.length === 0)
          newErrors.marketingChannels =
            "Veuillez s\u00e9lectionner au moins un canal marketing.";
        if (!formData.marketingBudget.trim())
          newErrors.marketingBudget = "Le budget marketing est requis.";
        break;
      case 10:
        if (!formData.launchDate)
          newErrors.launchDate = "La date de lancement est requise.";
        if (!formData.legalStatus)
          newErrors.legalStatus = "Veuillez choisir un statut juridique.";
        if (!formData.bpObjective)
          newErrors.bpObjective = "Veuillez choisir un objectif.";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    saveFormData(formData);
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    saveFormData(formData);
    setErrors({});
    setStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = () => {
    if (!validateStep()) return;
    saveFormData(formData);
    router.push("/generer");
  };

  // ── Reusable UI components ──────────────────────────────────

  const Label = ({
    htmlFor,
    children,
    required = true,
  }: {
    htmlFor: string;
    children: React.ReactNode;
    required?: boolean;
  }) => (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-[#0D1B2A] mb-1.5"
    >
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );

  const ErrorMessage = ({ field }: { field: string }) =>
    errors[field] ? (
      <p className="mt-1 text-sm text-red-500">{errors[field]}</p>
    ) : null;

  const inputClass = (field: string) =>
    `w-full rounded-lg border ${
      errors[field]
        ? "border-red-400 focus:ring-red-400"
        : "border-gray-300 focus:ring-[#62B6CB]"
    } bg-white px-4 py-2.5 text-[#0D1B2A] placeholder-gray-400 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 font-sans text-sm`;

  const selectClass = (field: string) =>
    `w-full rounded-lg border ${
      errors[field]
        ? "border-red-400 focus:ring-red-400"
        : "border-gray-300 focus:ring-[#62B6CB]"
    } bg-white px-4 py-2.5 text-[#0D1B2A] shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 font-sans text-sm appearance-none`;

  // ── Step renderers ──────────────────────────────────────────

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="projectName">Nom du projet</Label>
        <input
          id="projectName"
          type="text"
          className={inputClass("projectName")}
          placeholder="Ex : Ma Boulangerie Bio"
          value={formData.projectName}
          onChange={(e) => updateField("projectName", e.target.value)}
        />
        <ErrorMessage field="projectName" />
      </div>
      <div>
        <Label htmlFor="description">
          D\u00e9crivez votre projet en quelques phrases
        </Label>
        <textarea
          id="description"
          rows={4}
          className={inputClass("description")}
          placeholder="Pr\u00e9sentez votre id\u00e9e, votre vision et ce qui vous motive..."
          value={formData.description}
          onChange={(e) => updateField("description", e.target.value)}
        />
        <ErrorMessage field="description" />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="sector">Secteur d&apos;activit\u00e9</Label>
        <select
          id="sector"
          className={selectClass("sector")}
          value={formData.sector}
          onChange={(e) => updateField("sector", e.target.value)}
        >
          <option value="">-- Choisissez un secteur --</option>
          {SECTORS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <ErrorMessage field="sector" />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="city">Ville</Label>
        <input
          id="city"
          type="text"
          className={inputClass("city")}
          placeholder="Ex : Lyon"
          value={formData.city}
          onChange={(e) => updateField("city", e.target.value)}
        />
        <ErrorMessage field="city" />
      </div>
      <div>
        <Label htmlFor="department">D\u00e9partement (ex : 75, 69, 33)</Label>
        <input
          id="department"
          type="text"
          className={inputClass("department")}
          placeholder="Ex : 69"
          value={formData.department}
          onChange={(e) => updateField("department", e.target.value)}
        />
        <ErrorMessage field="department" />
      </div>
      <div>
        <Label htmlFor="localType">Type de local</Label>
        <select
          id="localType"
          className={selectClass("localType")}
          value={formData.localType}
          onChange={(e) => updateField("localType", e.target.value)}
        >
          <option value="">-- Choisissez un type de local --</option>
          {LOCAL_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <ErrorMessage field="localType" />
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="founders">Nombre de fondateurs</Label>
        <select
          id="founders"
          className={selectClass("founders")}
          value={formData.founders}
          onChange={(e) => updateField("founders", e.target.value)}
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5+">5+</option>
        </select>
        <ErrorMessage field="founders" />
      </div>
      <div>
        <Label htmlFor="experience">
          Exp\u00e9rience pertinente des fondateurs
        </Label>
        <textarea
          id="experience"
          rows={3}
          className={inputClass("experience")}
          placeholder="D\u00e9crivez les comp\u00e9tences et exp\u00e9riences cl\u00e9s..."
          value={formData.experience}
          onChange={(e) => updateField("experience", e.target.value)}
        />
        <ErrorMessage field="experience" />
      </div>
      <div>
        <Label htmlFor="employees">
          Nombre d&apos;employ\u00e9s pr\u00e9vus la premi\u00e8re ann\u00e9e
        </Label>
        <input
          id="employees"
          type="number"
          min="0"
          className={inputClass("employees")}
          placeholder="0"
          value={formData.employees}
          onChange={(e) => updateField("employees", e.target.value)}
        />
        <ErrorMessage field="employees" />
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="investment">
          Investissement initial estim\u00e9 (&euro;)
        </Label>
        <input
          id="investment"
          type="number"
          min="0"
          className={inputClass("investment")}
          placeholder="Ex : 50000"
          value={formData.investment}
          onChange={(e) => updateField("investment", e.target.value)}
        />
        <ErrorMessage field="investment" />
      </div>
      <div>
        <Label htmlFor="fundingSources">
          Sources de financement envisag\u00e9es
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
          {FUNDING_SOURCES.map((source) => (
            <label
              key={source}
              className={`flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer transition ${
                formData.fundingSources.includes(source)
                  ? "border-[#62B6CB] bg-[#62B6CB]/10"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-[#62B6CB] focus:ring-[#62B6CB]"
                checked={formData.fundingSources.includes(source)}
                onChange={() => toggleArrayField("fundingSources", source)}
              />
              <span className="text-sm text-[#0D1B2A]">{source}</span>
            </label>
          ))}
        </div>
        <ErrorMessage field="fundingSources" />
      </div>
      <div>
        <Label htmlFor="revenueTarget">
          Objectif de chiffre d&apos;affaires ann\u00e9e 1 (&euro;)
        </Label>
        <input
          id="revenueTarget"
          type="number"
          min="0"
          className={inputClass("revenueTarget")}
          placeholder="Ex : 150000"
          value={formData.revenueTarget}
          onChange={(e) => updateField("revenueTarget", e.target.value)}
        />
        <ErrorMessage field="revenueTarget" />
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="clientType">Type de client\u00e8le</Label>
        <div className="space-y-3 mt-1">
          {[
            { value: "B2C", label: "B2C (Particuliers)" },
            { value: "B2B", label: "B2B (Entreprises)" },
            { value: "B2C+B2B", label: "Les deux" },
          ].map((option) => (
            <label
              key={option.value}
              className={`flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer transition ${
                formData.clientType === option.value
                  ? "border-[#62B6CB] bg-[#62B6CB]/10"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="clientType"
                className="h-4 w-4 border-gray-300 text-[#62B6CB] focus:ring-[#62B6CB]"
                checked={formData.clientType === option.value}
                onChange={() => updateField("clientType", option.value)}
              />
              <span className="text-sm text-[#0D1B2A]">{option.label}</span>
            </label>
          ))}
        </div>
        <ErrorMessage field="clientType" />
      </div>
      <div>
        <Label htmlFor="idealClient">D\u00e9crivez votre client id\u00e9al</Label>
        <textarea
          id="idealClient"
          rows={4}
          className={inputClass("idealClient")}
          placeholder="Qui est votre cible ? \u00c2ge, revenus, habitudes, besoins..."
          value={formData.idealClient}
          onChange={(e) => updateField("idealClient", e.target.value)}
        />
        <ErrorMessage field="idealClient" />
      </div>
    </div>
  );

  const renderStep7 = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="products">
          D\u00e9crivez vos produits ou services principaux
        </Label>
        <textarea
          id="products"
          rows={4}
          className={inputClass("products")}
          placeholder="Quels sont vos produits/services, leurs tarifs indicatifs..."
          value={formData.products}
          onChange={(e) => updateField("products", e.target.value)}
        />
        <ErrorMessage field="products" />
      </div>
      <div>
        <Label htmlFor="pricingModel">Mod\u00e8le de tarification</Label>
        <select
          id="pricingModel"
          className={selectClass("pricingModel")}
          value={formData.pricingModel}
          onChange={(e) => updateField("pricingModel", e.target.value)}
        >
          <option value="">-- Choisissez un mod\u00e8le --</option>
          {PRICING_MODELS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <ErrorMessage field="pricingModel" />
      </div>
    </div>
  );

  const renderStep8 = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="competitors">
          Qui sont vos principaux concurrents ?
        </Label>
        <textarea
          id="competitors"
          rows={4}
          className={inputClass("competitors")}
          placeholder="Nommez vos concurrents directs et indirects, leurs forces..."
          value={formData.competitors}
          onChange={(e) => updateField("competitors", e.target.value)}
        />
        <ErrorMessage field="competitors" />
      </div>
      <div>
        <Label htmlFor="competitiveAdvantage">
          Quel est votre avantage concurrentiel ?
        </Label>
        <textarea
          id="competitiveAdvantage"
          rows={4}
          className={inputClass("competitiveAdvantage")}
          placeholder="Ce qui vous diff\u00e9rencie : expertise, technologie, prix, qualit\u00e9..."
          value={formData.competitiveAdvantage}
          onChange={(e) =>
            updateField("competitiveAdvantage", e.target.value)
          }
        />
        <ErrorMessage field="competitiveAdvantage" />
      </div>
    </div>
  );

  const renderStep9 = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="marketingChannels">
          Canaux marketing envisag\u00e9s
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
          {MARKETING_CHANNELS.map((channel) => (
            <label
              key={channel}
              className={`flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer transition ${
                formData.marketingChannels.includes(channel)
                  ? "border-[#62B6CB] bg-[#62B6CB]/10"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-[#62B6CB] focus:ring-[#62B6CB]"
                checked={formData.marketingChannels.includes(channel)}
                onChange={() => toggleArrayField("marketingChannels", channel)}
              />
              <span className="text-sm text-[#0D1B2A]">{channel}</span>
            </label>
          ))}
        </div>
        <ErrorMessage field="marketingChannels" />
      </div>
      <div>
        <Label htmlFor="marketingBudget">
          Budget marketing mensuel estim\u00e9 (&euro;)
        </Label>
        <input
          id="marketingBudget"
          type="number"
          min="0"
          className={inputClass("marketingBudget")}
          placeholder="Ex : 500"
          value={formData.marketingBudget}
          onChange={(e) => updateField("marketingBudget", e.target.value)}
        />
        <ErrorMessage field="marketingBudget" />
      </div>
    </div>
  );

  const renderStep10 = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="launchDate">Date de lancement pr\u00e9vue</Label>
        <input
          id="launchDate"
          type="date"
          className={inputClass("launchDate")}
          value={formData.launchDate}
          onChange={(e) => updateField("launchDate", e.target.value)}
        />
        <ErrorMessage field="launchDate" />
      </div>
      <div>
        <Label htmlFor="legalStatus">Statut juridique envisag\u00e9</Label>
        <select
          id="legalStatus"
          className={selectClass("legalStatus")}
          value={formData.legalStatus}
          onChange={(e) => updateField("legalStatus", e.target.value)}
        >
          <option value="">-- Choisissez un statut --</option>
          {LEGAL_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <ErrorMessage field="legalStatus" />
      </div>
      <div>
        <Label htmlFor="bpObjective">
          Objectif principal du business plan
        </Label>
        <select
          id="bpObjective"
          className={selectClass("bpObjective")}
          value={formData.bpObjective}
          onChange={(e) => updateField("bpObjective", e.target.value)}
        >
          <option value="">-- Choisissez un objectif --</option>
          {BP_OBJECTIVES.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ErrorMessage field="bpObjective" />
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      case 6:
        return renderStep6();
      case 7:
        return renderStep7();
      case 8:
        return renderStep8();
      case 9:
        return renderStep9();
      case 10:
        return renderStep10();
      default:
        return null;
    }
  };

  // ── Render ──────────────────────────────────────────────────

  // Avoid hydration mismatch by waiting for client load
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#F8FAFB] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#62B6CB] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFB] font-sans">
      {/* Top progress section */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="mx-auto max-w-2xl px-4 py-4">
          {/* Step indicator text */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-[#1B4965]">
              \u00c9tape {step} sur {TOTAL_STEPS}
            </p>
            <p className="text-sm font-medium text-[#0D1B2A]">
              {STEP_TITLES[step - 1]}
            </p>
          </div>

          {/* Progress bar */}
          <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#62B6CB] transition-all duration-500 ease-out"
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Form card */}
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6 sm:p-8">
          {/* Step title */}
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0D1B2A] mb-2">
            {STEP_TITLES[step - 1]}
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            {step === 1 && "Commencez par nous parler de votre id\u00e9e."}
            {step === 2 && "Dans quel domaine \u00e9volue votre projet ?"}
            {step === 3 && "O\u00f9 sera bas\u00e9e votre activit\u00e9 ?"}
            {step === 4 && "Parlez-nous de votre \u00e9quipe fondatrice."}
            {step === 5 && "D\u00e9taillons les aspects financiers."}
            {step === 6 && "\u00c0 qui s'adresse votre offre ?"}
            {step === 7 && "Que proposez-vous exactement ?"}
            {step === 8 && "Analysons votre environnement concurrentiel."}
            {step === 9 && "Comment allez-vous vous faire conna\u00eetre ?"}
            {step === 10 && "Derni\u00e8re ligne droite avant la g\u00e9n\u00e9ration !"}
          </p>

          {/* Dynamic step content */}
          <div className="transition-opacity duration-300">
            {renderCurrentStep()}
          </div>

          {/* Navigation buttons */}
          <div className="mt-10 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-[#1B4965] shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#62B6CB] focus:ring-offset-2"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
                Retour
              </button>
            ) : (
              <div />
            )}

            {step < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 rounded-lg bg-[#1B4965] px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#62B6CB] focus:ring-offset-2"
              >
                Continuer
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 rounded-lg bg-[#62B6CB] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#4fa3b8] focus:outline-none focus:ring-2 focus:ring-[#62B6CB] focus:ring-offset-2"
              >
                G\u00e9n\u00e9rer mon business plan \ud83d\ude80
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
