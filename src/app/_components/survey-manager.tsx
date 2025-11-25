'use client'

import { useState, useEffect } from 'react';
import { startSurvey, saveSurveyStep } from '@/actions/survey';

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
import { XCircle } from 'lucide-react';

function Disqualified() {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-[#FAF7EF] px-4 py-8">
            <div className="w-full max-w-2xl mx-auto text-center space-y-6 animate-in fade-in duration-700">

                {/* Ícone principal */}
                <div className="flex justify-center mb-8">
                    <div className="flex h-24 w-24 md:h-32 md:w-32 items-center justify-center rounded-full bg-gradient-to-br from-[#FFE5E5] to-[#FFD0D0] shadow-lg">
                        <XCircle className="h-12 w-12 md:h-16 md:w-16 text-[#FF6B6B]" strokeWidth={2} />
                    </div>
                </div>

                {/* Título */}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug">
                    Obrigado pelo interesse!
                </h1>

                {/* Texto principal */}
                <p className="text-base md:text-lg text-gray-700 max-w-lg mx-auto leading-relaxed">
                    No momento, esta pesquisa é exclusiva para <span className="font-semibold text-gray-900">donos e gestores de pequenos negócios</span> que buscam automação.
                </p>

                {/* Texto secundário */}
                <p className="text-sm md:text-base text-gray-500 pt-4">
                    Agradecemos muito seu tempo e interesse! 💜
                </p>

                {/* Marca d'água */}
                <div className="pt-12 text-xs text-gray-400">
                    Pesquisa Incode © 2025
                </div>

            </div>
        </div>
    );
}

type Step = 'hero' | 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6' | 'q7' | 'q8' | 'q9' | 'q10' | 'q11' | 'q12' | 'thank_you' | 'disqualified';

export function SurveyManager() {
    const [step, setStep] = useState<Step>('hero');
    const [surveyId, setSurveyId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Helper para salvar sem bloquear (fire and forget) ou aguardar se necessário
    const saveStep = async (stepName: string, data: any, time: number) => {
        if (!surveyId) return;
        try {
            await saveSurveyStep({
                surveyId,
                stepName,
                timeSpentOnStep: time,
                data
            });
        } catch (e) {
            console.error("Erro ao salvar passo", e);
        }
    };

    // --- HANDLERS ---

    const handleStart = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams(window.location.search);
            const result = await startSurvey({
                utmSource: params.get('utm_source'),
                utmMedium: params.get('utm_medium'),
                utmCampaign: params.get('utm_campaign'),
                referrer: document.referrer,
            });

            if (result?.success && result.id) {
                setSurveyId(result.id);
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
        if (answer === 'none') setStep('q6'); // Pula para Pitch
        else setStep('q4');
    };

    // Q4 -> Q5 ou Q6 (Pulo da Ferramenta)
    const handleQ4Next = async (value: number, time: number) => {
        await saveStep('q4_pain_intensity', { painIntensity: value }, time);
        if (value < 5) setStep('q6'); // Dor baixa, vai pro pitch
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
        setStep('thank_you');
    };

    return (
        <main className="w-full">
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
