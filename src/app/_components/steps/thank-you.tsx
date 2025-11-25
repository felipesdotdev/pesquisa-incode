'use client'

import { Heart } from 'lucide-react';

export function ThankYou() {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-[#FAF7EF] px-4 py-8">
            <div className="w-full max-w-2xl mx-auto text-center space-y-6 md:space-y-8 animate-in fade-in duration-1000">

                {/* Ícone principal */}
                <div className="flex justify-center mb-8">
                    <div className="flex h-24 w-24 md:h-32 md:w-32 items-center justify-center rounded-full bg-gradient-to-br from-[#E5DAFB] to-[#F0E8FC] shadow-lg">
                        <Heart className="h-12 w-12 md:h-16 md:w-16 text-[#C2A9F9] animate-pulse" fill="#C2A9F9" />
                    </div>
                </div>

                {/* Título */}
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-snug">
                    Obrigado!
                </h1>

                {/* Texto principal */}
                <p className="text-base md:text-xl text-gray-700 max-w-lg mx-auto leading-relaxed">
                    Sua resposta foi salva com sucesso. Você está ajudando a construir o <span className="font-semibold text-[#B290F7]">futuro da automação no Brasil</span>.
                </p>

                {/* Emoji de celebração */}
                <div className="text-4xl md:text-5xl animate-bounce pt-4">
                    🎉
                </div>

                {/* Marca d'água */}
                <div className="pt-12 text-xs md:text-sm text-gray-400">
                    Pesquisa Incode © 2025
                </div>

            </div>
        </div>
    );
}
