"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { loadFormData, savePlanData } from "@/lib/store";
import { FormData, BusinessPlanSection, BP_SECTIONS } from "@/lib/types";

const SECTION_LABELS = BP_SECTIONS.map((s) => ({
  id: s.id,
  label: s.title,
}));

export default function GenererPage() {
  const router = useRouter();
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isRunningRef = useRef(false);
  const sectionsRef = useRef<BusinessPlanSection[]>([]);

  const progress = Math.round(
    (completedSections.length / SECTION_LABELS.length) * 100
  );

  const startGeneration = useCallback(async () => {
    if (isRunningRef.current) return;
    isRunningRef.current = true;

    setError(null);
    setCompletedSections([]);
    setCurrentSection(null);
    sectionsRef.current = [];

    const formData: FormData = loadFormData();

    for (const section of SECTION_LABELS) {
      setCurrentSection(section.id);

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ section: section.id, formData }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(
            errorData?.error || `Erreur serveur (${response.status})`
          );
        }

        const sectionData: BusinessPlanSection = await response.json();
        sectionsRef.current.push(sectionData);

        setCompletedSections((prev) => [...prev, section.id]);
      } catch (err: unknown) {
        isRunningRef.current = false;
        setCurrentSection(null);
        setError(
          err instanceof Error
            ? err.message
            : "Une erreur est survenue lors de la génération. Veuillez réessayer."
        );
        return;
      }
    }

    // All sections done
    setCurrentSection(null);
    const plan = { sections: sectionsRef.current };
    savePlanData(plan);

    setTimeout(() => {
      router.push("/resultats");
    }, 800);

    isRunningRef.current = false;
  }, [router]);

  useEffect(() => {
    startGeneration();
  }, [startGeneration]);

  return (
    <div className="min-h-screen bg-[#0D1B2A] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl flex flex-col items-center">
        {/* Brain Icon */}
        <div className="animate-brain-pulse mb-8">
          <svg
            width="96"
            height="96"
            viewBox="0 0 96 96"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-[#62B6CB]"
          >
            <path
              d="M44 20C38 20 33 23 31 28C27 27 22 30 21 35C18 36 16 40 17 44C15 47 15 52 18 55C17 59 19 63 23 65C23 69 26 72 30 73C32 77 37 79 42 78L44 78V20Z"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="rgba(98, 182, 203, 0.08)"
            />
            <path
              d="M52 20C58 20 63 23 65 28C69 27 74 30 75 35C78 36 80 40 79 44C81 47 81 52 78 55C79 59 77 63 73 65C73 69 70 72 66 73C64 77 59 79 54 78L52 78V20Z"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="rgba(98, 182, 203, 0.08)"
            />
            <path d="M48 18V80" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
            <path d="M28 40L38 36M24 52L36 48M30 64L40 58" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            <path d="M68 40L58 36M72 52L60 48M66 64L56 58" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            <circle cx="28" cy="40" r="2.5" fill="currentColor" opacity="0.7" />
            <circle cx="24" cy="52" r="2.5" fill="currentColor" opacity="0.7" />
            <circle cx="30" cy="64" r="2.5" fill="currentColor" opacity="0.7" />
            <circle cx="38" cy="36" r="2" fill="currentColor" opacity="0.5" />
            <circle cx="36" cy="48" r="2" fill="currentColor" opacity="0.5" />
            <circle cx="40" cy="58" r="2" fill="currentColor" opacity="0.5" />
            <circle cx="68" cy="40" r="2.5" fill="currentColor" opacity="0.7" />
            <circle cx="72" cy="52" r="2.5" fill="currentColor" opacity="0.7" />
            <circle cx="66" cy="64" r="2.5" fill="currentColor" opacity="0.7" />
            <circle cx="58" cy="36" r="2" fill="currentColor" opacity="0.5" />
            <circle cx="60" cy="48" r="2" fill="currentColor" opacity="0.5" />
            <circle cx="56" cy="58" r="2" fill="currentColor" opacity="0.5" />
            <path d="M38 36L58 36M36 48L60 48M40 58L56 58" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeDasharray="3 3" opacity="0.3" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="font-display text-2xl sm:text-3xl text-white text-center mb-3">
          Génération de votre business plan...
        </h1>

        {/* Subtitle */}
        <p className="text-gray-400 font-sans text-center text-sm sm:text-base mb-10 max-w-md">
          Notre IA rédige chaque section de votre plan personnalisé
        </p>

        {/* Progress Bar */}
        <div className="w-full mb-3">
          <div className="w-full h-3 rounded-full bg-[#1B4965] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #62B6CB 0%, #8DD0DE 100%)",
              }}
            />
          </div>
          <p className="text-right text-sm text-[#62B6CB] font-sans mt-2 tabular-nums">
            {completedSections.length} / {SECTION_LABELS.length} sections
          </p>
        </div>

        {/* Checklist */}
        <div className="w-full space-y-4 mt-6">
          {SECTION_LABELS.map((item) => {
            const isChecked = completedSections.includes(item.id);
            const isActive = currentSection === item.id;
            const isPending = !isChecked && !isActive;

            return (
              <div
                key={item.id}
                className={`flex items-center gap-3 transition-opacity duration-500 ${
                  isPending ? "opacity-40" : "opacity-100"
                }`}
              >
                {/* Circle / Checkmark */}
                <div
                  className={`relative flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isChecked
                      ? "bg-[#62B6CB] border-2 border-[#62B6CB]"
                      : isActive
                      ? "border-2 border-[#62B6CB] bg-transparent"
                      : "border-2 border-gray-600 bg-transparent"
                  }`}
                >
                  {isChecked && (
                    <svg
                      className="w-4 h-4 text-[#0D1B2A] animate-check-in"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M3.5 8.5L6.5 11.5L12.5 5"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                  {isActive && (
                    <div className="w-2 h-2 rounded-full bg-[#62B6CB] animate-pulse" />
                  )}
                </div>

                {/* Label */}
                <span
                  className={`font-sans text-sm sm:text-base transition-colors duration-300 ${
                    isChecked
                      ? "text-white"
                      : isActive
                      ? "text-gray-300"
                      : "text-gray-500"
                  }`}
                >
                  {item.label}
                </span>

                {/* Active spinner */}
                {isActive && (
                  <svg
                    className="w-4 h-4 ml-auto text-[#62B6CB] animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"
                    />
                  </svg>
                )}

                {/* Completed text */}
                {isChecked && (
                  <span className="ml-auto text-xs text-[#62B6CB] font-sans opacity-70">
                    Terminé
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Error state */}
        {error && (
          <div className="w-full mt-10 flex flex-col items-center gap-4">
            <div className="w-full bg-red-900/30 border border-red-500/40 rounded-xl px-5 py-4 text-center">
              <p className="text-red-300 font-sans text-sm">{error}</p>
            </div>
            <button
              onClick={() => {
                isRunningRef.current = false;
                startGeneration();
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#62B6CB] hover:bg-[#4FA3B8] text-[#0D1B2A] font-sans font-semibold rounded-xl transition-colors duration-200"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 4v6h6" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
              Réessayer
            </button>
          </div>
        )}

        {/* Bottom subtle text */}
        {!error && (
          <p className="text-gray-600 font-sans text-xs text-center mt-12">
            Chaque section est générée individuellement — cela prend environ 1 à 2 minutes
          </p>
        )}
      </div>
    </div>
  );
}
