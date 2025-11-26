"use client";

import { useState, useEffect, useCallback } from "react";
import { startSurvey, saveSurveyStep } from "@/actions/survey";
import {
  trackVisit,
  updateVisitEngagement,
  markVisitAsConverted,
  checkVisitorCompletion,
} from "@/actions/tracking";

import { Hero } from "./hero";
import { Q1Screening } from "./steps/q1-screening";
import { Q2Segment } from "./steps/q2-segment";
import { Q3TimeSpent } from "./steps/q3-time-spent";
import { Q4PainIntensity } from "./steps/q4-pain-intensity";
import { Q5CurrentSolution } from "./steps/q5-current-solution";
import { Q6Pitch } from "./steps/q6-pitch";
import { Q7UsageIntent } from "./steps/q7-usage-intent";
import { Q8PerceivedValue } from "./steps/q8-perceived-value";
import { Q9WillingnessToPay } from "./steps/q9-willingness-to-pay";
import { Q10MagicWand } from "./steps/q10-magic-wand";
import { Q11Objections } from "./steps/q11-objections";
import { Q12LeadCapture } from "./steps/q12-lead-capture";
import { ThankYou } from "./steps/thank-you";

import { XCircle, CheckCircle2, RefreshCw, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";

// Gera um ID único para o visitante
function generateVisitorId(): string {
  return `v_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

type Step =
  | "loading"
  | "hero"
  | "q1"
  | "q2"
  | "q3"
  | "q4"
  | "q5"
  | "q6"
  | "q7"
  | "q8"
  | "q9"
  | "q10"
  | "q11"
  | "q12"
  | "thankyou"
  | "disqualified"
  | "alreadycompleted";

export function SurveyManager() {
  const [step, setStep] = useState<Step>("loading");
  const [surveyId, setSurveyId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const [completedAt, setCompletedAt] = useState<Date | null>(null);
  const [pageLoadTime] = useState(Date.now());
  const [scrollDepth, setScrollDepth] = useState(0);

  // Inicializar visitante e rastrear visita
  useEffect(() => {
    const initVisitor = async () => {
      try {
        // Verificar ou criar visitorId no localStorage
        let storedVisitorId = localStorage.getItem("incode_visitor_id");
        if (!storedVisitorId) {
          storedVisitorId = generateVisitorId();
          localStorage.setItem("incode_visitor_id", storedVisitorId);
        }
        setVisitorId(storedVisitorId);

        // Obter UTMs da URL
        const params = new URLSearchParams(window.location.search);

        // Registrar visita
        await trackVisit({
          visitorId: storedVisitorId,
          utmSource: params.get("utm_source"),
          utmMedium: params.get("utm_medium"),
          utmCampaign: params.get("utm_campaign"),
          utmTerm: params.get("utm_term"),
          utmContent: params.get("utm_content"),
          referrer: document.referrer,
          landingPage: window.location.href,
          screenWidth: window.screen.width,
          screenHeight: window.screen.height,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          devicePixelRatio: window.devicePixelRatio,
          touchSupport: "ontouchstart" in window,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });

        // Verificar se já respondeu
        const completion = await checkVisitorCompletion(storedVisitorId);
        if (completion.isCompleted) {
          setCompletedAt(completion.respondedAt);
          setStep("alreadycompleted");
        } else {
          setStep("hero");
        }
      } catch (error) {
        console.error("Erro ao inicializar visitante:", error);
        setStep("hero"); // Em caso de erro, prossegue normalmente
      }
    };

    initVisitor();
  }, []);

  // Rastrear scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
      setScrollDepth(Math.max(scrollDepth, scrollPercent));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollDepth]);

  // Atualizar tempo no site ao sair
  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (visitorId) {
        const timeOnSite = Math.round((Date.now() - pageLoadTime) / 1000);
        await updateVisitEngagement(visitorId, {
          timeOnSiteSeconds: timeOnSite,
          scrollDepthPercent: scrollDepth,
        });
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [visitorId, pageLoadTime, scrollDepth]);

  // Permitir refazer a pesquisa
  const handleRetake = useCallback(() => {
    // Gerar novo visitorId para a nova sessão
    const newVisitorId = generateVisitorId();
    localStorage.setItem("incode_visitor_id", newVisitorId);
    setVisitorId(newVisitorId);
    setSurveyId(null);
    setStep("hero");
  }, []);

  // Helper para salvar
  const saveStep = async (stepName: string, data: any, time: number) => {
    if (!surveyId) return;

    try {
      const result = await saveSurveyStep(surveyId, stepName, time, data);
      
      if (!result.success) {
        toast.error(result.error || "Erro ao salvar resposta");
      }

      // Atualizar último passo visto
      if (visitorId) {
        await updateVisitEngagement(visitorId, { lastSeenStep: stepName });
      }
    } catch (e) {
      console.error("Erro ao salvar passo:", e);
      toast.error("Erro ao salvar. Suas respostas podem não ter sido registradas.");
    }
  };

  // --- HANDLERS ---

  const handleStart = async () => {
    setIsLoading(true);

    try {
      const params = new URLSearchParams(window.location.search);

      // Marcar que clicou em "começar"
      if (visitorId) {
        await updateVisitEngagement(visitorId, { clickedStart: true });
      }

      const result = await startSurvey({
        visitorId: visitorId,
        utmSource: params.get("utm_source"),
        utmMedium: params.get("utm_medium"),
        utmCampaign: params.get("utm_campaign"),
        referrer: document.referrer,
      });

      if (result?.success && result.id) {
        setSurveyId(result.id);

        // Marcar visita como convertida
        if (visitorId) {
          await markVisitAsConverted(visitorId, result.id);
        }

        // Salvar ID da resposta no localStorage
        localStorage.setItem("incode_response_id", result.id);

        toast.success("Pesquisa iniciada!");
        setStep("q1");
      } else {
        toast.error(result.error || "Erro ao iniciar pesquisa");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao iniciar. Tente recarregar a página.");
    } finally {
      setIsLoading(false);
    }
  };

  // Q1 -> Q2 ou Disqualified
  const handleQ1Next = async (answer: string, time: number) => {
    await saveStep("q1-screening", { isBusinessOwner: answer !== "no" }, time);

    if (answer === "no") {
      setStep("disqualified");
    } else {
      setStep("q2");
    }
  };

  // Q2 -> Q3
  const handleQ2Next = async (segment: string, time: number) => {
    await saveStep("q2-segment", { businessSegment: segment }, time);
    setStep("q3");
  };

  // Q3 -> Q4 ou Q6 (Pulo do Diagnóstico)
  const handleQ3Next = async (answer: string, time: number) => {
    await saveStep("q3-timespent", { weeklyTimeSpent: answer }, time);

    if (answer === "none") {
      setStep("q6");
    } else {
      setStep("q4");
    }
  };

  // Q4 -> Q5 ou Q6 (Pulo da Ferramenta)
  const handleQ4Next = async (value: number, time: number) => {
    await saveStep("q4-painintensity", { painIntensity: value }, time);

    if (value < 5) {
      setStep("q6");
    } else {
      setStep("q5");
    }
  };

  // Q5 -> Q6
  const handleQ5Next = async (
    solution: string,
    tool: string | null,
    time: number
  ) => {
    await saveStep(
      "q5-currentsolution",
      {
        currentSolution: solution,
        currentSolutionTool: tool || undefined,
      },
      time
    );
    setStep("q6");
  };

  // Q6 -> Q7
  const handleQ6Next = async (time: number) => {
    await saveStep("q6-pitch", {}, time);
    setStep("q7");
  };

  // Q7 -> Q8
  const handleQ7Next = async (intent: string, time: number) => {
    await saveStep("q7-usageintent", { usageIntent: intent }, time);
    setStep("q8");
  };

  // Q8 -> Q9
  const handleQ8Next = async (value: string, time: number) => {
    await saveStep("q8-perceivedvalue", { perceivedValue: value }, time);
    setStep("q9");
  };

  // Q9 -> Q10
  const handleQ9Next = async (willingness: string, time: number) => {
    await saveStep("q9-willingnesstopay", { willingnessToPay: willingness }, time);
    setStep("q10");
  };

  // Q10 -> Q11
  const handleQ10Next = async (task: string, time: number) => {
    await saveStep("q10-magicwand", { magicWandTask: task }, time);
    setStep("q11");
  };

  // Q11 -> Q12
  const handleQ11Next = async (objection: string | null, time: number) => {
    await saveStep("q11-objections", { objectionReason: objection || undefined }, time);
    setStep("q12");
  };

  // Q12 -> Thank You
  const handleQ12Next = async () => {
    setStep("thankyou");
  };

  // Animação de transição (slide vertical)
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 50,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1] as const, // Easing suave tipo Apple
      },
    },
    exit: {
      opacity: 0,
      y: -50,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1] as const,
      },
    },
  };

  return (
    <>
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#18181B",
            color: "#fff",
            borderRadius: "12px",
            padding: "16px",
            fontSize: "14px",
            fontWeight: 500,
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />

      <AnimatePresence mode="wait">
        {step === "loading" && (
          <motion.div
            key="loading"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100"
          >
            <div className="text-center">
              <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Carregando pesquisa...</p>
            </div>
          </motion.div>
        )}

        {step === "hero" && (
          <motion.div
            key="hero"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Hero onStart={handleStart} isLoading={isLoading} />
          </motion.div>
        )}

        {step === "q1" && (
          <motion.div
            key="q1"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Q1Screening onNext={handleQ1Next} />
          </motion.div>
        )}

        {step === "q2" && (
          <motion.div
            key="q2"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Q2Segment onNext={handleQ2Next} />
          </motion.div>
        )}

        {step === "q3" && (
          <motion.div
            key="q3"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Q3TimeSpent onNext={handleQ3Next} />
          </motion.div>
        )}

        {step === "q4" && (
          <motion.div
            key="q4"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Q4PainIntensity onNext={handleQ4Next} />
          </motion.div>
        )}

        {step === "q5" && (
          <motion.div
            key="q5"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Q5CurrentSolution onNext={handleQ5Next} />
          </motion.div>
        )}

        {step === "q6" && (
          <motion.div
            key="q6"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Q6Pitch onNext={handleQ6Next} />
          </motion.div>
        )}

        {step === "q7" && (
          <motion.div
            key="q7"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Q7UsageIntent onNext={handleQ7Next} />
          </motion.div>
        )}

        {step === "q8" && (
          <motion.div
            key="q8"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Q8PerceivedValue onNext={handleQ8Next} />
          </motion.div>
        )}

        {step === "q9" && (
          <motion.div
            key="q9"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Q9WillingnessToPay onNext={handleQ9Next} />
          </motion.div>
        )}

        {step === "q10" && (
          <motion.div
            key="q10"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Q10MagicWand onNext={handleQ10Next} />
          </motion.div>
        )}

        {step === "q11" && (
          <motion.div
            key="q11"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Q11Objections onNext={handleQ11Next} />
          </motion.div>
        )}

        {step === "q12" && (
          <motion.div
            key="q12"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Q12LeadCapture onNext={handleQ12Next} surveyId={surveyId!} />
          </motion.div>
        )}

        {step === "thankyou" && (
          <motion.div
            key="thankyou"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <ThankYou />
          </motion.div>
        )}

        {step === "disqualified" && (
          <motion.div
            key="disqualified"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4"
          >
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center border border-gray-100">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-8 h-8 text-orange-600" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Obrigado pelo seu tempo! 💜
              </h2>

              <p className="text-gray-600 mb-6 leading-relaxed">
                No momento, esta pesquisa é exclusiva para donos e gestores de
                pequenos negócios que buscam automação.
              </p>

              <p className="text-sm text-gray-500">
                Agradecemos muito seu interesse!
              </p>
            </div>
          </motion.div>
        )}

        {step === "alreadycompleted" && (
          <motion.div
            key="alreadycompleted"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4"
          >
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center border border-gray-100">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Você já respondeu! ✅
              </h2>

              <p className="text-gray-600 mb-6 leading-relaxed">
                Detectamos que você já completou esta pesquisa anteriormente.
                Agradecemos imensamente sua contribuição!
              </p>

              {completedAt && (
                <p className="text-sm text-gray-500 mb-6">
                  Respondido em:{" "}
                  {new Date(completedAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              )}

              <button
                onClick={handleRetake}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
              >
                <Sparkles className="w-5 h-5" />
                Responder Novamente
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
