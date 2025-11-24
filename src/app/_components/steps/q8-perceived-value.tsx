// src/app/_components/steps/q8-perceived-value.tsx
'use client'

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface Q8Props {
    onNext: (value: string, timeSpent: number) => void;
}

export function Q8PerceivedValue({ onNext }: Q8Props) {
    const [startTime] = useState(Date.now());

    const handleSelect = (value: string) => {
        const endTime = Date.now();
        onNext(value, (endTime - startTime) / 1000);
    };

    const options = [
        { id: 'low', label: 'Até R$30/mês' },
        { id: 'medium_low', label: 'R$30-50/mês' },
        { id: 'medium', label: 'R$50-100/mês' },
        { id: 'high', label: 'R$100-150/mês' },
        { id: 'premium', label: 'Mais de R$150/mês' },
    ];

    return (
        <div className="flex min-h-screen w-full items-center justify-center px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="w-full max-w-lg space-y-8">

                <div className="space-y-2 text-center">
                    <span className="text-sm font-medium text-primary uppercase tracking-wider">Pergunta 8 de 12</span>
                    <h2 className="text-3xl font-bold text-gray-900">Quanto você ACHA que uma plataforma assim vale?</h2>
                    <p className="text-gray-500">(Considerando o tempo que ela te economizaria)</p>
                </div>

                <div className="space-y-3">
                    {options.map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => handleSelect(opt.id)}
                            className="group flex w-full items-center justify-between rounded-xl border-2 border-gray-100 bg-white p-5 text-left transition-all hover:border-primary hover:shadow-md active:scale-[0.98]"
                        >
                            <span className="text-lg font-medium text-gray-700 group-hover:text-gray-900">
                                {opt.label}
                            </span>
                            <div className="h-4 w-4 rounded-full border-2 border-gray-300 group-hover:border-primary group-hover:bg-primary" />
                        </button>
                    ))}
                </div>

            </div>
        </div>
    );
}
