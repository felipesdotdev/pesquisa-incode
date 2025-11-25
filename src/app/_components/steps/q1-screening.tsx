'use client'

import { useState, useEffect } from 'react';
import { ArrowRight, Briefcase, User, Building2, XCircle } from 'lucide-react';

interface Q1Props {
    onNext: (answer: string, timeSpent: number) => void;
}

export function Q1Screening({ onNext }: Q1Props) {
    const [startTime] = useState(Date.now());
    const [selected, setSelected] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleSelect = (option: string) => {
        setSelected(option);
        // Auto-advance on mobile
        if (isMobile) {
            const endTime = Date.now();
            const timeSpent = (endTime - startTime) / 1000;
            onNext(option, timeSpent);
        }
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
        { id: 'owner', label: 'Sim, sou dono(a) ou sócio(a)', icon: User, letter: 'A' },
        { id: 'manager', label: 'Sim, sou gerente/coordenador(a)', icon: Briefcase, letter: 'B' },
        { id: 'employee', label: 'Trabalho em pequeno negócio', icon: Building2, letter: 'C' },
        { id: 'no', label: 'Não', icon: XCircle, letter: 'D' },
    ];

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-[#FAF7EF] px-4 py-8">
            <div className="w-full max-w-3xl mx-auto space-y-6 md:space-y-8">

                <div className="space-y-2 md:space-y-3 relative pl-8 md:pl-20">
                    <div className="flex items-center gap-2 absolute left-0 md:left-10 top-0.5">
                        <span className="text-lg md:text-xl font-normal text-gray-900">1</span>
                        <ArrowRight className="h-4 w-4 md:h-5 md:w-5 text-gray-900" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-900 leading-snug">
                        Você tem ou trabalha em um pequeno negócio?
                    </h2>
                    <p className="text-sm md:text-base text-gray-600">Escolha a melhor opção.</p>
                </div>

                {/* Mobile: Vertical list layout */}
                <div className="md:hidden pl-8 space-y-3">
                    {options.map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => handleSelect(opt.id)}
                            className="group flex w-full items-center gap-3 rounded-2xl border-2 border-gray-200 bg-gradient-to-br from-[#F3EBFC] to-[#F8F4FC] p-4 text-left transition-all shadow-md hover:border-[#C2A9F9] hover:shadow-lg active:scale-[0.98]"
                        >
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/60 text-[#B290F7] transition-colors group-hover:bg-white">
                                <opt.icon className="h-5 w-5" />
                            </div>
                            <span className="text-sm font-semibold text-gray-800 group-hover:text-gray-900">
                                {opt.label}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Desktop: Card layout */}
                <div className="hidden md:flex flex-wrap gap-4 pl-20">
                    {options.map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => handleSelect(opt.id)}
                            className={`
                                group relative flex h-56 w-40 flex-col items-center justify-center 
                                rounded-2xl border-2 transition-all
                                ${selected === opt.id
                                    ? 'border-[#C2A9F9] bg-gradient-to-br from-[#E5DAFB] to-[#F0E8FC] shadow-lg'
                                    : 'border-gray-200 bg-gradient-to-br from-[#F3EBFC] to-[#F8F4FC] shadow-md hover:border-[#C2A9F9] hover:shadow-lg'
                                }
                            `}
                        >
                            <span className="absolute left-3 top-3 text-xs font-semibold text-gray-500">
                                {opt.letter}
                            </span>

                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/60 mb-4">
                                <opt.icon className="h-8 w-8 text-[#B290F7]" />
                            </div>

                            <span className="px-3 text-center text-xs font-semibold text-gray-800 leading-tight break-words w-full">
                                {opt.label}
                            </span>
                        </button>
                    ))}
                </div>

                {/* OK button - only visible on desktop */}
                <div className="hidden md:flex justify-start pt-4 pl-20">
                    <button
                        onClick={handleContinue}
                        disabled={!selected}
                        className="flex text-xl px-3.5 py-1.5 font-bold items-center justify-center rounded-full bg-[#C2A9F9] text-white shadow-md transition-all hover:bg-[#B290F7] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-[#C2A9F9]"
                    >
                        OK
                    </button>
                </div>

            </div>
        </div>
    );
}
