// src/app/_components/steps/thank-you.tsx
import { Heart } from 'lucide-react';

export function ThankYou() {
    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-primary text-white px-4 text-center animate-in fade-in duration-1000">
            <Heart className="h-20 w-20 text-white animate-pulse mb-6" />
            <h1 className="text-5xl font-bold mb-4">Obrigado!</h1>
            <p className="text-xl max-w-lg opacity-90">
                Sua resposta foi salva com sucesso. Você está ajudando a construir o futuro da automação no Brasil.
            </p>
            <div className="mt-12 text-sm opacity-60">
                Pesquisa Incode © 2025
            </div>
        </div>
    );
}
