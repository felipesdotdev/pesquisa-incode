// src/app/_components/steps/q4-pain-intensity.tsx
'use client'

import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

interface Q4Props {
    onNext: (value: number, timeSpent: number) => void;
}

export function Q4PainIntensity({ onNext }: Q4Props) {
    const [startTime] = useState(Date.now());
    const [value, setValue] = useState(5); // Começa no meio
    const [emoji, setEmoji] = useState('😐');

    // Atualiza o emoji conforme o valor muda
    useEffect(() => {
        if (value <= 2) setEmoji('😌'); // Tranquilo
        else if (value <= 4) setEmoji('🙂'); // Ok
        else if (value <= 6) setEmoji('😐'); // Neutro
        else if (value <= 8) setEmoji('😤'); // Incomodado
        else setEmoji('😡'); // Muito bravo
    }, [value]);

    const handleNext = () => {
        const endTime = Date.now();
        onNext(value, (endTime - startTime) / 1000);
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="w-full max-w-lg space-y-10 text-center">

                <div className="space-y-4">
                    <span className="text-sm font-medium text-primary uppercase tracking-wider">Pergunta 4 de 12</span>
                    <h2 className="text-3xl font-bold text-gray-900">De 0 a 10, quanto isso te INCOMODA?</h2>
                    <p className="text-gray-500">0 = Não incomoda nada | 10 = Incomoda MUITO</p>
                </div>

                {/* Área Visual do Feedback */}
                <div className="flex flex-col items-center justify-center gap-4 py-6">
                    <div className="text-8xl animate-bounce-slow transition-all duration-300 transform hover:scale-110">
                        {emoji}
                    </div>
                    <span className="text-4xl font-bold text-primary">{value}</span>
                </div>

                {/* Slider Customizado */}
                <div className="px-4">
                    <input
                        type="range"
                        min="0"
                        max="10"
                        step="1"
                        value={value}
                        onChange={(e) => setValue(parseInt(e.target.value))}
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-2 px-1">
                        <span>0 (Zen)</span>
                        <span>10 (Caos)</span>
                    </div>
                </div>

                <button
                    onClick={handleNext}
                    className="group inline-flex w-full items-center justify-center rounded-xl bg-primary py-4 text-lg font-bold text-white transition-all hover:bg-primary-hover hover:shadow-lg active:scale-[0.98]"
                >
                    Confirmar
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>

            </div>
        </div>
    );
}
