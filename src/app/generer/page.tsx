"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { loadFormData, savePlanData } from "@/lib/store";
import { FormData } from "@/lib/types";

const CHECKLIST_ITEMS = [
  { label: "Analyse du projet", threshold: 10 },
  { label: "Etude de march\u00e9", threshold: 25 },
  { label: "Strat\u00e9gie commerciale", threshold: 45 },
  { label: "Pr\u00e9visionnel financier", threshold: 65 },
  { label: "Recommandation juridique", threshold: 80 },
  { label: "Mise en forme finale", threshold: 95 },
];

export default function GenererPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const apiDoneRef = useRef(false);
  const apiResultRef = useRef<Record<string, unknown> | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const formDataRef = useRef<FormData | null>(null);

  const startGeneration = useCallback(async () => {
    setError(null);
    setProgress(0);
    apiDoneRef.current = false;
    apiResultRef.current = null;

    const formData = loadFormData();
    formDataRef.current = formData;

    // Start fake progress animation
    const startTime = Date.now();
    const totalDuration = 15000; // 15 seconds

    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    progressIntervalRef.current = setInterval(() => {
      if (apiDoneRef.current) {
        // API is done, jump to 100%
        setProgress(100);
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
        return;
      }

      const elapsed = Date.now() - startTime;
      const linearProgress = Math.min(elapsed / totalDuration, 1);
      // Easing function that slows down as it approaches 95%
      // Uses a logarithmic curve to slow down near the end
      const easedProgress = 95 * (1 - Math.pow(1 - linearProgress, 2.5));
      setProgress(Math.min(Math.round(easedProgress), 95));
    }, 100);

    // Make API call
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.error || `Erreur serveur (${response.status})`
        );
      }

      const planData = await response.json();
      apiResultRef.current = planData;
      apiDoneRef.current = true;

      // Wait for progress to reach 100%, then save and redirect
      setTimeout(() => {
        savePlanData(planData);
        setTimeout(() => {
          router.push("/resultats");
        }, 600);
      }, 500);
    } catch (err: unknown) {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de la g\u00e9n\u00e9ration. Veuillez r\u00e9essayer."
      );
    }
  }, [router]);

  useEffect(() => {
    startGeneration();

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
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
            {/* Left hemisphere */}
            <path
              d="M44 20C38 20 33 23 31 28C27 27 22 30 21 35C18 36 16 40 17 44C15 47 15 52 18 55C17 59 19 63 23 65C23 69 26 72 30 73C32 77 37 79 42 78L44 78V20Z"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="rgba(98, 182, 203, 0.08)"
            />
            {/* Right hemisphere */}
            <path
              d="M52 20C58 20 63 23 65 28C69 27 74 30 75 35C78 36 80 40 79 44C81 47 81 52 78 55C79 59 77 63 73 65C73 69 70 72 66 73C64 77 59 79 54 78L52 78V20Z"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="rgba(98, 182, 203, 0.08)"
            />
            {/* Center line */}
            <path
              d="M48 18V80"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.5"
            />
            {/* Neural connections - left */}
            <path
              d="M28 40L38 36M24 52L36 48M30 64L40 58"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.6"
            />
            {/* Neural connections - right */}
            <path
              d="M68 40L58 36M72 52L60 48M66 64L56 58"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.6"
            />
            {/* Neural nodes - left */}
            <circle cx="28" cy="40" r="2.5" fill="currentColor" opacity="0.7" />
            <circle cx="24" cy="52" r="2.5" fill="currentColor" opacity="0.7" />
            <circle cx="30" cy="64" r="2.5" fill="currentColor" opacity="0.7" />
            <circle cx="38" cy="36" r="2" fill="currentColor" opacity="0.5" />
            <circle cx="36" cy="48" r="2" fill="currentColor" opacity="0.5" />
            <circle cx="40" cy="58" r="2" fill="currentColor" opacity="0.5" />
            {/* Neural nodes - right */}
            <circle cx="68" cy="40" r="2.5" fill="currentColor" opacity="0.7" />
            <circle cx="72" cy="52" r="2.5" fill="currentColor" opacity="0.7" />
            <circle cx="66" cy="64" r="2.5" fill="currentColor" opacity="0.7" />
            <circle cx="58" cy="36" r="2" fill="currentColor" opacity="0.5" />
            <circle cx="60" cy="48" r="2" fill="currentColor" opacity="0.5" />
            <circle cx="56" cy="58" r="2" fill="currentColor" opacity="0.5" />
            {/* Cross connections */}
            <path
              d="M38 36L58 36M36 48L60 48M40 58L56 58"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeDasharray="3 3"
              opacity="0.3"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="font-display text-2xl sm:text-3xl text-white text-center mb-3">
          G&eacute;n&eacute;ration de votre business plan...
        </h1>

        {/* Subtitle */}
        <p className="text-gray-400 font-sans text-center text-sm sm:text-base mb-10 max-w-md">
          Notre IA analyse votre projet et r&eacute;dige un plan
          personnalis&eacute;
        </p>

        {/* Progress Bar */}
        <div className="w-full mb-3">
          <div className="w-full h-3 rounded-full bg-[#1B4965] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${progress}%`,
                background:
                  "linear-gradient(90deg, #62B6CB 0%, #8DD0DE 100%)",
              }}
            />
          </div>
          <p className="text-right text-sm text-[#62B6CB] font-sans mt-2 tabular-nums">
            {progress}%
          </p>
        </div>

        {/* Checklist */}
        <div className="w-full space-y-4 mt-6">
          {CHECKLIST_ITEMS.map((item, index) => {
            const isChecked = progress >= item.threshold;
            const isActive =
              !isChecked &&
              (index === 0 || progress >= CHECKLIST_ITEMS[index - 1].threshold);

            return (
              <div
                key={item.label}
                className={`flex items-center gap-3 transition-opacity duration-500 ${
                  isChecked
                    ? "opacity-100"
                    : isActive
                    ? "opacity-100"
                    : "opacity-40"
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
                      xmlns="http://www.w3.org/2000/svg"
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
                  {isActive && !isChecked && (
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
                {isActive && !isChecked && (
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

                {/* Completed check text */}
                {isChecked && (
                  <span className="ml-auto text-xs text-[#62B6CB] font-sans opacity-70">
                    Termin&eacute;
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
              onClick={() => startGeneration()}
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
              R&eacute;essayer
            </button>
          </div>
        )}

        {/* Bottom subtle text */}
        {!error && (
          <p className="text-gray-600 font-sans text-xs text-center mt-12">
            Cela prend g&eacute;n&eacute;ralement entre 15 et 30 secondes
          </p>
        )}
      </div>
    </div>
  );
}
