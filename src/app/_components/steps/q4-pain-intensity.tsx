'use client'

import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

interface Q4Props {
    onNext: (value: number, timeSpent: number) => void;
}

export function Q4PainIntensity({ onNext }: Q4Props) {
    const [startTime] = useState(Date.now());
    const [selected, setSelected] = useState<number | null>(null);

    const handleNext = () => {
        if (selected === null) return;
        const endTime = Date.now();
        onNext(selected, (endTime - startTime) / 1000);
    };

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'Enter' && selected !== null) {
                const endTime = Date.now();
                onNext(selected, (endTime - startTime) / 1000);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [selected, onNext, startTime]);

    const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-[#FAF7EF] px-4 py-8">
            <div className="w-full max-w-4xl mx-auto space-y-6 md:space-y-8">

                <div className="space-y-2 md:space-y-3 relative pl-8 md:pl-20">
                    <div className="flex items-center gap-2 absolute left-0 md:left-8 top-0.5">
                        <span className="text-lg md:text-xl font-normal text-gray-900">4</span>
                        <ArrowRight className="h-4 w-4 md:h-5 md:w-5 text-gray-900" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-900 leading-snug">
                        De 0 a 10, quanto isso te INCOMODA?
                    </h2>
                    <p className="text-sm md:text-base text-gray-600">
                        0 = Não incomoda nada | 10 = Incomoda MUITO
                    </p>
                </div>

                <div className="pl-8 md:pl-20 space-y-6">
                    {/* Círculos numerados - todos na mesma linha sem scroll */}
                    <div className="flex justify-center items-center gap-1 sm:gap-2 md:gap-3">
                        {numbers.map((num) => (
                            <button
                                key={num}
                                onClick={() => setSelected(num)}
                                className={`
                                    flex h-9 w-9 sm:h-11 sm:w-11 md:h-14 md:w-14 items-center justify-center 
                                    rounded-full border-2 font-semibold text-xs sm:text-sm md:text-lg
                                    transition-all
                                    ${selected === num
                                        ? 'border-[#C2A9F9] bg-[#C2A9F9] text-white shadow-lg scale-110'
                                        : 'border-gray-300 bg-gray-200 text-gray-700 hover:border-[#C2A9F9] hover:bg-gray-100'
                                    }
                                `}
                            >
                                {num}
                            </button>
                        ))}
                    </div>

                    {/* Labels */}
                    <div className="flex justify-between text-xs md:text-sm text-gray-600 px-2">
                        <span>0 (Zen)</span>
                        <span>10 (Caos)</span>
                    </div>
                </div>

                <div className="flex justify-start pt-2 md:pt-4 pl-8 md:pl-20">
                    <button
                        onClick={handleNext}
                        disabled={selected === null}
                        className="flex text-lg md:text-xl px-3 md:px-3.5 py-1.5 font-bold items-center justify-center rounded-full bg-[#C2A9F9] text-white shadow-md transition-all hover:bg-[#B290F7] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-[#C2A9F9]"
                    >
                        OK
                    </button>
                </div>

            </div>
        </div>
    );
}
