// src/app/_components/steps/q12-lead-capture.tsx
'use client'

import { useState } from 'react';
import { Mail, Phone, CheckCircle, ArrowRight } from 'lucide-react';

interface Q12Props {
    onFinish: (email: string | null, phone: string | null, timeSpent: number) => void;
}

export function Q12LeadCapture({ onFinish }: Q12Props) {
    const [startTime] = useState(Date.now());
    const [wantsToJoin, setWantsToJoin] = useState<boolean | null>(null);
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const endTime = Date.now();
        onFinish(email || null, phone || null, (endTime - startTime) / 1000);
    };

    if (wantsToJoin === null) {
        return (
            <div className="flex min-h-screen w-full items-center justify-center px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="w-full max-w-lg space-y-8 text-center">
                    <h2 className="text-4xl font-bold text-gray-900">🎉 Quer testar o Incode GRÁTIS quando lançarmos?</h2>
                    <p className="text-lg text-gray-600">O beta está previsto para Dezembro de 2025.</p>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => setWantsToJoin(true)}
                            className="w-full rounded-xl bg-primary py-4 text-lg font-bold text-white shadow-lg hover:bg-primary-hover hover:scale-105 transition-all"
                        >
                            Sim! Me avise do lançamento 🚀
                        </button>
                        <button
                            onClick={() => onFinish(null, null, 0)}
                            className="w-full rounded-xl bg-gray-100 py-4 text-gray-500 hover:bg-gray-200 transition-all"
                        >
                            Não, obrigado. Apenas finalize.
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen w-full items-center justify-center px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-2">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
                        <CheckCircle className="h-8 w-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Excelente!</h2>
                    <p className="text-gray-500">Onde devemos te avisar?</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 ml-1">Seu melhor e-mail</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="nome@empresa.com"
                                className="w-full rounded-xl border-2 border-gray-200 pl-12 p-3 text-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 ml-1">WhatsApp (Opcional)</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="(11) 99999-9999"
                                className="w-full rounded-xl border-2 border-gray-200 pl-12 p-3 text-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="mt-6 w-full rounded-xl bg-black py-4 text-lg font-bold text-white shadow-lg hover:bg-gray-800 hover:scale-[1.02] transition-all"
                    >
                        Finalizar Cadastro
                    </button>
                </form>
            </div>
        </div>
    );
}
