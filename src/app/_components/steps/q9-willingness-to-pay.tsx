// src/app/_components/steps/q9-willingness-to-pay.tsx
'use client'

import { useState } from 'react';

interface Q9Props {
    onNext: (value: string, timeSpent: number) => void;
}

export function Q9WillingnessToPay({ onNext }: Q9Props) {
    const [startTime] = useState(Date.now());

    const handleSelect = (value: string) => {
        const endTime = Date.now();
        onNext(value, (endTime - startTime) / 1000);
    };

    const options = [
        { id: 'free', label: 'R$0 (só usaria se fosse grátis)', highlight: false },
        { id: 'low', label: 'Até R$30/mês', highlight: true },
        { id: 'medium_low', label: 'R$30-50/mês', highlight: true },
        { id: 'medium', label: 'R$50-100/mês', highlight: true },
        { id: 'high', label: 'R$100-150/mês', highlight: true },
        { id: 'premium', label: 'Mais de R$150/mês', highlight: true },
    ];

    return (
        <div className="flex min-h-screen w-full items-center justify-center px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="w-full max-w-lg space-y-8">

                <div className="space-y-2 text-center">
                    <span className="text-sm font-medium text-primary uppercase tracking-wider">Pergunta 9 de 12</span>
                    <h2 className="text-3xl font-bold text-gray-900">E quanto você estaria DISPOSTO A PAGAR?</h2>
                    <p className="text-gray-500">Seja sincero, não vamos te cobrar nada agora.</p>
                </div>

                <div className="space-y-3">
                    {options.map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => handleSelect(opt.id)}
                            className={`group flex w-full items-center justify-between rounded-xl border-2 p-5 text-left transition-all active:scale-[0.98] ${opt.highlight
                                    ? 'border-gray-100 bg-white hover:border-green-500 hover:shadow-md'
                                    : 'border-gray-100 bg-gray-50 hover:bg-gray-100'
                                }`}
                        >
                            <span className={`text-lg font-medium ${opt.highlight ? 'text-gray-900' : 'text-gray-600'}`}>
                                {opt.label}
                            </span>
                            {opt.highlight && (
                                <span className="text-sm font-bold text-green-600 opacity-0 transition-opacity group-hover:opacity-100">
                                    Investir
                                </span>
                            )}
                        </button>
                    ))}
                </div>

            </div>
        </div>
    );
}
