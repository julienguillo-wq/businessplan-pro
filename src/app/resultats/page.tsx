"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BusinessPlan, FormData, BP_SECTIONS } from "@/lib/types";
import { loadPlanData, loadFormData } from "@/lib/store";

export default function ResultatsPage() {
  const router = useRouter();
  const [plan, setPlan] = useState<BusinessPlan | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [activeSection, setActiveSection] = useState<string>(
    BP_SECTIONS[0].id
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedPlan = loadPlanData();
    const storedForm = loadFormData();

    if (!storedPlan || !storedPlan.sections || storedPlan.sections.length === 0) {
      router.push("/creer");
      return;
    }

    setPlan(storedPlan);
    setFormData(storedForm);
    setIsLoading(false);
  }, [router]);

  // Scroll spy with IntersectionObserver
  useEffect(() => {
    if (!plan) return;

    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      // Find the topmost visible section
      const visibleEntries = entries.filter((entry) => entry.isIntersecting);
      if (visibleEntries.length > 0) {
        // Sort by bounding rect top to get the topmost visible section
        const sorted = visibleEntries.sort(
          (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
        );
        const topEntry = sorted[0];
        if (topEntry.target.id) {
          setActiveSection(topEntry.target.id);
        }
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersect, {
      rootMargin: "-80px 0px -60% 0px",
      threshold: 0,
    });

    // Observe all section elements
    BP_SECTIONS.forEach(({ id }) => {
      const el = sectionRefs.current[id];
      if (el) {
        observerRef.current?.observe(el);
      }
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [plan]);

  const scrollToSection = useCallback((sectionId: string) => {
    const el = sectionRefs.current[sectionId];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setSidebarOpen(false);
  }, []);

  const setSectionRef = useCallback(
    (id: string) => (el: HTMLElement | null) => {
      sectionRefs.current[id] = el;
    },
    []
  );

  // Find content for a given section id
  const getSectionContent = (sectionId: string): string => {
    if (!plan) return "";
    const section = plan.sections.find((s) => s.id === sectionId);
    return section?.content || "";
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-navy-700 font-sans text-lg">
            Chargement du business plan...
          </p>
        </div>
      </div>
    );
  }

  // No data state
  if (!plan || !plan.sections || plan.sections.length === 0) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-navy-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h2 className="font-display text-2xl text-navy-900 mb-3">
            Aucun business plan trouv&eacute;
          </h2>
          <p className="text-navy-600 font-sans mb-8 leading-relaxed">
            Vous n&apos;avez pas encore g&eacute;n&eacute;r&eacute; de business
            plan. Commencez par remplir le formulaire pour cr&eacute;er le
            v&ocirc;tre.
          </p>
          <Link
            href="/creer"
            className="inline-flex items-center gap-2 bg-cyan-400 hover:bg-cyan-500 text-white font-sans font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Cr&eacute;er mon business plan
          </Link>
        </div>
      </div>
    );
  }

  const projectName = formData?.projectName || "Mon Business Plan";

  return (
    <div className="min-h-screen bg-bg font-sans">
      {/* ------------------------------------------------------------------ */}
      {/* HEADER BAR - fixed top                                              */}
      {/* ------------------------------------------------------------------ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-navy-100 h-16">
        <div className="h-full flex items-center justify-between px-4 lg:px-8">
          {/* Left: hamburger (mobile) + logo */}
          <div className="flex items-center gap-3">
            {/* Hamburger button - mobile only */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 -ml-2 text-navy-700 hover:text-navy-900 hover:bg-navy-50 rounded-lg transition-colors"
              aria-label="Ouvrir le sommaire"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {sidebarOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 text-navy-900 hover:text-navy-700 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-navy-700 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <span className="font-display text-lg font-bold hidden sm:inline">
                BusinessPlan Pro
              </span>
            </Link>
          </div>

          {/* Center: project name */}
          <div className="hidden md:flex items-center justify-center flex-1 min-w-0 px-4">
            <h1 className="font-display text-lg text-navy-900 truncate">
              {projectName}
            </h1>
          </div>

          {/* Right: action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/creer"
              className="inline-flex items-center gap-1.5 text-navy-700 hover:text-navy-900 font-sans text-sm font-medium px-3 py-2 rounded-lg hover:bg-navy-50 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              <span className="hidden sm:inline">Modifier</span>
            </Link>
            <button className="inline-flex items-center gap-1.5 bg-cyan-400 hover:bg-cyan-500 text-white font-sans text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm shadow-cyan-400/20">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="hidden sm:inline">Exporter PDF</span>
              <span className="hidden sm:inline">&mdash;</span>
              <span className="hidden sm:inline">49&euro;</span>
              <span className="sm:hidden">PDF</span>
            </button>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* SIDEBAR OVERLAY - mobile only                                       */}
      {/* ------------------------------------------------------------------ */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-navy-900/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ------------------------------------------------------------------ */}
      {/* LEFT SIDEBAR                                                        */}
      {/* ------------------------------------------------------------------ */}
      <aside
        className={`
          fixed top-16 left-0 bottom-0 z-40 w-72
          bg-white border-r border-navy-100
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <nav className="h-full overflow-y-auto py-8 px-4">
          <h2 className="font-display text-sm font-bold text-navy-400 uppercase tracking-wider px-4 mb-6">
            Sommaire
          </h2>
          <ul className="space-y-1">
            {BP_SECTIONS.map((section, index) => {
              const isActive = activeSection === section.id;
              return (
                <li key={section.id}>
                  <button
                    onClick={() => scrollToSection(section.id)}
                    className={`
                      w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg
                      font-sans text-sm transition-all duration-200
                      ${
                        isActive
                          ? "bg-cyan-50 text-navy-900 font-semibold border-l-[3px] border-cyan-400 -ml-px"
                          : "text-navy-600 hover:bg-navy-50 hover:text-navy-900 border-l-[3px] border-transparent -ml-px"
                      }
                    `}
                  >
                    <span
                      className={`
                        flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center
                        text-xs font-bold transition-colors duration-200
                        ${
                          isActive
                            ? "bg-cyan-400 text-white"
                            : "bg-navy-100 text-navy-500"
                        }
                      `}
                    >
                      {index + 1}
                    </span>
                    <span className="truncate">{section.title}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Sidebar footer */}
          <div className="mt-10 px-4 pt-6 border-t border-navy-100">
            <p className="text-xs text-navy-400 font-sans leading-relaxed">
              Ce business plan a &eacute;t&eacute; g&eacute;n&eacute;r&eacute;
              par intelligence artificielle. V&eacute;rifiez les
              donn&eacute;es avant utilisation.
            </p>
          </div>
        </nav>
      </aside>

      {/* ------------------------------------------------------------------ */}
      {/* MAIN CONTENT AREA                                                   */}
      {/* ------------------------------------------------------------------ */}
      <main className="pt-16 lg:pl-72">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-14">
          {/* Document title block - mobile project name */}
          <div className="md:hidden mb-8">
            <h1 className="font-display text-2xl text-navy-900 font-bold">
              {projectName}
            </h1>
            <div className="mt-2 h-1 w-16 bg-gradient-to-r from-cyan-400 to-cyan-200 rounded-full" />
          </div>

          {/* Sections */}
          {BP_SECTIONS.map((section, index) => {
            const content = getSectionContent(section.id);
            const isLast = index === BP_SECTIONS.length - 1;

            return (
              <section
                key={section.id}
                id={section.id}
                ref={setSectionRef(section.id)}
                className="scroll-mt-24 mb-6"
              >
                <div className="bg-white rounded-2xl shadow-sm border border-navy-100/60 p-6 sm:p-8 lg:p-10">
                  {/* Section header */}
                  <div className="flex items-start gap-4 mb-6">
                    <span className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-cyan-400/20">
                      {index + 1}
                    </span>
                    <div>
                      <h2 className="font-display text-2xl sm:text-3xl text-navy-900 font-bold leading-tight">
                        {section.title}
                      </h2>
                    </div>
                  </div>

                  {/* Section content */}
                  {content ? (
                    <div
                      className="bp-content font-sans text-navy-800 leading-[1.8] text-[15px] sm:text-base"
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  ) : (
                    <div className="py-8 text-center">
                      <p className="text-navy-400 font-sans italic">
                        Contenu non disponible pour cette section.
                      </p>
                    </div>
                  )}
                </div>

                {/* Divider between sections */}
                {!isLast && (
                  <div className="flex items-center justify-center py-4">
                    <div className="h-px w-16 bg-gradient-to-r from-transparent via-navy-200 to-transparent" />
                  </div>
                )}
              </section>
            );
          })}

          {/* Bottom CTA */}
          <div className="mt-12 mb-8 bg-gradient-to-br from-navy-900 to-navy-700 rounded-2xl p-8 sm:p-10 text-center">
            <h3 className="font-display text-2xl text-white font-bold mb-3">
              Votre business plan est pr&ecirc;t
            </h3>
            <p className="text-navy-200 font-sans mb-8 max-w-lg mx-auto leading-relaxed">
              T&eacute;l&eacute;chargez votre business plan au format PDF,
              mis en page professionnellement, pr&ecirc;t &agrave;
              pr&eacute;senter &agrave; vos partenaires et investisseurs.
            </p>
            <button className="inline-flex items-center gap-2 bg-cyan-400 hover:bg-cyan-500 text-white font-sans font-semibold px-8 py-3.5 rounded-xl transition-colors shadow-lg shadow-cyan-400/20 text-lg">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Exporter PDF &mdash; 49&euro;
            </button>
          </div>
        </div>
      </main>

      {/* ------------------------------------------------------------------ */}
      {/* GLOBAL STYLES for rendered HTML content                             */}
      {/* ------------------------------------------------------------------ */}
      <style jsx global>{`
        .bp-content p {
          margin-bottom: 1.15em;
        }

        .bp-content h3 {
          font-family: var(--font-playfair), Georgia, serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: #0d1b2a;
          margin-top: 1.75em;
          margin-bottom: 0.75em;
        }

        .bp-content h4 {
          font-family: var(--font-playfair), Georgia, serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: #1b4965;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
        }

        .bp-content ul,
        .bp-content ol {
          margin-bottom: 1.15em;
          padding-left: 1.5em;
        }

        .bp-content ul {
          list-style-type: disc;
        }

        .bp-content ol {
          list-style-type: decimal;
        }

        .bp-content li {
          margin-bottom: 0.4em;
          line-height: 1.7;
        }

        .bp-content li::marker {
          color: #62b6cb;
        }

        .bp-content strong,
        .bp-content b {
          font-weight: 600;
          color: #0d1b2a;
        }

        .bp-content em,
        .bp-content i {
          font-style: italic;
        }

        .bp-content table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 1.5em;
          font-size: 0.9em;
        }

        .bp-content thead th {
          background: #f0f5f8;
          color: #1b4965;
          font-weight: 600;
          text-align: left;
          padding: 0.75em 1em;
          border-bottom: 2px solid #c5d5de;
        }

        .bp-content tbody td {
          padding: 0.65em 1em;
          border-bottom: 1px solid #e8eef2;
          vertical-align: top;
        }

        .bp-content tbody tr:last-child td {
          border-bottom: none;
        }

        .bp-content blockquote {
          border-left: 3px solid #62b6cb;
          margin: 1.25em 0;
          padding: 0.75em 1.25em;
          background: #f0f9fb;
          border-radius: 0 0.5rem 0.5rem 0;
          color: #1b4965;
          font-style: italic;
        }

        .bp-content a {
          color: #62b6cb;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .bp-content a:hover {
          color: #1b4965;
        }

        .bp-content hr {
          border: none;
          height: 1px;
          background: linear-gradient(to right, transparent, #c5d5de, transparent);
          margin: 2em 0;
        }
      `}</style>
    </div>
  );
}
