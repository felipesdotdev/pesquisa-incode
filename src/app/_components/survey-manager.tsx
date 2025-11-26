'use client'

import { useState, useEffect, useCallback } from 'react';
import { startSurvey, saveSurveyStep } from '@/actions/survey';
import { trackVisit, updateVisitEngagement, markVisitAsConverted, checkVisitorCompletion } from '@/actions/tracking';

import { Hero } from './hero';
import { Q1Screening } from './steps/q1-screening';
import { Q2Segment } from './steps/q2-segment';
import { Q3TimeSpent } from './steps/q3-time-spent';
import { Q4PainIntensity } from './steps/q4-pain-intensity';
import { Q5CurrentSolution } from './steps/q5-current-solution';
import { Q6Pitch } from './steps/q6-pitch';
import { Q7UsageIntent } from './steps/q7-usage-intent';
import { Q8PerceivedValue } from './steps/q8-perceived-value';
import { Q9WillingnessToPay } from './steps/q9-willingness-to-pay';
import { Q10MagicWand } from './steps/q10-magic-wand';
import { Q11Objections } from './steps/q11-objections';
import { Q12LeadCapture } from './steps/q12-lead-capture';
import { ThankYou } from './steps/thank-you';
import { XCircle, CheckCircle2, RefreshCw, Sparkles } from 'lucide-react';

// Gera um ID único para o visitante
function generateVisitorId(): string {
    return `v_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

// Componente para quem já respondeu
function AlreadyCompleted({ onRetake, completedAt }: { onRetake: () => void; completedAt: Date | null }) {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-[#FAF7EF] px-4 py-8">
            <div className="w-full max-w-2xl mx-auto text-center space-y-6 animate-in fade-in duration-700">
                {/* Ícone de sucesso */}
                <div className="flex justify-center mb-8">
                    <div className="relative">
                        <div className="flex h-28 w-28 md:h-36 md:w-36 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-emerald-200 shadow-xl">
                            <CheckCircle2 className="h-14 w-14 md:h-20 md:w-20 text-green-600" strokeWidth={1.5} />
                        </div>
                        <div className="absolute -top-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg">
                            <Sparkles className="h-5 w-5 text-white" />
                        </div>
                    </div>
                </div>

                {/* Título */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-snug">
                    Você já participou! 🎉
                </h1>

                {/* Texto principal */}
                <p className="text-lg md:text-xl text-gray-700 max-w-lg mx-auto leading-relaxed">
                    Muito obrigado pela sua contribuição! Sua opinião é extremamente valiosa para nós.
                </p>

                {/* Data da resposta */}
                {completedAt && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100">
                        <span className="text-sm text-gray-500">Respondido em</span>
                        <span className="text-sm font-semibold text-gray-900">
                            {new Date(completedAt).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </span>
                    </div>
                )}

                {/* Card informativo */}
                <div className="mt-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-md mx-auto">
                    <h3 className="font-semibold text-gray-900 mb-2">O que acontece agora?</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        Estamos analisando todas as respostas para criar a melhor solução possível. 
                        Se você deixou seu contato, entraremos em contato em breve!
                    </p>
                </div>

                {/* Botão para refazer */}
                <div className="pt-6">
                    <button
                        onClick={onRetake}
                        className="inline-flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 font-medium rounded-xl hover:bg-white/50 transition-all duration-200"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Quero responder novamente
                    </button>
                </div>

                {/* Footer */}
                <div className="pt-8 text-xs text-gray-400">
                    Pesquisa Incode © 2025
                </div>
            </div>
        </div>
    );
}

function Disqualified() {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-[#FAF7EF] px-4 py-8">
            <div className="w-full max-w-2xl mx-auto text-center space-y-6 animate-in fade-in duration-700">
                <div className="flex justify-center mb-8">
                    <div className="flex h-24 w-24 md:h-32 md:w-32 items-center justify-center rounded-full bg-gradient-to-br from-[#FFE5E5] to-[#FFD0D0] shadow-lg">
                        <XCircle className="h-12 w-12 md:h-16 md:w-16 text-[#FF6B6B]" strokeWidth={2} />
                    </div>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug">
                    Obrigado pelo interesse!
                </h1>
                <p className="text-base md:text-lg text-gray-700 max-w-lg mx-auto leading-relaxed">
                    No momento, esta pesquisa é exclusiva para <span className="font-semibold text-gray-900">donos e gestores de pequenos negócios</span> que buscam automação.
                </p>
                <p className="text-sm md:text-base text-gray-500 pt-4">
                    Agradecemos muito seu tempo e interesse! 💜
                </p>
                <div className="pt-12 text-xs text-gray-400">
                    Pesquisa Incode © 2025
                </div>
            </div>
        </div>
    );
}

type Step = 'loading' | 'already_completed' | 'hero' | 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6' | 'q7' | 'q8' | 'q9' | 'q10' | 'q11' | 'q12' | 'thank_you' | 'disqualified';

export function SurveyManager() {
    const [step, setStep] = useState<Step>('loading');
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
                let storedVisitorId = localStorage.getItem('incode_visitor_id');
                if (!storedVisitorId) {
                    storedVisitorId = generateVisitorId();
                    localStorage.setItem('incode_visitor_id', storedVisitorId);
                }
                setVisitorId(storedVisitorId);

                // Coletar dados do cliente
                const params = new URLSearchParams(window.location.search);
                
                // Rastrear a visita
                await trackVisit({
                    visitorId: storedVisitorId,
                    utmSource: params.get('utm_source'),
                    utmMedium: params.get('utm_medium'),
                    utmCampaign: params.get('utm_campaign'),
                    utmTerm: params.get('utm_term'),
                    utmContent: params.get('utm_content'),
                    referrer: document.referrer || null,
                    landingPage: window.location.pathname + window.location.search,
                    screenWidth: window.screen.width,
                    screenHeight: window.screen.height,
                    viewportWidth: window.innerWidth,
                    viewportHeight: window.innerHeight,
                    devicePixelRatio: window.devicePixelRatio,
                    touchSupport: 'ontouchstart' in window,
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    metadata: {
                        language: navigator.language,
                        languages: navigator.languages,
                        cookiesEnabled: navigator.cookieEnabled,
                        doNotTrack: navigator.doNotTrack,
                        platform: navigator.platform,
                        maxTouchPoints: navigator.maxTouchPoints,
                        hardwareConcurrency: navigator.hardwareConcurrency,
                        colorDepth: window.screen.colorDepth,
                        connectionType: (navigator as any).connection?.effectiveType,
                    }
                });

                // Verificar se já respondeu
                const completion = await checkVisitorCompletion(storedVisitorId);
                
                if (completion.isCompleted) {
                    setCompletedAt(completion.respondedAt);
                    setStep('already_completed');
                } else {
                    setStep('hero');
                }
            } catch (error) {
                console.error('Erro ao inicializar visitante:', error);
                setStep('hero'); // Em caso de erro, prossegue normalmente
            }
        };

        initVisitor();
    }, []);

    // Rastrear scroll depth
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
            setScrollDepth(Math.max(scrollDepth, scrollPercent));
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
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

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [visitorId, pageLoadTime, scrollDepth]);

    // Permitir refazer a pesquisa
    const handleRetake = useCallback(() => {
        // Gerar novo visitorId para a nova sessão
        const newVisitorId = generateVisitorId();
        localStorage.setItem('incode_visitor_id', newVisitorId);
        setVisitorId(newVisitorId);
        setSurveyId(null);
        setStep('hero');
    }, []);

    // Helper para salvar
    const saveStep = async (stepName: string, data: any, time: number) => {
        if (!surveyId) return;
        try {
            await saveSurveyStep({
                surveyId,
                stepName,
                timeSpentOnStep: time,
                data
            });
            
            // Atualizar último passo visto
            if (visitorId) {
                await updateVisitEngagement(visitorId, { lastSeenStep: stepName });
            }
        } catch (e) {
            console.error("Erro ao salvar passo", e);
        }
    };

    // --- HANDLERS ---

    const handleStart = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams(window.location.search);
            
            // Marcar que clicou em começar
            if (visitorId) {
                await updateVisitEngagement(visitorId, { clickedStart: true });
            }

            const result = await startSurvey({
                visitorId: visitorId,
                utmSource: params.get('utm_source'),
                utmMedium: params.get('utm_medium'),
                utmCampaign: params.get('utm_campaign'),
                referrer: document.referrer,
            });

            if (result?.success && result.id) {
                setSurveyId(result.id);
                
                // Marcar visita como convertida
                if (visitorId) {
                    await markVisitAsConverted(visitorId, result.id);
                }
                
                // Salvar ID da resposta no localStorage
                localStorage.setItem('incode_response_id', result.id);
                
                setStep('q1');
            }
        } catch (err) {
            console.error(err);
            alert("Erro ao iniciar. Tente recarregar a página.");
        } finally {
            setIsLoading(false);
        }
    };

    // Q1 -> Q2 ou Disqualified
    const handleQ1Next = async (answer: string, time: number) => {
        await saveStep('q1_screening', { isBusinessOwner: answer !== 'no' }, time);
        if (answer === 'no') setStep('disqualified');
        else setStep('q2');
    };

    // Q2 -> Q3
    const handleQ2Next = async (segment: string, time: number) => {
        await saveStep('q2_segment', { businessSegment: segment }, time);
        setStep('q3');
    };

    // Q3 -> Q4 ou Q6 (Pulo do Diagnóstico)
    const handleQ3Next = async (answer: string, time: number) => {
        await saveStep('q3_time_spent', { weeklyTimeSpent: answer }, time);
        if (answer === 'none') setStep('q6');
        else setStep('q4');
    };

    // Q4 -> Q5 ou Q6 (Pulo da Ferramenta)
    const handleQ4Next = async (value: number, time: number) => {
        await saveStep('q4_pain_intensity', { painIntensity: value }, time);
        if (value < 5) setStep('q6');
        else setStep('q5');
    };

    // Q5 -> Q6
    const handleQ5Next = async (solution: string, tool: string | null, time: number) => {
        await saveStep('q5_current_solution', { currentSolution: solution, currentSolutionTool: tool || undefined }, time);
        setStep('q6');
    };

    // Q6 -> Q7
    const handleQ6Next = async (time: number) => {
        await saveStep('q6_pitch_view', {}, time);
        setStep('q7');
    };

    // Q7 -> Q8 ou Q11 (Objeção direta)
    const handleQ7Next = async (intent: string, time: number) => {
        await saveStep('q7_usage_intent', { usageIntent: intent }, time);
        if (intent === 'probably_not' || intent === 'definitely_not') setStep('q11');
        else setStep('q8');
    };

    // Q8 -> Q9
    const handleQ8Next = async (value: string, time: number) => {
        await saveStep('q8_perceived_value', { perceivedValue: value }, time);
        setStep('q9');
    };

    // Q9 -> Q10 (Insights)
    const handleQ9Next = async (value: string, time: number) => {
        await saveStep('q9_willingness_to_pay', { willingnessToPay: value }, time);
        setStep('q10');
    };

    // Q10 -> Q12
    const handleQ10Next = async (text: string, time: number) => {
        await saveStep('q10_magic_wand', { magicWandTask: text }, time);
        setStep('q12');
    };

    // Q11 -> Q12 (Tenta capturar lead mesmo com objeção)
    const handleQ11Next = async (text: string, time: number) => {
        await saveStep('q11_objections', { objectionReason: text }, time);
        setStep('q12');
    };

    // Q12 -> Thank You
    const handleQ12Finish = async (email: string | null, phone: string | null, time: number) => {
        await saveStep('q12_lead_capture', { wantsBeta: !!email, email: email || undefined, whatsapp: phone || undefined }, time);
        await saveStep('completed', {}, 0);
        
        // Marcar como completado no localStorage
        localStorage.setItem('incode_completed', 'true');
        localStorage.setItem('incode_completed_at', new Date().toISOString());
        
        setStep('thank_you');
    };

    // Loading inicial
    if (step === 'loading') {
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-[#FAF7EF]">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />
                    <p className="text-sm text-gray-500">Carregando...</p>
                </div>
            </div>
        );
    }

    return (
        <main className="w-full">
            {step === 'already_completed' && <AlreadyCompleted onRetake={handleRetake} completedAt={completedAt} />}
            {step === 'hero' && <Hero onStart={handleStart} isLoading={isLoading} />}
            {step === 'q1' && <Q1Screening onNext={handleQ1Next} />}
            {step === 'q2' && <Q2Segment onNext={handleQ2Next} />}
            {step === 'q3' && <Q3TimeSpent onNext={handleQ3Next} />}
            {step === 'q4' && <Q4PainIntensity onNext={handleQ4Next} />}
            {step === 'q5' && <Q5CurrentSolution onNext={handleQ5Next} />}
            {step === 'q6' && <Q6Pitch onNext={handleQ6Next} />}
            {step === 'q7' && <Q7UsageIntent onNext={handleQ7Next} />}
            {step === 'q8' && <Q8PerceivedValue onNext={handleQ8Next} />}
            {step === 'q9' && <Q9WillingnessToPay onNext={handleQ9Next} />}
            {step === 'q10' && <Q10MagicWand onNext={handleQ10Next} />}
            {step === 'q11' && <Q11Objections onNext={handleQ11Next} />}
            {step === 'q12' && <Q12LeadCapture onFinish={handleQ12Finish} />}
            {step === 'thank_you' && <ThankYou />}
            {step === 'disqualified' && <Disqualified />}
        </main>
    );
}
