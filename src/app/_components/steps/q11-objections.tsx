// src/app/_components/steps/q11-objections.tsx
'use client'

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface Q11Props {
    onNext: (text: string, timeSpent: number) => void;
}

export function Q11Objections({ onNext }: Q11Props) {
    const [startTime] = useState(Date.now());
    const [text, setText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const endTime = Date.now();
        onNext(text, (endTime - startTime) / 1000);
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="w-full max-w-lg space-y-8">

                <div className="space-y-2 text-center">
                    <span className="text-sm font-medium text-red-500 uppercase tracking-wider">Feedback Importante</span>
                    <h2 className="text-3xl font-bold text-gray-900">O que te faria NÃO usar uma solução assim?</h2>
                    <p className="text-gray-500">Sua sinceridade nos ajuda a não criar algo inútil.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Ex: Tenho medo de erros, acho caro, não entendo tecnologia..."
                        className="w-full min-h-[150px] rounded-xl border-2 border-red-100 p-5 text-lg shadow-sm outline-none transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500/20 resize-none bg-red-50/30"
                        autoFocus
                    />

                    <button
                        type="submit"
                        className="group flex w-full items-center justify-center rounded-xl bg-gray-900 py-4 text-lg font-bold text-white transition-all hover:bg-gray-800 hover:shadow-lg"
                    >
                        {text.length > 0 ? 'Enviar Feedback' : 'Prefiro não dizer'}
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </button>
                </form>

            </div>
        </div>
    );
}
