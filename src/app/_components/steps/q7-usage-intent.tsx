// src/app/_components/steps/q7-usage-intent.tsx
'use client'

import { useState } from 'react';
import { Rocket, ThumbsUp, HelpCircle, ThumbsDown, XCircle } from 'lucide-react';

interface Q7Props {
    onNext: (intent: string, timeSpent: number) => void;
}

export function Q7UsageIntent({ onNext }: Q7Props) {
    const [startTime] = useState(Date.now());

    const handleSelect = (intent: string) => {
        const endTime = Date.now();
        onNext(intent, (endTime - startTime) / 1000);
    };

    const options = [
        { id: 'definitely', label: 'Com certeza usaria!', icon: Rocket, style: 'border-primary bg-purple-50 text-primary font-bold' },
        { id: 'probably', label: 'Provavelmente usaria', icon: ThumbsUp, style: 'border-gray-200 hover:border-primary hover:bg-gray-50' },
        { id: 'maybe', label: 'Talvez, depende', icon: HelpCircle, style: 'border-gray-200 hover:border-yellow-400 hover:bg-yellow-50' },
        { id: 'probably_not', label: 'Provavelmente não', icon: ThumbsDown, style: 'border-gray-200 hover:border-gray-400' },
        { id: 'definitely_not', label: 'Com certeza não', icon: XCircle, style: 'border-gray-200 hover:border-red-200 hover:bg-red-50' },
    ];

    return (
        <div className="flex min-h-screen w-full items-center justify-center px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="w-full max-w-lg space-y-8">

                <div className="space-y-2 text-center">
                    <span className="text-sm font-medium text-primary uppercase tracking-wider">Pergunta 7 de 12</span>
                    <h2 className="text-3xl font-bold text-gray-900">Sendo bem sincero(a)... você usaria algo assim?</h2>
                </div>

                <div className="space-y-3">
                    {options.map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => handleSelect(opt.id)}
                            className={`group flex w-full items-center justify-between rounded-xl border-2 p-5 text-left transition-all active:scale-[0.98] ${opt.style}`}
                        >
                            <span className="text-lg text-gray-900 group-hover:text-inherit">{opt.label}</span>
                            <opt.icon className="h-6 w-6 opacity-70 group-hover:opacity-100" />
                        </button>
                    ))}
                </div>

            </div>
        </div>
    );
}
