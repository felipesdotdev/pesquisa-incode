// src/app/_components/steps/q5-current-solution.tsx
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
        <div className="flex min-h-screen w-full items-center justify-center px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="w-full max-w-lg space-y-8">

                <div className="space-y-2 text-center">
                    <span className="text-sm font-medium text-primary uppercase tracking-wider">Pergunta 5 de 12</span>
                    <h2 className="text-3xl font-bold text-gray-900">Como você resolve isso hoje?</h2>
                </div>

                {!showInput ? (
                    <div className="space-y-3">
                        {options.map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => handleSelect(opt.id)}
                                className="group flex w-full items-center gap-4 rounded-xl border-2 border-gray-100 bg-white p-5 text-left transition-all hover:border-primary hover:shadow-md"
                            >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-50 text-gray-500 transition-colors group-hover:bg-purple-50 group-hover:text-primary">
                                    <opt.icon className="h-5 w-5" />
                                </div>
                                <span className="text-lg font-medium text-gray-700 group-hover:text-gray-900">
                                    {opt.label}
                                </span>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="bg-blue-50 p-4 rounded-lg text-blue-800 text-sm border border-blue-100">
                            Legal! Saber qual ferramenta você usa nos ajuda a entender o que podemos melhorar.
                        </div>

                        <form onSubmit={handleToolSubmit} className="space-y-4">
                            <input
                                ref={inputRef}
                                type="text"
                                value={toolName}
                                onChange={(e) => setToolName(e.target.value)}
                                placeholder="Qual ferramenta? (Ex: Trello, RD Station...)"
                                className="w-full rounded-xl border-2 border-primary p-5 text-lg shadow-lg outline-none"
                            />
                            <button
                                type="submit"
                                disabled={!toolName.trim()}
                                className="flex w-full items-center justify-center rounded-xl bg-primary py-4 font-bold text-white hover:bg-primary-hover disabled:opacity-50"
                            >
                                Continuar <ArrowRight className="ml-2 h-5 w-5" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowInput(false)}
                                className="w-full text-center text-sm text-gray-500 hover:underline"
                            >
                                Voltar
                            </button>
                        </form>
                    </div>
                )}

            </div>
        </div>
    );
}
