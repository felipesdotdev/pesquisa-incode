// src/app/_components/steps/q6-pitch.tsx
'use client'

import { useState } from 'react';
import { ArrowRight, CheckCircle2, MessageSquare } from 'lucide-react';

interface Q6Props {
    onNext: (timeSpent: number) => void;
}

export function Q6Pitch({ onNext }: Q6Props) {
    const [startTime] = useState(Date.now());

    const handleNext = () => {
        const endTime = Date.now();
        onNext((endTime - startTime) / 1000);
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="container mx-auto grid max-w-5xl grid-cols-1 items-center gap-12 lg:grid-cols-2">

                {/* Left: Copy persuasiva */}
                <div className="order-2 space-y-8 lg:order-1">
                    <div className="space-y-4">
                        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-purple-700">
                            A Solução
                        </span>
                        <h2 className="text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
                            Imagine criar automações <br />
                            <span className="text-primary">apenas conversando.</span>
                        </h2>
                        <p className="text-lg text-gray-600">
                            Esqueça códigos ou ferramentas complexas. Com o <strong>Incode</strong>, você abre o chat, pede o que precisa, e a IA cria para você.
                        </p>
                    </div>

                    <ul className="space-y-3">
                        {[
                            'Atenda WhatsApp e Instagram automaticamente',
                            'Poste nas redes sociais no horário certo',
                            'Gere planilhas e relatórios financeiros',
                            'Crie sites e formulários em segundos'
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-gray-700">
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                {item}
                            </li>
                        ))}
                    </ul>

                    <button
                        onClick={handleNext}
                        className="group inline-flex h-14 w-full items-center justify-center rounded-xl bg-primary px-8 text-lg font-bold text-white transition-all hover:bg-primary-hover hover:shadow-xl active:scale-[0.98] sm:w-auto"
                    >
                        Entendi, quero ver mais
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </button>
                </div>

                {/* Right: Mockup Animado (Chat Simulation) */}
                <div className="order-1 flex justify-center lg:order-2">
                    <div className="relative h-[500px] w-[300px] overflow-hidden rounded-[30px] border-[8px] border-gray-900 bg-gray-50 shadow-2xl">
                        <div className="absolute top-0 left-0 right-0 h-14 bg-white shadow-sm flex items-center px-4 z-10">
                            <div className="font-bold text-gray-800">Incode AI</div>
                        </div>

                        <div className="p-4 pt-20 space-y-4">
                            {/* User Msg */}
                            <div className="flex justify-end animate-in slide-in-from-bottom-4 fade-in duration-700 delay-300 fill-mode-forwards opacity-0" style={{ animationDelay: '0.5s' }}>
                                <div className="bg-primary text-white p-3 rounded-2xl rounded-tr-none text-sm max-w-[85%] shadow-sm">
                                    Crie um agente para agendar consultas no meu WhatsApp.
                                </div>
                            </div>

                            {/* AI Processing */}
                            <div className="flex justify-start animate-in slide-in-from-bottom-4 fade-in duration-700 delay-1000 fill-mode-forwards opacity-0" style={{ animationDelay: '1.5s' }}>
                                <div className="bg-white text-gray-800 p-3 rounded-2xl rounded-tl-none text-sm max-w-[85%] shadow-sm border border-gray-100 flex gap-2 items-center">
                                    <MessageSquare className="h-4 w-4 text-primary animate-pulse" />
                                    <span className="text-xs text-gray-500">Criando agente...</span>
                                </div>
                            </div>

                            {/* AI Success */}
                            <div className="flex justify-start animate-in slide-in-from-bottom-4 fade-in duration-700 delay-[2000ms] fill-mode-forwards opacity-0" style={{ animationDelay: '3.5s' }}>
                                <div className="bg-white text-gray-800 p-3 rounded-2xl rounded-tl-none text-sm max-w-[90%] shadow-sm border border-gray-100">
                                    <p className="font-semibold text-green-600 mb-1">✅ Pronto!</p>
                                    <p>Seu agente de agendamentos está ativo. Ele já pode responder clientes e salvar na sua agenda.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
