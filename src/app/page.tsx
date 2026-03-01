"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  INLINE SVG ICONS (Lucide-style, 24x24)                           */
/* ------------------------------------------------------------------ */

function FileTextIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  );
}

function BarChart3Icon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  );
}

function CalculatorIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <line x1="8" x2="16" y1="6" y2="6" />
      <line x1="16" x2="16" y1="14" y2="18" />
      <path d="M16 10h.01" />
      <path d="M12 10h.01" />
      <path d="M8 10h.01" />
      <path d="M12 14h.01" />
      <path d="M8 14h.01" />
      <path d="M12 18h.01" />
      <path d="M8 18h.01" />
    </svg>
  );
}

function TargetIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function ScaleIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="M7 21h10" />
      <path d="M12 3v18" />
      <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
    </svg>
  );
}

function ShieldIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    </svg>
  );
}

function CheckIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function ArrowRightIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function MenuIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function XIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  DATA                                                              */
/* ------------------------------------------------------------------ */

const NAV_LINKS = [
  { label: "Fonctionnalités", href: "#fonctionnalites" },
  { label: "Comment ça marche", href: "#comment-ca-marche" },
  { label: "Tarifs", href: "#tarifs" },
];

const STATS = [
  { value: "1.1M", label: "créations d'entreprise en 2024" },
  { value: "40+", label: "pages de business plan" },
  { value: "3 ans", label: "de prévisionnel financier" },
];

const FEATURES = [
  {
    icon: FileTextIcon,
    title: "Executive Summary",
    description:
      "Un résumé percutant de votre projet qui capte immédiatement l'attention des investisseurs et partenaires financiers.",
  },
  {
    icon: BarChart3Icon,
    title: "Étude de marché",
    description:
      "Analyse complète de votre secteur, de la concurrence et des tendances pour démontrer le potentiel de votre marché.",
  },
  {
    icon: CalculatorIcon,
    title: "Prévisionnel financier",
    description:
      "Compte de résultat, bilan, plan de trésorerie et seuil de rentabilité sur 3 ans, générés automatiquement.",
  },
  {
    icon: TargetIcon,
    title: "Stratégie commerciale",
    description:
      "Plan d'acquisition client, positionnement prix et canaux de distribution adaptés à votre activité.",
  },
  {
    icon: ScaleIcon,
    title: "Statut juridique",
    description:
      "Recommandation du statut juridique optimal (SAS, SARL, auto-entrepreneur...) avec analyse comparative.",
  },
  {
    icon: ShieldIcon,
    title: "Analyse SWOT",
    description:
      "Forces, faiblesses, opportunités et menaces de votre projet présentées de manière claire et structurée.",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Décrivez votre projet",
    description:
      "Répondez à 10 questions simples sur votre entreprise, votre marché et vos objectifs.",
  },
  {
    number: "02",
    title: "L'IA analyse et génère",
    description:
      "Notre intelligence artificielle crée un business plan complet et personnalisé en quelques minutes.",
  },
  {
    number: "03",
    title: "Téléchargez et convainquez",
    description:
      "Récupérez votre business plan au format PDF, prêt à présenter à votre banquier.",
  },
];

const PRICING_PLANS = [
  {
    name: "Gratuit",
    price: "0€",
    period: "",
    description: "Pour découvrir la puissance de l'IA",
    features: [
      "Aperçu du business plan",
      "Résumé exécutif complet",
      "1 génération",
    ],
    cta: "Commencer gratuitement",
    href: "/creer",
    highlighted: false,
    badge: null,
  },
  {
    name: "Essentiel",
    price: "49€",
    period: "paiement unique",
    description: "Le business plan complet pour convaincre",
    features: [
      "Business plan complet (40+ pages)",
      "Prévisionnel financier 3 ans",
      "Export PDF professionnel",
      "1 modification incluse",
    ],
    cta: "Choisir Essentiel",
    href: "/creer?plan=essentiel",
    highlighted: true,
    badge: "Populaire",
  },
  {
    name: "Pro",
    price: "19€",
    period: "/mois",
    description: "Pour les entrepreneurs ambitieux",
    features: [
      "Tout Essentiel +",
      "Générations illimitées",
      "Modifications illimitées",
      "Support prioritaire",
      "Mises à jour du plan",
    ],
    cta: "Choisir Pro",
    href: "/creer?plan=pro",
    highlighted: false,
    badge: null,
  },
];

const FOOTER_COLUMNS = [
  {
    title: "Produit",
    links: [
      { label: "Fonctionnalités", href: "#fonctionnalites" },
      { label: "Tarifs", href: "#tarifs" },
      { label: "Exemple de business plan", href: "#" },
      { label: "FAQ", href: "#" },
    ],
  },
  {
    title: "Ressources",
    links: [
      { label: "Guide du business plan", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Centre d'aide", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Légal",
    links: [
      { label: "Mentions légales", href: "#" },
      { label: "CGU", href: "#" },
      { label: "Politique de confidentialité", href: "#" },
      { label: "CGV", href: "#" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE COMPONENT                                                    */
/* ------------------------------------------------------------------ */

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route‑like clicks
  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <>
      {/* ============================================================ */}
      {/*  NAVBAR                                                      */}
      {/* ============================================================ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-navy-100/60"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between lg:h-[72px]">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 shrink-0"
              onClick={closeMobile}
            >
              <span
                className={`font-display text-xl font-bold tracking-tight transition-colors duration-300 ${
                  scrolled ? "text-navy-900" : "text-white"
                }`}
              >
                BusinessPlan{" "}
                <span className="text-cyan-400">Pro</span>
              </span>
            </Link>

            {/* Desktop links */}
            <div className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors duration-300 hover:text-cyan-400 ${
                    scrolled ? "text-navy-700" : "text-white/80 hover:text-white"
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:block">
              <Link
                href="/creer"
                className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-navy-900 shadow-lg shadow-cyan-400/25 transition-all duration-200 hover:bg-cyan-300 hover:shadow-cyan-400/40 hover:-translate-y-0.5 active:translate-y-0"
              >
                Créer mon business plan
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>

            {/* Mobile burger */}
            <button
              type="button"
              className="lg:hidden p-2 -mr-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <XIcon
                  className={`w-6 h-6 transition-colors ${
                    scrolled ? "text-navy-900" : "text-white"
                  }`}
                />
              ) : (
                <MenuIcon
                  className={`w-6 h-6 transition-colors ${
                    scrolled ? "text-navy-900" : "text-white"
                  }`}
                />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            mobileMenuOpen ? "max-h-80" : "max-h-0"
          }`}
        >
          <div className="bg-white border-t border-navy-100/60 px-4 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMobile}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-navy-700 hover:bg-navy-50 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/creer"
              onClick={closeMobile}
              className="mt-3 block w-full rounded-full bg-cyan-400 px-5 py-2.5 text-center text-sm font-semibold text-navy-900 shadow-lg shadow-cyan-400/25 transition hover:bg-cyan-300"
            >
              Créer mon business plan
            </Link>
          </div>
        </div>
      </nav>

      {/* ============================================================ */}
      {/*  HERO                                                        */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy-700 via-navy-800 to-navy-900 pt-32 pb-20 sm:pt-40 sm:pb-28 lg:pt-48 lg:pb-36">
        {/* Decorative grid / dots */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Decorative gradient orb */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-cyan-400/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-cyan-400/5 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl text-balance">
            Votre business plan{" "}
            <br className="hidden sm:inline" />
            prêt en{" "}
            <span className="text-cyan-400">10 minutes</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg sm:mt-8 lg:text-xl">
            L&apos;intelligence artificielle génère un business plan complet,
            professionnel et personnalisé pour convaincre banquiers et
            investisseurs.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:mt-12">
            <Link
              href="/creer"
              className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-7 py-3.5 text-base font-semibold text-navy-900 shadow-xl shadow-cyan-400/25 transition-all duration-200 hover:bg-cyan-300 hover:shadow-cyan-400/40 hover:-translate-y-0.5 active:translate-y-0"
            >
              Créer mon business plan gratuitement
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
            <a
              href="#exemple"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:bg-white/10 hover:border-white/40"
            >
              Voir un exemple
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  SOCIAL PROOF / STATS                                        */}
      {/* ============================================================ */}
      <section className="relative -mt-12 z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {STATS.map((stat) => (
            <div
              key={stat.value}
              className="rounded-2xl bg-white p-6 text-center shadow-lg shadow-navy-900/5 border border-navy-100/50 transition-shadow hover:shadow-xl"
            >
              <p className="font-display text-3xl font-bold text-navy-900 lg:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-navy-600 lg:text-base">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FEATURES GRID                                               */}
      {/* ============================================================ */}
      <section
        id="fonctionnalites"
        className="scroll-mt-20 py-24 sm:py-32 bg-bg"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-500">
              Fonctionnalités
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl text-balance">
              Tout ce dont vous avez besoin pour un business plan complet
            </h2>
            <p className="mt-4 text-base text-navy-600 lg:text-lg">
              Notre IA génère chaque section de votre business plan avec un
              niveau de détail professionnel.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group relative rounded-2xl border border-navy-100/50 bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-navy-900/5 hover:-translate-y-1"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500 transition-colors group-hover:bg-cyan-400 group-hover:text-white">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-navy-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  HOW IT WORKS                                                */}
      {/* ============================================================ */}
      <section
        id="comment-ca-marche"
        className="scroll-mt-20 py-24 sm:py-32 bg-white"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-500">
              Comment ça marche
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl text-balance">
              Trois étapes pour votre business plan
            </h2>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-8">
            {STEPS.map((step, idx) => (
              <div key={step.number} className="relative text-center lg:text-left">
                {/* Connecting line (desktop only) */}
                {idx < STEPS.length - 1 && (
                  <div
                    aria-hidden="true"
                    className="hidden lg:block absolute top-10 left-[calc(50%+60px)] w-[calc(100%-120px)] h-px bg-gradient-to-r from-cyan-300 to-cyan-100"
                  />
                )}
                <div className="mx-auto lg:mx-0 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-700 to-navy-900 text-white shadow-lg shadow-navy-900/20">
                  <span className="font-display text-2xl font-bold">
                    {step.number}
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-navy-900">
                  {step.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-navy-600 max-w-sm mx-auto lg:mx-0">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  PRICING                                                     */}
      {/* ============================================================ */}
      <section id="tarifs" className="scroll-mt-20 py-24 sm:py-32 bg-bg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-500">
              Tarifs
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl text-balance">
              Un prix simple, sans abonnement caché
            </h2>
            <p className="mt-4 text-base text-navy-600 lg:text-lg">
              Commencez gratuitement et passez à la version complète quand vous
              êtes prêt.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3 items-start">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 transition-all duration-300 ${
                  plan.highlighted
                    ? "bg-white border-2 border-cyan-400 shadow-xl shadow-cyan-400/10 scale-[1.02] lg:scale-105"
                    : "bg-white border border-navy-100/50 shadow-sm hover:shadow-lg"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex rounded-full bg-cyan-400 px-4 py-1 text-xs font-bold uppercase tracking-wide text-navy-900">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <h3 className="text-lg font-semibold text-navy-900">
                    {plan.name}
                  </h3>
                  <div className="mt-4 flex items-baseline justify-center gap-1">
                    <span className="font-display text-5xl font-bold text-navy-900">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-sm text-navy-500">
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-navy-500">
                    {plan.description}
                  </p>
                </div>

                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckIcon className="w-5 h-5 shrink-0 text-cyan-500 mt-0.5" />
                      <span className="text-sm text-navy-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`mt-8 block w-full rounded-full py-3 text-center text-sm font-semibold transition-all duration-200 ${
                    plan.highlighted
                      ? "bg-cyan-400 text-navy-900 shadow-lg shadow-cyan-400/25 hover:bg-cyan-300 hover:shadow-cyan-400/40 hover:-translate-y-0.5"
                      : "bg-navy-900 text-white hover:bg-navy-800 hover:-translate-y-0.5"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FINAL CTA                                                   */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy-800 to-navy-900 py-24 sm:py-32">
        {/* Decorative orb */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-cyan-400/5 blur-3xl"
        />

        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl text-balance">
            Prêt à convaincre votre banquier ?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base text-white/60 sm:text-lg">
            Rejoignez les milliers d&apos;entrepreneurs qui ont déjà créé leur
            business plan avec notre IA.
          </p>
          <div className="mt-10">
            <Link
              href="/creer"
              className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-8 py-4 text-base font-semibold text-navy-900 shadow-xl shadow-cyan-400/25 transition-all duration-200 hover:bg-cyan-300 hover:shadow-cyan-400/40 hover:-translate-y-0.5 active:translate-y-0"
            >
              Créer mon business plan gratuitement
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FOOTER                                                      */}
      {/* ============================================================ */}
      <footer className="bg-navy-900 pt-16 pb-8 sm:pt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-5">
            {/* Brand column */}
            <div className="col-span-2">
              <Link href="/" className="inline-block">
                <span className="font-display text-xl font-bold text-white">
                  BusinessPlan{" "}
                  <span className="text-cyan-400">Pro</span>
                </span>
              </Link>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
                Générez un business plan professionnel en quelques minutes grâce
                à l&apos;intelligence artificielle.
              </p>
            </div>

            {/* Link columns */}
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title}>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80">
                  {col.title}
                </h4>
                <ul className="mt-4 space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-white/50 transition-colors hover:text-cyan-400"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="mt-16 flex flex-col items-center gap-4 border-t border-white/10 pt-8 sm:flex-row sm:justify-between">
            <p className="text-xs text-white/40">
              &copy; {new Date().getFullYear()} BusinessPlan Pro. Tous droits
              réservés.
            </p>
            <div className="flex gap-6">
              <a
                href="#"
                className="text-xs text-white/40 transition-colors hover:text-white/70"
              >
                Mentions légales
              </a>
              <a
                href="#"
                className="text-xs text-white/40 transition-colors hover:text-white/70"
              >
                Confidentialité
              </a>
              <a
                href="#"
                className="text-xs text-white/40 transition-colors hover:text-white/70"
              >
                CGV
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
