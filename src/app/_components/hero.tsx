'use client'

import { useEffect, useState } from 'react';
import { ArrowRight, Sparkles, Mail, Slack, BrainCircuit, CheckCircle2, Send } from 'lucide-react';

interface HeroProps {
    onStart: () => void;
    isLoading: boolean;
}

export function Hero({ onStart, isLoading }: HeroProps) {
    const [step, setStep] = useState(0);

    useEffect(() => {
        const sequence = [
            { t: 0, s: 0 },
            { t: 1000, s: 1 },
            { t: 2200, s: 2 },
            { t: 3500, s: 3 },
            { t: 4500, s: 4 }, // Início do Zoom
            { t: 5400, s: 5 }, // Handoff (troca de layer)
            { t: 6200, s: 6 }, // Zoom out
            { t: 7000, s: 7 },
            { t: 8000, s: 8 },
            { t: 11000, s: 9 },
            { t: 14000, s: 10 },
        ];

        const runSequence = () => {
            sequence.forEach(({ t, s }) => {
                setTimeout(() => setStep(s), t);
            });
        };

        runSequence();
        const interval = setInterval(runSequence, 16000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'Enter' && !isLoading) onStart();
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isLoading, onStart]);

    return (
        <div className="flex min-h-screen w-full flex-col lg:flex-row overflow-hidden font-sans selection:bg-[#C09AE4] selection:text-white">
            <style jsx global>{`
                .ease-apple { transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); }
                
                @keyframes bounce-dot {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-3px); }
                }
                .animate-dot { animation: bounce-dot 1.2s infinite ease-in-out both; }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes pulse-glow {
                    0%, 100% { box-shadow: 0 0 20px rgba(192, 154, 228, 0.3); }
                    50% { box-shadow: 0 0 40px rgba(192, 154, 228, 0.6); }
                }
                .animate-float { animation: float 8s ease-in-out infinite; }
            `}</style>

            {/* LADO ESQUERDO */}
            <div className="flex w-full flex-col justify-center px-8 lg:w-[45%] lg:pl-32 lg:pr-12 py-12 lg:py-0 z-20">
                <div className="max-w-lg space-y-8">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white border border-gray-200 px-3 py-1 shadow-sm w-fit">
                        <Sparkles className="w-3 h-3 text-[#C09AE4] animate-pulse" />
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Incode Agents</span>
                    </div>

                    <div className="space-y-5">
                        <h1 className="text-[42px] leading-[1.05] font-bold text-[#1D1D1F] lg:text-[56px] tracking-tight -ml-0.5">
                            Ajude a construir o futuro da <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C09AE4] to-[#8B5CF6]">automação</span>
                        </h1>
                        <p className="text-xl text-gray-500 leading-relaxed max-w-md font-medium">
                            Sua opinião vai moldar nossa nova IA de atendimento e processos para pequenos negócios.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-4">
                        <button
                            onClick={onStart}
                            disabled={isLoading}
                            className="group relative flex items-center gap-3 rounded-full bg-[#1D1D1F] hover:bg-[#000] px-8 py-4 text-lg font-semibold text-white transition-all hover:scale-105 active:scale-95 shadow-xl disabled:opacity-70"
                        >
                            <span>{isLoading ? 'Iniciando...' : 'Começar agora'}</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400 select-none">
                            <span>pressione</span>
                            <kbd className="px-2 py-1 bg-white border border-gray-200 rounded-md text-xs font-bold text-gray-500 shadow-[0_2px_0_rgba(0,0,0,0.05)]">Enter ↵</kbd>
                        </div>
                    </div>
                </div>
            </div>

            {/* LADO DIREITO */}
            <div className="relative flex w-full items-center justify-center lg:w-[55%] lg:h-screen">

                <div className="absolute inset-0 bg-gradient-to-bl from-[#F2E8FD] via-[#FBF7EA] to-[#F5F5F7] opacity-80" />
                <div
                    className={`absolute right-10 top-20 w-3/4 h-3/4 bg-gradient-to-b from-[#D8B4FE] to-transparent blur-[100px] rounded-full mix-blend-multiply transition-all duration-[2000ms] ease-in-out
                    ${step >= 5 ? 'opacity-60 scale-110 translate-x-10' : 'opacity-30 scale-100'}`}
                />

                <div className="relative w-[340px] h-auto aspect-[543/1106] animate-float perspective-1000 z-30">

                    <div
                        className="absolute bg-white overflow-hidden"
                        style={{
                            top: '2.2%',
                            left: '5.0%',
                            width: '89.9%',
                            height: '95.6%',
                            borderRadius: '38px'
                        }}
                    >
                        {/* STATUS BAR */}
                        <div className={`absolute top-0 w-full h-[50px] z-50 flex items-end justify-between px-6 pb-2 transition-colors duration-500 ${step >= 5 ? 'text-white' : 'text-black'}`}>
                            <span className="text-[15px] font-semibold tracking-wide leading-none ml-2">
                                {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <div className="flex items-center gap-[7px] -mr-2 opacity-90">
                                <svg width="17" height="11" viewBox="0 0 17 11" className="fill-current"><path d="M1 7.5C1 7.22386 1.22386 7 1.5 7H2.5C2.77614 7 3 7.22386 3 7.5V10.5C3 10.7761 2.77614 11 2.5 11H1.5C1.22386 11 1 10.7761 1 10.5V7.5Z" /><path d="M5 5.5C5 5.22386 5.22386 5 5.5 5H6.5C6.77614 5 7 5.22386 7 5.5V10.5C7 10.7761 6.77614 11 6.5 11H5.5C5.22386 11 5 10.7761 5 10.5V5.5Z" /><path d="M9 3.5C9 3.22386 9.22386 3 9.5 3H10.5C10.7761 3 11 3.22386 11 3.5V10.5C11 10.7761 10.7761 11 10.5 11H9.5C9.22386 11 9 10.7761 9 10.5V3.5Z" /><path d="M13 1.5C13 1.22386 13.2239 1 13.5 1H14.5C14.7761 1 15 1.22386 15 1.5V10.5C15 10.7761 14.7761 11 14.5 11H13.5C13.2239 11 13 10.7761 13 10.5V1.5Z" /></svg>
                                <div className="relative w-[22px] h-[11px] border-[1px] border-current rounded-[3px] ml-1 p-[1px]"><div className="w-full h-full bg-current rounded-[1px]" /><div className="absolute -right-[2.5px] top-1/2 -translate-y-1/2 h-[3px] w-[1.5px] bg-current rounded-r-[1px]" /></div>
                            </div>
                        </div>

                        {/* 
                            LAYER 1: CHAT
                            O PULO DO GATO: transform-origin em pixels exatos
                        */}
                        {/* 
                            LAYER 1: CHAT
                            O PULO DO GATO: transform-origin em pixels exatos
                        */}
                        <div
                            className={`absolute inset-0 z-10 flex flex-col justify-end pb-2
                            transition-all duration-[1000ms] ease-[cubic-bezier(0.5,0,0.1,1)]`}
                            style={{
                                // ✅ CORREÇÃO: Origem EXATA do cérebro no eixo Y (460px)
                                transformOrigin: '12% 420px',
                                transform: step >= 4 ? 'scale(5.025) translate(-1px, -132px)' : 'scale(1) translate(0px, 0px)',
                            }}
                        >
                            {/* Background que sai suavemente */}
                            <div className={`absolute inset-0 bg-[#FAFAFA] -z-10 transition-opacity duration-[1000ms] ${step >= 5 ? 'opacity-0' : 'opacity-100'}`} />

                            <div className="px-6 w-full flex flex-col gap-3 mb-3">
                                {/* Mensagens Iniciais (Saída Suave) */}
                                <div className={`flex flex-col gap-3 transition-opacity duration-[1000ms] ${step >= 5 ? 'opacity-0' : 'opacity-100'}`}>
                                    <div className="flex justify-start">
                                        <div className="bg-[#E9E9EB] rounded-2xl rounded-tl-sm px-4 py-2.5 text-[13px] text-black max-w-[85%] shadow-sm">
                                            Olá! Como posso ajudar hoje?
                                        </div>
                                    </div>

                                    <div className={`flex justify-end transition-all duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}>
                                        <div className="bg-[#007AFF] rounded-2xl rounded-br-sm px-4 py-2.5 text-[13px] text-white max-w-[85%] shadow-md">
                                            Monitore meus e-mails e avise no Slack.
                                        </div>
                                    </div>

                                    <div className={`flex justify-start transition-all duration-500 ${step >= 2 ? 'opacity-100' : 'opacity-0'}`}>
                                        {step === 2 && (
                                            <div className="bg-[#E9E9EB] rounded-2xl rounded-tl-sm px-4 py-3 w-14 flex items-center justify-center gap-1">
                                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full shrink-0 animate-dot" style={{ animationDelay: '0ms' }} />
                                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full shrink-0 animate-dot" style={{ animationDelay: '150ms' }} />
                                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full shrink-0 animate-dot" style={{ animationDelay: '300ms' }} />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Agent Card (Saída Brusca/Instantânea do Ícone) */}
                                <div className="flex justify-start">
                                    {step >= 3 && (
                                        <div className={`rounded-2xl rounded-tl-sm p-4 w-[90%] ring-1 ring-black/5 transition-all duration-[1000ms]
                                            ${step >= 5 ? 'bg-transparent border-transparent shadow-none backdrop-blur-none' : 'bg-white/80 border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-xl'}`}>

                                            <div className="flex items-start gap-3.5">
                                                {/* Ícone: Fica visível até o step 6 (evita flicker) */}
                                                <div className={`w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#C09AE4] to-[#7C3AED] flex items-center justify-center shadow-sm shrink-0 transition-opacity duration-0 delay-0
                                                    ${step >= 6 ? 'opacity-0' : 'opacity-100'}`}>
                                                    <BrainCircuit className="text-white w-5 h-5" />
                                                </div>

                                                {/* Texto: Fade out no step 5 */}
                                                <div className={`flex-1 min-w-0 transition-opacity duration-[1000ms] ${step >= 5 ? 'opacity-0' : 'opacity-100'}`}>
                                                    <h3 className="text-[15px] font-semibold text-gray-900 leading-tight">Agente Criado</h3>
                                                    <p className="text-[13px] text-gray-500 mt-0.5 leading-snug">Configurando integrações...</p>
                                                </div>
                                            </div>

                                            {/* Barra de Progresso: Fade out no step 5 */}
                                            <div className={`mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden transition-opacity duration-[1000ms] ${step >= 5 ? 'opacity-0' : 'opacity-100'}`}>
                                                <div className="h-full bg-[#C09AE4] w-2/3 rounded-full" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Input (Saída Suave) */}
                            <div className={`px-4 pb-2 mt-2 transition-opacity duration-[1000ms] ${step >= 5 ? 'opacity-0' : 'opacity-100'}`}>
                                <div className="bg-gray-100/70 backdrop-blur-sm rounded-2xl flex items-center p-1 gap-2 border border-gray-200/80">
                                    <input
                                        type="text"
                                        placeholder="Mensagem"
                                        disabled
                                        className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 outline-none pl-3"
                                    />
                                    <button className="w-7 h-7 rounded-full bg-[#007AFF] flex items-center justify-center shrink-0">
                                        <Send className="w-3.5 h-3.5 text-white" style={{ transform: 'translateX(-1px)' }} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* LAYER 2: NETWORK (Dark Mode) */}
                        <div className={`absolute inset-0 bg-[#1D1D1F] z-0 flex items-center justify-center overflow-hidden
                            // Mantém o background da segunda tela sempre visível (remove fade‑in)
                            opacity-100`}>

                            <div className="absolute inset-0 opacity-20"
                                style={{ backgroundImage: 'radial-gradient(#555 1px, transparent 1px)', backgroundSize: '24px 24px' }}
                            />

                            <div className={`relative w-full h-full flex items-center justify-center transition-transform duration-[1200ms] ease-apple
                            ${step >= 6 ? 'scale-100' : 'scale-[2.5]'}`}>

                                <div className="relative z-20 flex flex-col items-center">
                                    <div className="w-20 h-20 rounded-[24px] bg-gradient-to-br from-[#C09AE4] to-[#7C3AED] flex items-center justify-center shadow-[0_0_60px_-15px_rgba(192,154,228,0.5)] animate-[pulse-glow_3s_infinite]">
                                        <BrainCircuit className="text-white w-10 h-10" />
                                    </div>
                                    <div className={`mt-6 text-center transition-all duration-700 delay-300 ${step >= 6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                        <p className="text-white font-bold text-xl tracking-tight">Incode Agent</p>
                                        <p className="text-gray-400 text-xs uppercase tracking-wider font-medium mt-1">Active Monitoring</p>
                                    </div>
                                </div>
                                <div className={`absolute top-24 left-8 z-20 transition-all duration-700 ease-apple delay-200 ${step >= 7 ? 'opacity-100' : 'opacity-0'}`}><div className="w-14 h-14 bg-[#2C2C2E] border border-gray-700 rounded-2xl flex items-center justify-center shadow-lg"><Mail className="text-blue-400 w-6 h-6" /></div></div>
                                <div className={`absolute bottom-32 right-8 z-20 transition-all duration-700 ease-apple delay-300 ${step >= 7 ? 'opacity-100' : 'opacity-0'}`}><div className="w-14 h-14 bg-[#2C2C2E] border border-gray-700 rounded-2xl flex items-center justify-center shadow-lg"><Slack className="text-emerald-400 w-6 h-6" /></div></div>
                                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10"><defs><linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#60A5FA" stopOpacity="0" /><stop offset="50%" stopColor="#C09AE4" stopOpacity="1" /><stop offset="100%" stopColor="#34D399" stopOpacity="0" /></linearGradient></defs><path d="M 75 140 Q 150 140 150 250" fill="none" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="200" strokeDashoffset={step >= 7 ? "0" : "200"} className="transition-[stroke-dashoffset] duration-[1500ms] ease-apple" /><path d="M 150 330 Q 150 580 245 500" fill="none" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="350" strokeDashoffset={step >= 7 ? "0" : "350"} className="transition-[stroke-dashoffset] duration-[1500ms] ease-apple delay-300" />{step >= 8 && (<><circle r="3" fill="#fff"><animateMotion dur="2s" repeatCount="indefinite" path="M 75 140 Q 150 140 150 250" /></circle><circle r="3" fill="#fff"><animateMotion dur="2s" repeatCount="indefinite" begin="1s" path="M 150 330 Q 150 580 245 500" /></circle></>)}</svg>
                            </div>
                            <div className={`absolute bottom-10 flex items-center gap-2 bg-green-500/20 border border-green-500/30 px-3 py-1.5 rounded-full backdrop-blur-md transition-all duration-500 z-30 ${step >= 9 ? 'opacity-100' : 'opacity-0'}`}><CheckCircle2 className="w-3.5 h-3.5 text-green-400" /><span className="text-green-400 text-xs font-bold tracking-wide uppercase">Sistema Ativo</span></div>
                        </div>
                    </div>
                    <img
                        src="https://library.shadcnblocks.com/images/block/mockups/phone-5.png"
                        alt="Phone Mockup"
                        className="absolute inset-0 w-full h-full z-50 pointer-events-none select-none"
                    />
                </div>
            </div>
        </div>
    );
}
