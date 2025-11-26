'use client'

import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

interface Q11Props {
    onNext: (objection: string, timeSpent: number) => void;
}

export function Q11Objections({ onNext }: Q11Props) {
    const [startTime] = useState(Date.now());
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (objection: string) => {
        setSelected(objection);
        const endTime = Date.now();
        onNext(objection, (endTime - startTime) / 1000);
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
        { id: 'trust', label: 'Não confio em IA fazendo isso por mim' },
        { id: 'cost', label: 'Acho que seria muito caro' },
        { id: 'complexity', label: 'Parece complicado de usar' },
        { id: 'time', label: 'Não tenho tempo para aprender' },
        { id: 'none', label: 'Nenhuma objeção, gostei da ideia!' },
    ];

    return (
        <div className="flex min-h-screen w-full items-center justify-center px-4 py-8">
            <div className="w-full max-w-3xl mx-auto space-y-6 md:space-y-8">

                <div className="space-y-2 md:space-y-3 relative pl-8 md:pl-20">
                    <div className="flex items-center gap-2 absolute left-0 md:left-8 top-0.5">
                        <span className="text-lg md:text-xl font-normal text-gray-900">11</span>
                        <ArrowRight className="h-4 w-4 md:h-5 md:w-5 text-gray-900" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-900 leading-snug">
                        Qual seria sua MAIOR objeção para usar uma ferramenta assim?
                    </h2>
                </div>

                <div className="pl-8 md:pl-20 space-y-3">
                    {options.map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => handleSelect(opt.id)}
                            className={`group flex w-full items-center justify-between rounded-2xl border-2 p-4 md:p-5 text-left transition-all shadow-md hover:shadow-lg active:scale-[0.98] ${opt.id === 'none'
                                ? 'border-green-300 bg-gradient-to-br from-green-50 to-green-100 hover:border-green-500'
                                : 'border-gray-200 bg-gradient-to-br from-[#F3EBFC] to-[#F8F4FC] hover:border-[#C2A9F9]'
                                }`}
                        >
                            <span className={`text-sm md:text-base font-semibold ${opt.id === 'none' ? 'text-green-800' : 'text-gray-800'}`}>
                                {opt.label}
                            </span>
                            {opt.id === 'none' && (
                                <span className="text-xl">✨</span>
                            )}
                        </button>
                    ))}
                </div>

            </div>
        </div>
    );
}
