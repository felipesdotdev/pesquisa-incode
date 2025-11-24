'use client'

interface HeroProps {
    onStart: () => void;
    isLoading: boolean;
}

export function Hero({ onStart, isLoading }: HeroProps) {
    return (
        <div className="flex min-h-screen w-full flex-col lg:flex-row bg-[#FDFBF7] overflow-hidden">
            {/* Ajustei o BG para um creme bem suave igual da imagem */}

            {/* LADO ESQUERDO: Conteúdo */}
            <div className="flex w-full flex-col justify-center px-8 lg:w-[45%] lg:pl-32 lg:pr-12 py-12 lg:py-0 z-10">
                <div className="max-w-lg space-y-8">

                    {/* Título e Subtítulo */}
                    <div className="space-y-5">
                        <h1 className="text-[42px] leading-[1.05] font-bold text-[#1A1A1A] lg:text-[52px] tracking-tight">
                            Ajude a construir o futuro da <span className="text-[#C09AE4]">automação</span>
                            {/* Na imagem "analytics" é cinza/preto, mas mantive o destaque se quiser, ou pode deixar tudo preto para ficar igual a ref clean */}
                        </h1>
                        <p className="text-lg font-normal text-gray-500 leading-relaxed max-w-md">
                            Sua opinião vai moldar nossa nova IA de atendimento e processos para pequenos negócios.
                        </p>
                    </div>

                    {/* Botão e Ação - IDÊNTICO À IMAGEM */}
                    <div className="flex flex-row items-center gap-4 pt-2">
                        <button
                            onClick={onStart}
                            disabled={isLoading}
                            className="group relative flex items-center justify-center rounded-full bg-[#C09AE4] px-4 py-2 text-2xl font-bold text-white transition-all hover:bg-[#b38bd6] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
                        >
                            <span className="z-10">{isLoading ? 'Iniciando...' : 'Começar agora'}</span>
                        </button>

                        <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-gray-400">
                            <span>press</span>
                            <span className="font-bold text-gray-800">Enter ↵</span>
                        </div>
                    </div>

                    {/* Removi o relógio "Leva 1 minuto" pois não consta na imagem clean enviada */}

                </div>
            </div>

            {/* LADO DIREITO: Visual (Mantendo sua estrutura de Aurora/Mockup mas ajustando posição) */}
            <div className="relative flex w-full items-center justify-center lg:w-[55%] lg:h-screen">

                {/* Background Aurora Ajustado */}
                <div className="absolute inset-0 bg-gradient-to-bl from-[#EBD8F7] via-[#FBF7EA] to-[#FDFBF7] opacity-80" />
                <div className="absolute right-0 top-0 w-3/4 h-3/4 bg-gradient-to-b from-[#E4C6FA] to-transparent opacity-40 blur-3xl rounded-full mix-blend-multiply" />

                {/* Container do Mockup */}
                <div className="relative z-10 transform scale-90 lg:translate-x-12 transition-transform duration-500">

                    {/* CELULAR - Mantido seu código original interno pois já está bom, apenas ajustei a "casca" para preto fosco se precisar */}
                    <div className="relative mx-auto h-[680px] w-[340px] rounded-[55px] border-[14px] border-[#121212] bg-white shadow-2xl overflow-hidden">

                        {/* Notch */}
                        <div className="absolute top-0 left-0 right-0 h-8 bg-white z-20 flex justify-center">
                            <div className="h-6 w-32 bg-[#121212] rounded-b-3xl" />
                        </div>

                        {/* Conteúdo da Tela (Seu código original mantido aqui dentro) */}
                        <div className="h-full w-full bg-[#FAFAFA] pt-16 px-6 flex flex-col gap-6">
                            <div className="space-y-1">
                                <h3 className="text-3xl font-bold text-gray-900 tracking-tight">Seu assistente</h3>
                                <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                                    <span className="whitespace-nowrap px-4 py-1.5 rounded-full bg-white border border-gray-100 text-xs font-medium text-gray-600 shadow-sm">Hoje</span>
                                    <span className="whitespace-nowrap px-4 py-1.5 rounded-full bg-[#FDE047] border border-yellow-200 text-xs font-bold text-yellow-900 shadow-sm">Pendentes</span>
                                </div>
                            </div>

                            {/* Card Interno 1: Agendamentos */}
                            <div className="rounded-3xl bg-white p-6 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)] border border-gray-100">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-base font-medium text-gray-500">Agendamentos</span>
                                    <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">↗</div>
                                </div>
                                <span className="text-4xl font-bold text-gray-900 tracking-tight">12</span>
                                <div className="mt-4 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                                    <div className="h-full w-2/3 bg-purple-500 rounded-full"></div>
                                </div>
                            </div>

                            {/* Card Interno 2: Mensagens */}
                            <div className="rounded-3xl bg-white p-6 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)] border border-gray-100">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-base font-medium text-gray-500">Mensagens</span>
                                    <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">↗</div>
                                </div>
                                <span className="text-4xl font-bold text-gray-900 tracking-tight">48</span>
                            </div>
                        </div>
                    </div>

                    {/* CARDS FLUTUANTES (Mantidos e ajustados para parecerem "popups" limpos) */}
                    <div className="absolute top-[40%] -left-28 animate-float bg-white p-4 rounded-2xl shadow-lg z-20 hidden lg:block">
                        <div className="flex items-center gap-3">
                            <span className="font-semibold text-gray-900">Receita</span>
                            <span className="rounded-full bg-[#E8E098] px-3 py-1 text-sm font-bold text-gray-900">+85%</span>
                        </div>
                    </div>

                    <div className="absolute bottom-[25%] -right-8 animate-float-delayed bg-white p-4 rounded-2xl shadow-lg z-20 hidden lg:block">
                        <div className="flex items-center gap-3">
                            <span className="font-semibold text-gray-900">Visualizações</span>
                            <span className="rounded-full bg-[#E8E098] px-3 py-1 text-sm font-bold text-gray-900">+125%</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
