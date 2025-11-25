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
            <div className="flex min-h-screen w-full items-center justify-center bg-[#FAF7EF] px-4 py-8">
                <div className="w-full max-w-3xl mx-auto space-y-6 md:space-y-8">

                    <div className="space-y-2 md:space-y-3 relative pl-8 md:pl-20">
                        <div className="flex items-center gap-2 absolute left-0 md:left-8 top-0.5">
                            <span className="text-lg md:text-xl font-normal text-gray-900">12</span>
                            <ArrowRight className="h-4 w-4 md:h-5 md:w-5 text-gray-900" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 leading-snug">
                            🎉 Quer testar o Incode GRÁTIS quando lançarmos?
                        </h2>
                        <p className="text-sm md:text-base text-gray-600">
                            O beta está previsto para Dezembro de 2025.
                        </p>
                    </div>

                    <div className="pl-8 md:pl-20 flex flex-col gap-3">
                        <button
                            onClick={() => setWantsToJoin(true)}
                            className="w-full rounded-2xl bg-[#C2A9F9] py-4 md:py-5 text-base md:text-lg font-bold text-white shadow-lg hover:bg-[#B290F7] hover:scale-[1.02] transition-all"
                        >
                            Sim! Me avise do lançamento 🚀
                        </button>
                        <button
                            onClick={() => onFinish(null, null, 0)}
                            className="w-full rounded-2xl bg-gray-200 py-4 md:py-5 text-sm md:text-base font-semibold text-gray-600 hover:bg-gray-300 transition-all"
                        >
                            Não, obrigado. Apenas finalize.
                        </button>
                    </div>

                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-[#FAF7EF] px-4 py-8">
            <div className="w-full max-w-3xl mx-auto space-y-6 md:space-y-8">

                <div className="space-y-2 md:space-y-3 relative pl-8 md:pl-20">
                    <div className="flex items-center gap-2 absolute left-0 md:left-8 top-0.5">
                        <span className="text-lg md:text-xl font-normal text-gray-900">12</span>
                        <ArrowRight className="h-4 w-4 md:h-5 md:w-5 text-gray-900" />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full bg-green-100 flex-shrink-0">
                            <CheckCircle className="h-6 w-6 md:h-7 md:w-7 text-green-600" />
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Excelente!</h2>
                            <p className="text-sm md:text-base text-gray-600">Onde devemos te avisar?</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="pl-8 md:pl-20 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 ml-1">Seu melhor e-mail</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#C2A9F9] transition-colors">
                                <Mail className="h-5 w-5" />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="nome@empresa.com"
                                className="w-full rounded-2xl border-2 border-gray-200 pl-12 pr-4 py-4 text-base outline-none transition-all focus:border-[#C2A9F9] focus:ring-4 focus:ring-[#C2A9F9]/10 shadow-sm placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 ml-1">WhatsApp (Opcional)</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#C2A9F9] transition-colors">
                                <Phone className="h-5 w-5" />
                            </div>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="(11) 99999-9999"
                                className="w-full rounded-2xl border-2 border-gray-200 pl-12 pr-4 py-4 text-base outline-none transition-all focus:border-[#C2A9F9] focus:ring-4 focus:ring-[#C2A9F9]/10 shadow-sm placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="mt-6 flex text-lg md:text-xl px-3 md:px-3.5 py-1.5 font-bold items-center justify-center rounded-full bg-[#C2A9F9] text-white shadow-md transition-all hover:bg-[#B290F7] hover:shadow-lg active:scale-[0.98]"
                    >
                        OK
                    </button>
                </form>

            </div>
        </div>
    );
}
