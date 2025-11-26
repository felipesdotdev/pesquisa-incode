'use client'

import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

interface Q9Props {
    onNext: (value: string, timeSpent: number) => void;
}

export function Q9WillingnessToPay({ onNext }: Q9Props) {
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
        { id: 'free', label: 'Prefiro usar versões gratuitas' },
        { id: 'low', label: 'Até R$49/mês' },
        { id: 'medium', label: 'R$50 - R$99/mês' },
        { id: 'high', label: 'R$100 - R$199/mês' },
        { id: 'premium', label: 'R$200+/mês' },
    ];

    return (
        <div className="flex min-h-screen w-full items-center justify-center px-4 py-8">
            <div className="w-full max-w-3xl mx-auto space-y-6 md:space-y-8">

                <div className="space-y-2 md:space-y-3 relative pl-8 md:pl-20">
                    <div className="flex items-center gap-2 absolute left-0 md:left-8 top-0.5">
                        <span className="text-lg md:text-xl font-normal text-gray-900">9</span>
                        <ArrowRight className="h-4 w-4 md:h-5 md:w-5 text-gray-900" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-900 leading-snug">
                        E quanto você estaria disposto a investir mensalmente para resolver esses problemas?
                    </h2>
                    <p className="text-sm md:text-base text-gray-600">
                        (Se a ferramenta funcionasse perfeitamente)
                    </p>
                </div>

                <div className="pl-8 md:pl-20 space-y-3">
                    {options.map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => handleSelect(opt.id)}
                            className="group flex w-full items-center justify-between rounded-2xl border-2 border-gray-200 bg-gradient-to-br from-[#F3EBFC] to-[#F8F4FC] p-4 md:p-5 text-left transition-all shadow-md hover:border-[#C2A9F9] hover:shadow-lg active:scale-[0.98]"
                        >
                            <span className="text-sm md:text-base font-semibold text-gray-800 group-hover:text-gray-900">
                                {opt.label}
                            </span>
                            <div className="h-5 w-5 flex-shrink-0 rounded-full border-2 border-gray-300 group-hover:border-[#C2A9F9] group-hover:bg-[#C2A9F9] transition-all" />
                        </button>
                    ))}
                </div>

            </div>
        </div>
    );
}
