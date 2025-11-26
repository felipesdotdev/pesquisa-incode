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
        <div className="flex min-h-screen w-full items-center justify-center px-4 py-8">
            <div className="w-full max-w-3xl mx-auto space-y-6 md:space-y-8">

                <div className="space-y-2 md:space-y-3 relative pl-8 md:pl-20">
                    <div className="flex items-center gap-2 absolute left-0 md:left-8 top-0.5">
                        <span className="text-lg md:text-xl font-normal text-gray-900">10</span>
                        <ArrowRight className="h-4 w-4 md:h-5 md:w-5 text-gray-900" />
                    </div>
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 leading-snug">
                            Se você tivesse uma 'varinha mágica' para automatizar UMA tarefa chata do seu dia, qual seria?
                        </h2>
                        <Sparkles className="h-6 w-6 md:h-8 md:w-8 text-yellow-400 animate-pulse flex-shrink-0" />
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="pl-8 md:pl-20 space-y-4">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
                                e.preventDefault();
                                handleSubmit(e as any);
                            }
                        }}
                        placeholder="Ex: Confirmar agendamentos no WhatsApp automaticamente..."
                        className="w-full min-h-[150px] md:min-h-[180px] rounded-2xl border-2 border-gray-200 bg-white p-4 md:p-5 text-sm md:text-base shadow-md outline-none transition-all focus:border-[#C2A9F9] focus:ring-2 focus:ring-[#C2A9F9]/20 resize-none placeholder:text-gray-400"
                        autoFocus
                    />

                    <button
                        type="submit"
                        className="flex text-lg md:text-xl px-3 md:px-3.5 py-1.5 font-bold items-center justify-center rounded-full bg-[#C2A9F9] text-white shadow-md transition-all hover:bg-[#B290F7] hover:shadow-lg active:scale-[0.98]"
                    >
                        {text.length > 0 ? 'OK' : 'Pular'}
                    </button>
                </form>

            </div>
        </div>
    );
}
