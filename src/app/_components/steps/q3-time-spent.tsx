// src/app/_components/steps/q3-time-spent.tsx
'use client'

import { useState } from 'react';
import { Clock, Flame, Ban } from 'lucide-react';

interface Q3Props {
    onNext: (answer: string, timeSpent: number) => void;
}

export function Q3TimeSpent({ onNext }: Q3Props) {
    const [startTime] = useState(Date.now());

    const handleSelect = (value: string) => {
        const endTime = Date.now();
        onNext(value, (endTime - startTime) / 1000);
    };

    const options = [
        { id: 'under_5h', label: 'Menos de 5 horas', emoji: '⏱️', color: 'bg-blue-50 text-blue-600' },
        { id: '5_10h', label: '5 a 10 horas', emoji: '⏳', color: 'bg-yellow-50 text-yellow-600' },
        { id: '10_20h', label: '10 a 20 horas', emoji: '🕐', color: 'bg-orange-50 text-orange-600' },
        { id: 'over_20h', label: 'Mais de 20 horas', emoji: '🔥', color: 'bg-red-50 text-red-600' },
        { id: 'none', label: 'Não faço essas tarefas', emoji: '🚫', color: 'bg-gray-100 text-gray-500' },
    ];

    return (
        <div className="flex min-h-screen w-full items-center justify-center px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="w-full max-w-lg space-y-8">

                <div className="space-y-4 text-center">
                    <span className="text-sm font-medium text-primary uppercase tracking-wider">Pergunta 3 de 12</span>
                    <h2 className="text-3xl font-bold text-gray-900">Quanto tempo POR SEMANA você gasta com tarefas repetitivas?</h2>
                    <p className="text-gray-500">
                        Ex: responder WhatsApp/Instagram, agendar clientes, gerar relatórios, postar em redes sociais...
                    </p>
                </div>

                <div className="space-y-3">
                    {options.map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => handleSelect(opt.id)}
                            className="group flex w-full items-center gap-4 rounded-xl border-2 border-gray-100 bg-white p-4 transition-all hover:border-primary hover:shadow-md active:scale-[0.98]"
                        >
                            <div className={`flex h-12 w-12 items-center justify-center rounded-full text-2xl ${opt.color}`}>
                                {opt.emoji}
                            </div>
                            <span className="text-lg font-medium text-gray-700 group-hover:text-gray-900">
                                {opt.label}
                            </span>
                        </button>
                    ))}
                </div>

            </div>
        </div>
    );
}
