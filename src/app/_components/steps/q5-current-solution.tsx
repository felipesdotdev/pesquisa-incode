'use client'

import { useState, useRef, useEffect } from 'react';
import { User, Users, Wrench, AlertTriangle, HelpCircle, ArrowRight } from 'lucide-react';

interface Q5Props {
    onNext: (solution: string, toolDetails: string | null, timeSpent: number) => void;
}

export function Q5CurrentSolution({ onNext }: Q5Props) {
    const [startTime] = useState(Date.now());
    const [showInput, setShowInput] = useState(false);
    const [toolName, setToolName] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (showInput && inputRef.current) inputRef.current.focus();
    }, [showInput]);

    const handleSelect = (id: string) => {
        if (id === 'tool') {
            setShowInput(true);
            return;
        }
        submit(id, null);
    };

    const handleToolSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (toolName.trim()) submit('tool', toolName);
    };

    const submit = (solution: string, details: string | null) => {
        const endTime = Date.now();
        onNext(solution, details, (endTime - startTime) / 1000);
    };

    const options = [
        { id: 'manual', label: 'Faço tudo manualmente (eu mesmo)', icon: User },
        { id: 'employee', label: 'Contratei alguém (funcionário/assistente)', icon: Users },
        { id: 'tool', label: 'Uso uma ferramenta/app', icon: Wrench },
        { id: 'overwhelmed', label: 'Não resolvo, fico sobrecarregado', icon: AlertTriangle },
        { id: 'other', label: 'Outra forma', icon: HelpCircle },
    ];

    return (
        <div className="flex min-h-screen w-full items-center justify-center px-4 py-8">
            <div className="w-full max-w-3xl mx-auto space-y-6 md:space-y-8">

                <div className="space-y-2 md:space-y-3 relative pl-8 md:pl-20">
                    <div className="flex items-center gap-2 absolute left-0 md:left-8 top-0.5">
                        <span className="text-lg md:text-xl font-normal text-gray-900">5</span>
                        <ArrowRight className="h-4 w-4 md:h-5 md:w-5 text-gray-900" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-900 leading-snug">
                        Como você resolve isso hoje?
                    </h2>
                </div>

                {!showInput ? (
                    <div className="pl-8 md:pl-20 space-y-3">
                        {options.map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => handleSelect(opt.id)}
                                className="group flex w-full items-center gap-3 md:gap-4 rounded-2xl border-2 border-gray-200 bg-gradient-to-br from-[#F3EBFC] to-[#F8F4FC] p-4 md:p-5 text-left transition-all shadow-md hover:border-[#C2A9F9] hover:shadow-lg active:scale-[0.98]"
                            >
                                <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full bg-white/60 text-[#B290F7] transition-colors group-hover:bg-white">
                                    <opt.icon className="h-5 w-5 md:h-6 md:w-6" />
                                </div>
                                <span className="text-sm md:text-base font-semibold text-gray-800 group-hover:text-gray-900">
                                    {opt.label}
                                </span>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="pl-8 md:pl-20 space-y-6">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-2xl text-blue-800 text-sm md:text-base border-2 border-blue-200 shadow-sm">
                            Legal! Saber qual ferramenta você usa nos ajuda a entender o que podemos melhorar.
                        </div>

                        <form onSubmit={handleToolSubmit} className="space-y-4">
                            <input
                                ref={inputRef}
                                type="text"
                                value={toolName}
                                onChange={(e) => setToolName(e.target.value)}
                                placeholder="Qual ferramenta? (Ex: Trello, RD Station...)"
                                className="w-full rounded-2xl border-2 border-[#C2A9F9] bg-white p-4 md:p-5 text-sm md:text-base shadow-md outline-none focus:ring-2 focus:ring-[#C2A9F9]/20 placeholder:text-gray-400"
                            />
                            <div className="flex flex-col gap-3">
                                <button
                                    type="submit"
                                    disabled={!toolName.trim()}
                                    className="flex text-lg md:text-xl px-3 md:px-3.5 py-1.5 font-bold items-center justify-center rounded-full bg-[#C2A9F9] text-white shadow-md transition-all hover:bg-[#B290F7] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-[#C2A9F9]"
                                >
                                    OK
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowInput(false)}
                                    className="w-full text-center text-sm text-gray-500 hover:text-gray-700 hover:underline"
                                >
                                    Voltar
                                </button>
                            </div>
                        </form>
                    </div>
                )}

            </div>
        </div>
    );
}
