'use client'

import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

interface Q3Props {
    onNext: (answer: string, timeSpent: number) => void;
}

export function Q3TimeSpent({ onNext }: Q3Props) {
    const [startTime] = useState(Date.now());
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (value: string) => {
        setSelected(value);
        const endTime = Date.now();
        onNext(value, (endTime - startTime) / 1000);
    };

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'Enter' && selected) {
                const endTime = Date.now();
                onNext(selected, (endTime - startTime) / 1000);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [selected, onNext, startTime]);

    const options = [
        { id: 'under_5h', label: 'Menos de 5 horas', emoji: '⏱️', color: 'from-blue-50 to-blue-100' },
        { id: '5_10h', label: '5 a 10 horas', emoji: '⏳', color: 'from-yellow-50 to-yellow-100' },
        { id: '10_20h', label: '10 a 20 horas', emoji: '🕐', color: 'from-orange-50 to-orange-100' },
        { id: 'over_20h', label: 'Mais de 20 horas', emoji: '🔥', color: 'from-red-50 to-red-100' },
        { id: 'none', label: 'Não faço essas tarefas', emoji: '🚫', color: 'from-gray-100 to-gray-200' },
    ];

    return (
        <div className="flex min-h-screen w-full items-center justify-center px-4 py-8">
            <div className="w-full max-w-3xl mx-auto space-y-6 md:space-y-8">

                <div className="space-y-2 md:space-y-3 relative pl-8 md:pl-20">
                    <div className="flex items-center gap-2 absolute left-0 md:left-8 top-0.5">
                        <span className="text-lg md:text-xl font-normal text-gray-900">3</span>
                        <ArrowRight className="h-4 w-4 md:h-5 md:w-5 text-gray-900" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-900 leading-snug">
                        Quanto tempo POR SEMANA você gasta com tarefas repetitivas?
                    </h2>
                    <p className="text-sm md:text-base text-gray-600">
                        Ex: responder WhatsApp/Instagram, agendar clientes, gerar relatórios, postar em redes sociais...
                    </p>
                </div>

                <div className="pl-8 md:pl-20 space-y-3">
                    {options.map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => handleSelect(opt.id)}
                            className={`group flex w-full items-center gap-3 md:gap-4 rounded-2xl border-2 border-gray-200 bg-gradient-to-br ${opt.color} p-4 md:p-5 transition-all shadow-md hover:border-[#C2A9F9] hover:shadow-lg active:scale-[0.98]`}
                        >
                            <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full bg-white/60 text-xl md:text-2xl">
                                {opt.emoji}
                            </div>
                            <span className="text-sm md:text-base font-semibold text-gray-800 group-hover:text-gray-900">
                                {opt.label}
                            </span>
                        </button>
                    ))}
                </div>

            </div>
        </div>
    );
}
