// src/app/_components/steps/q2-segment.tsx
'use client'

import { useState, useRef, useEffect } from 'react';
import { ArrowRight, Stethoscope, Scissors, ShoppingCart, Briefcase, Truck, Megaphone, Utensils, Plus } from 'lucide-react';

interface Q2Props {
    onNext: (segment: string, otherDetails: string | null, timeSpent: number) => void;
}

export function Q2Segment({ onNext }: Q2Props) {
    const [startTime] = useState(Date.now());
    const [selectedOther, setSelectedOther] = useState(false);
    const [otherText, setOtherText] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    // Foca no input se "Outro" for selecionado
    useEffect(() => {
        if (selectedOther && inputRef.current) {
            inputRef.current.focus();
        }
    }, [selectedOther]);

    const handleSelect = (optionId: string) => {
        if (optionId === 'other') {
            setSelectedOther(true);
            return;
        }
        submit(optionId, null);
    };

    const handleOtherSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (otherText.trim()) {
            submit('other', otherText);
        }
    };

    const submit = (segment: string, other: string | null) => {
        const endTime = Date.now();
        const timeSpent = (endTime - startTime) / 1000;
        onNext(segment, other, timeSpent);
    };

    const options = [
        { id: 'health', label: 'Saúde', desc: 'Clínicas, consultórios, psicólogos', icon: Stethoscope },
        { id: 'beauty', label: 'Beleza', desc: 'Salões, estéticas, barbearias', icon: Scissors },
        { id: 'retail', label: 'Comércio/Varejo', desc: 'Lojas físicas ou online', icon: ShoppingCart },
        { id: 'services', label: 'Serviços', desc: 'Consultoria, advocacia, contabilidade', icon: Briefcase },
        { id: 'logistics', label: 'Logística', desc: 'Entregas, transporte', icon: Truck },
        { id: 'marketing', label: 'Marketing', desc: 'Agências, freelancers', icon: Megaphone },
        { id: 'food', label: 'Alimentação', desc: 'Restaurantes, cafés, delivery', icon: Utensils },
        { id: 'other', label: 'Outro', desc: 'Qualquer outro segmento', icon: Plus },
    ];

    return (
        <div className="flex min-h-screen w-full items-center justify-center px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="w-full max-w-2xl space-y-8">

                <div className="space-y-2 text-center">
                    <span className="text-sm font-medium text-primary uppercase tracking-wider">Pergunta 2 de 12</span>
                    <h2 className="text-3xl font-bold text-gray-900">Qual o segmento do seu negócio?</h2>
                </div>

                {!selectedOther ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {options.map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => handleSelect(opt.id)}
                                className="group flex flex-col items-start justify-start rounded-xl border-2 border-gray-100 bg-white p-5 text-left transition-all hover:border-primary hover:shadow-lg active:scale-95"
                            >
                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-500 transition-colors group-hover:bg-purple-50 group-hover:text-primary">
                                    <opt.icon className="h-5 w-5" />
                                </div>
                                <span className="text-lg font-semibold text-gray-900">{opt.label}</span>
                                <span className="text-sm text-gray-500">{opt.desc}</span>
                            </button>
                        ))}
                    </div>
                ) : (
                    <form onSubmit={handleOtherSubmit} className="space-y-4">
                        <div className="relative">
                            <input
                                ref={inputRef}
                                type="text"
                                value={otherText}
                                onChange={(e) => setOtherText(e.target.value)}
                                placeholder="Digite qual é o seu segmento..."
                                className="w-full rounded-xl border-2 border-primary p-6 text-lg shadow-lg outline-none placeholder:text-gray-400"
                                autoFocus
                            />
                            <button
                                type="submit"
                                disabled={!otherText.trim()}
                                className="absolute right-3 top-3 bottom-3 rounded-lg bg-primary px-6 font-medium text-white transition-opacity hover:bg-primary-hover disabled:opacity-50"
                            >
                                Continuar
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={() => setSelectedOther(false)}
                            className="text-sm text-gray-500 hover:underline w-full text-center"
                        >
                            Voltar para opções
                        </button>
                    </form>
                )}

            </div>
        </div>
    );
}
