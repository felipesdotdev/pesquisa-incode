'use client'

import { useState, useEffect } from 'react';
import { ArrowRight, Rocket, ThumbsUp, HelpCircle, ThumbsDown, XCircle } from 'lucide-react';

interface Q7Props {
    onNext: (intent: string, timeSpent: number) => void;
}

export function Q7UsageIntent({ onNext }: Q7Props) {
    const [startTime] = useState(Date.now());
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (intent: string) => {
        setSelected(intent);
        const endTime = Date.now();
        onNext(intent, (endTime - startTime) / 1000);
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
        { id: 'definitely', label: 'Com certeza usaria!', icon: Rocket, color: 'border-[#C2A9F9] bg-gradient-to-br from-[#E5DAFB] to-[#F0E8FC]' },
        { id: 'probably', label: 'Provavelmente usaria', icon: ThumbsUp, color: 'border-gray-200 bg-gradient-to-br from-[#F3EBFC] to-[#F8F4FC] hover:border-[#C2A9F9]' },
        { id: 'maybe', label: 'Talvez, depende', icon: HelpCircle, color: 'border-gray-200 bg-gradient-to-br from-[#FFFBEB] to-[#FEF3C7] hover:border-yellow-400' },
        { id: 'probably_not', label: 'Provavelmente não', icon: ThumbsDown, color: 'border-gray-200 bg-gradient-to-br from-[#F9FAFB] to-[#F3F4F6] hover:border-gray-400' },
        { id: 'definitely_not', label: 'Com certeza não', icon: XCircle, color: 'border-gray-200 bg-gradient-to-br from-[#FEF2F2] to-[#FEE2E2] hover:border-red-300' },
    ];

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-[#FAF7EF] px-4 py-8">
            <div className="w-full max-w-3xl mx-auto space-y-6 md:space-y-8">

                <div className="space-y-2 md:space-y-3 relative pl-8 md:pl-20">
                    <div className="flex items-center gap-2 absolute left-0 md:left-8 top-0.5">
                        <span className="text-lg md:text-xl font-normal text-gray-900">7</span>
                        <ArrowRight className="h-4 w-4 md:h-5 md:w-5 text-gray-900" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-900 leading-snug">
                        Sendo bem sincero(a)... você usaria algo assim?
                    </h2>
                </div>

                <div className="pl-8 md:pl-20 space-y-3">
                    {options.map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => handleSelect(opt.id)}
                            className={`group flex w-full items-center justify-between rounded-2xl border-2 p-4 md:p-5 text-left transition-all shadow-md hover:shadow-lg active:scale-[0.98] ${opt.color}`}
                        >
                            <span className="text-sm md:text-base font-semibold text-gray-800">{opt.label}</span>
                            <opt.icon className="h-5 w-5 md:h-6 md:w-6 text-[#B290F7] opacity-70 group-hover:opacity-100 flex-shrink-0" />
                        </button>
                    ))}
                </div>

            </div>
        </div>
    );
}
