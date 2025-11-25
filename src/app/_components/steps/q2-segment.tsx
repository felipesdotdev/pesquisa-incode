'use client'

import { useState, useEffect } from 'react';
import { ArrowRight, Building2, Briefcase, User, XCircle } from 'lucide-react';

interface Q2Props {
    onNext: (answer: string, timeSpent: number) => void;
}

export function Q2Segment({ onNext }: Q2Props) {
    const [startTime] = useState(Date.now());
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (option: string) => {
        setSelected(option);
    };

    const handleContinue = () => {
        if (!selected) return;
        const endTime = Date.now();
        const timeSpent = (endTime - startTime) / 1000;
        onNext(selected, timeSpent);
    };

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'Enter' && selected) {
                const endTime = Date.now();
                const timeSpent = (endTime - startTime) / 1000;
                onNext(selected, timeSpent);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [selected, onNext, startTime]);

    const options = [
        { id: 'service', label: 'Prestadora de serviço', icon: User, letter: 'A' },
        { id: 'store', label: 'Comércio/Loja física', icon: Briefcase, letter: 'B' },
        { id: 'restaurant', label: 'Restaurante/Lanchonete', icon: Building2, letter: 'C' },
        { id: 'other', label: 'Outro', icon: XCircle, letter: 'D' },
    ];

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-[#FAF7EF] px-4 py-8">
            <div className="w-full max-w-3xl mx-auto space-y-6 md:space-y-8">

                <div className="space-y-2 md:space-y-3 relative pl-8 md:pl-20">
                    <div className="flex items-center gap-2 absolute left-0 md:left-8 top-0.5">
                        <span className="text-lg md:text-xl font-normal text-gray-900">2</span>
                        <ArrowRight className="h-4 w-4 md:h-5 md:w-5 text-gray-900" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-900 leading-snug">
                        Qual o segmento da sua empresa?
                    </h2>
                    <p className="text-sm md:text-base text-gray-600">Escolha a opção que melhor representa.</p>
                </div>

                <div className="grid grid-cols-2 gap-3 md:flex md:flex-wrap md:gap-4 pl-8 md:pl-20">
                    {options.map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => handleSelect(opt.id)}
                            className={`
                                group relative flex flex-col items-center justify-center 
                                h-40 md:h-52 md:w-40
                                rounded-2xl border-2 transition-all
                                ${selected === opt.id
                                    ? 'border-[#C2A9F9] bg-gradient-to-br from-[#E5DAFB] to-[#F0E8FC] shadow-lg'
                                    : 'border-gray-200 bg-gradient-to-br from-[#F3EBFC] to-[#F8F4FC] shadow-md hover:border-[#C2A9F9] hover:shadow-lg'
                                }
                            `}
                        >
                            <span className="absolute left-2 md:left-3 top-2 md:top-3 text-xs font-semibold text-gray-500">
                                {opt.letter}
                            </span>

                            <div className="flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-full bg-white/60 mb-3 md:mb-4">
                                <opt.icon className="h-6 w-6 md:h-8 md:w-8 text-[#B290F7]" />
                            </div>

                            <span className="px-2 md:px-3 text-center text-xs md:text-sm font-semibold text-gray-800 leading-tight break-words w-full">
                                {opt.label}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="flex justify-start pt-2 md:pt-4 pl-8 md:pl-20">
                    <button
                        onClick={handleContinue}
                        disabled={!selected}
                        className="flex text-lg md:text-xl px-3 md:px-3.5 py-1.5 font-bold items-center justify-center rounded-full bg-[#C2A9F9] text-white shadow-md transition-all hover:bg-[#B290F7] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-[#C2A9F9]"
                    >
                        OK
                    </button>
                </div>

            </div>
        </div>
    );
}
