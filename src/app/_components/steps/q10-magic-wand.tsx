// src/app/_components/steps/q10-magic-wand.tsx
'use client'

import { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface Q10Props {
    onNext: (text: string, timeSpent: number) => void;
}

export function Q10MagicWand({ onNext }: Q10Props) {
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
                    <span className="text-sm font-medium text-primary uppercase tracking-wider">Pergunta 10 de 12</span>
                    <div className="flex justify-center py-2">
                        <Sparkles className="h-12 w-12 text-yellow-400 animate-pulse" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">
                        Se você tivesse uma 'varinha mágica' para automatizar UMA tarefa chata do seu dia, qual seria?
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Ex: Confirmar agendamentos no WhatsApp automaticamente..."
                        className="w-full min-h-[150px] rounded-xl border-2 border-gray-200 p-5 text-lg shadow-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                        autoFocus
                    />

                    <button
                        type="submit"
                        className="group flex w-full items-center justify-center rounded-xl bg-primary py-4 text-lg font-bold text-white transition-all hover:bg-primary-hover hover:shadow-lg disabled:opacity-50"
                    >
                        {text.length > 0 ? 'Continuar' : 'Pular (Não tenho ideias)'}
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </button>
                </form>

            </div>
        </div>
    );
}
