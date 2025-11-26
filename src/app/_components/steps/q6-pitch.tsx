'use client'

import { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, Sparkles, MessageCircle, Zap, Database, MousePointer2, GitBranch } from 'lucide-react';

interface Q6Props {
    onNext: (timeSpent: number) => void;
}

export function Q6Pitch({ onNext }: Q6Props) {
    const [startTime] = useState(Date.now());
    const [step, setStep] = useState(0);

    const handleNext = () => {
        const endTime = Date.now();
        onNext((endTime - startTime) / 1000);
    };

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                const endTime = Date.now();
                onNext((endTime - startTime) / 1000);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [onNext, startTime]);

    // Complex Animation Sequence
    useEffect(() => {
        const sequence = [
            { t: 500, s: 1 },  // User message
            { t: 1500, s: 2 }, // Thinking
            { t: 3000, s: 3 }, // Result appears
            { t: 4200, s: 4 }, // Cursor enters
            { t: 5000, s: 5 }, // Cursor clicks
            { t: 5300, s: 6 }, // Transition to Nodes (Zoom in)
        ];

        const timers = sequence.map(({ t, s }) => setTimeout(() => setStep(s), t));
        return () => timers.forEach(clearTimeout);
    }, []);

    // Determina a cor da barra de status baseada no fundo da cena atual
    // Cena 6 (Nodes) é escura (#111111), então texto branco. As anteriores são claras, texto preto.
    const isDarkMode = step >= 6;
    const statusColor = isDarkMode ? 'text-white' : 'text-black';

    return (
        <div className="flex min-h-screen w-full items-center justify-center px-4 py-8 overflow-hidden">
            <style jsx global>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes pulse-ring {
                    0% { transform: scale(0.8); opacity: 0.5; }
                    100% { transform: scale(1.3); opacity: 0; }
                }
                @keyframes dash {
                    to { stroke-dashoffset: -1000; }
                }
                @keyframes typing {
                    0%, 100% { transform: translateY(0px); opacity: 0.5; }
                    50% { transform: translateY(-3px); opacity: 1; }
                }
                .apple-ease { transition-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1.0); }
                .animate-float { animation: float 6s ease-in-out infinite; }
                .animate-pulse-ring { animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite; }
                .connection-line {
                    stroke-dasharray: 10;
                    animation: dash 20s linear infinite;
                }
            `}</style>

            <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* Left: Copy */}
                <div className="space-y-8 pl-4 md:pl-12 order-2 lg:order-1">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-gray-400 mb-2">
                            <span className="text-lg font-medium">06</span>
                            <ArrowRight className="h-4 w-4" />
                        </div>

                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight tracking-tight">
                            De conversa para <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B290F7] to-[#916bf3]">fluxo complexo</span>.
                        </h2>
                        <p className="text-lg text-gray-600 leading-relaxed max-w-md">
                            O Incode traduz suas palavras em arquiteturas de automação robustas, conectando apps e dados instantaneamente.
                        </p>
                    </div>

                    <ul className="space-y-4">
                        {[
                            'Visualização em tempo real',
                            'Edição visual intuitiva',
                            'Conexão com +5000 apps',
                            'Escalabilidade infinita'
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-gray-700 group">
                                <div className="h-6 w-6 rounded-full bg-[#E5DAFB] flex items-center justify-center group-hover:scale-110 transition-transform duration-300 apple-ease">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-[#8B5CF6]" />
                                </div>
                                <span className="font-medium">{item}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="pt-4">
                        <button
                            onClick={handleNext}
                            className="group relative inline-flex items-center gap-2 px-8 py-4 bg-[#1a1a1a] text-white rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 apple-ease overflow-hidden"
                        >
                            <span className="relative z-10">Continuar</span>
                            <ArrowRight className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#333] to-[#000] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </button>
                    </div>
                </div>

                {/* Right: Dynamic Mockup */}
                <div className="flex justify-center lg:justify-end order-1 lg:order-2 perspective-1000">
                    <div className="relative w-[320px] h-auto aspect-[543/1106] animate-float">

                        {/* Content Area */}
                        <div
                            className="absolute bg-white overflow-hidden"
                            style={{
                                top: '2.2%',
                                left: '5.1%',
                                width: '89.9%',
                                height: '95.6%',
                                borderRadius: '32px'
                            }}
                        >
                            {/* 
                                STATUS BAR (IOS STYLE) 
                                Transparente + Transição de cor suave (Motion Apple)
                            */}
                            <div
                                className={`absolute -top-4 w-full h-[54px] z-50 flex items-end justify-between px-6 pb-2 transition-colors duration-700 apple-ease ${statusColor}`}
                            >
                                {/* Left: Time */}
                                <span className="text-[15px] font-semibold tracking-wide leading-none ml-2 select-none">
                                    {new Date().toLocaleTimeString('pt-BR', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>

                                {/* Right: Native Icons Group */}
                                <div className="flex items-center gap-[7px] -mr-2">

                                    {/* Cellular Signal (Bars) */}
                                    <svg width="17" height="11" viewBox="0 0 17 11" className="fill-current">
                                        <path d="M1 7.5C1 7.22386 1.22386 7 1.5 7H2.5C2.77614 7 3 7.22386 3 7.5V10.5C3 10.7761 2.77614 11 2.5 11H1.5C1.22386 11 1 10.7761 1 10.5V7.5Z" />
                                        <path d="M5 5.5C5 5.22386 5.22386 5 5.5 5H6.5C6.77614 5 7 5.22386 7 5.5V10.5C7 10.7761 6.77614 11 6.5 11H5.5C5.22386 11 5 10.7761 5 10.5V5.5Z" />
                                        <path d="M9 3.5C9 3.22386 9.22386 3 9.5 3H10.5C10.7761 3 11 3.22386 11 3.5V10.5C11 10.7761 10.7761 11 10.5 11H9.5C9.22386 11 9 10.7761 9 10.5V3.5Z" />
                                        <path d="M13 1.5C13 1.22386 13.2239 1 13.5 1H14.5C14.7761 1 15 1.22386 15 1.5V10.5C15 10.7761 14.7761 11 14.5 11H13.5C13.2239 11 13 10.7761 13 10.5V1.5Z" />
                                    </svg>

                                    {/* WiFi */}
                                    <svg width="15" height="11" viewBox="0 0 15 11" className="fill-current">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M7.5 8.329C8.089 8.329 8.633 8.475 9.116 8.734C9.263 8.813 9.447 8.784 9.564 8.663L10.271 7.931C10.382 7.816 10.384 7.636 10.266 7.524C9.491 6.791 8.514 6.375 7.493 6.375C6.472 6.375 5.495 6.791 4.72 7.524C4.602 7.636 4.604 7.816 4.715 7.931L5.422 8.663C5.539 8.784 5.723 8.813 5.87 8.734C6.353 8.475 6.897 8.329 7.5 8.329ZM7.5 4.531C9.429 4.531 11.178 5.307 12.427 6.556C12.552 6.681 12.55 6.882 12.422 7.005L11.744 7.655C11.621 7.772 11.427 7.776 11.3 7.66C10.306 6.749 8.973 6.215 7.497 6.215C6.02 6.215 4.688 6.749 3.694 7.66C3.566 7.776 3.373 7.772 3.25 7.655L2.572 7.005C2.444 6.882 2.442 6.681 2.567 6.556C3.816 5.307 5.565 4.531 7.5 4.531ZM7.5 10.781C7.885 10.781 8.208 10.519 8.293 10.165C8.309 10.102 8.316 10.035 8.316 9.966C8.316 9.514 7.951 9.147 7.5 9.147C7.049 9.147 6.683 9.514 6.683 9.966C6.683 10.035 6.691 10.102 6.706 10.165C6.791 10.519 7.114 10.781 7.5 10.781ZM14.642 4.41C12.781 2.51 10.256 1.367 7.497 1.367C4.738 1.367 2.213 2.51 0.352 4.41C0.226 4.538 0.227 4.744 0.355 4.871L1.067 5.579C1.188 5.7 1.382 5.704 1.509 5.584C3.069 4.097 5.185 3.203 7.497 3.203C9.809 3.203 11.925 4.097 13.485 5.584C13.611 5.704 13.805 5.7 13.927 5.579L14.639 4.871C14.766 4.744 14.768 4.538 14.642 4.41Z" />
                                    </svg>

                                    {/* Battery */}
                                    <div className="relative w-[22px] h-[11px] border-[1px] border-current rounded-[3px] ml-1 p-[1px]">
                                        <div className="w-full h-full bg-current rounded-[1px]" />
                                        <div className="absolute -right-[2.5px] top-1/2 -translate-y-1/2 h-[3px] w-[1.5px] bg-current rounded-r-[1px]" />
                                    </div>

                                </div>
                            </div>

                            {/* SCENE 1: CHAT INTERFACE */}
                            <div
                                className={`absolute inset-0 bg-[#F5F5F7] pt-24 px-4 transition-all duration-700 apple-ease origin-center
                                ${step >= 6 ? 'scale-150 opacity-0 blur-sm' : 'scale-100 opacity-100 blur-0'}`}
                            >
                                {/* Chat Messages */}
                                <div className="space-y-6">
                                    <div className={`flex justify-end transition-all duration-700 apple-ease ${step >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                                        <div className="bg-[#2D2D2D] text-white px-5 py-3.5 rounded-2xl rounded-tr-sm shadow-sm max-w-[85%] text-[15px] leading-snug">
                                            Crie um fluxo que salva leads do WhatsApp no Notion.
                                        </div>
                                    </div>

                                    <div className={`flex justify-start transition-all duration-500 apple-ease ${step === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 absolute pointer-events-none'}`}>
                                        <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 flex gap-1.5 items-center">
                                            <div className="w-1.5 h-1.5 bg-[#B290F7] rounded-full animate-[typing_1s_infinite_0ms]" />
                                            <div className="w-1.5 h-1.5 bg-[#B290F7] rounded-full animate-[typing_1s_infinite_200ms]" />
                                            <div className="w-1.5 h-1.5 bg-[#B290F7] rounded-full animate-[typing_1s_infinite_400ms]" />
                                        </div>
                                    </div>

                                    <div className={`flex justify-start transition-all duration-700 apple-ease ${step >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                                        <div className="bg-white p-4 rounded-2xl rounded-tl-sm shadow-lg border border-gray-100 w-[95%] space-y-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Sparkles className="h-4 w-4 text-[#B290F7]" />
                                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Incode AI</span>
                                            </div>
                                            <p className="text-gray-800 text-sm font-medium">
                                                Fluxo criado! Conectei o WhatsApp API ao banco de dados do Notion.
                                            </p>
                                            <button className="w-full mt-2 bg-[#FAF9FE] hover:bg-[#F0EBFD] border border-[#F0EBFD] rounded-xl p-3 flex items-center justify-between group transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-[#8B5CF6]">
                                                        <GitBranch className="h-4 w-4" />
                                                    </div>
                                                    <div className="text-left">
                                                        <div className="text-xs font-semibold text-gray-900">Ver Fluxo</div>
                                                        <div className="text-[10px] text-gray-500">3 integrações</div>
                                                    </div>
                                                </div>
                                                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-[#8B5CF6] transition-colors" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* SCENE 2: NODES INTERFACE */}
                            <div
                                className={`absolute inset-0 bg-[#111111] flex items-center justify-center transition-all duration-1000 apple-ease
                                ${step >= 6 ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}
                            >
                                {/* Background Grid */}
                                <div className="absolute inset-0 opacity-20"
                                    style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                                />

                                {/* Connecting Lines (SVG) */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                                    <path d="M145 150 L145 230" stroke="#333" strokeWidth="2" fill="none" />
                                    <path d="M145 290 L145 370" stroke="#333" strokeWidth="2" fill="none" />
                                    {/* Animated Pulse Line */}
                                    <path d="M145 150 L145 230" stroke="#8B5CF6" strokeWidth="2" fill="none" strokeDasharray="4 4" className="connection-line opacity-60" />
                                    <path d="M145 290 L145 370" stroke="#8B5CF6" strokeWidth="2" fill="none" strokeDasharray="4 4" className="connection-line opacity-60" />
                                </svg>

                                {/* Nodes Container */}
                                <div className="relative z-10 flex flex-col items-center gap-8 w-full px-5">

                                    {/* Node 1: Trigger */}
                                    <div className={`relative bg-[#1E1E1E] p-3 rounded-2xl border border-[#333] w-full shadow-2xl transition-all duration-700 delay-100 ${step >= 6 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400">
                                                <MessageCircle className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <div className="text-[10px] text-green-400 font-bold uppercase tracking-wider mb-0.5">Trigger</div>
                                                <div className="text-xs font-semibold text-white">Nova Mensagem</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Node 2: Logic */}
                                    <div className={`relative bg-[#1E1E1E] p-3 rounded-2xl border border-[#333] w-full shadow-2xl transition-all duration-700 delay-300 ${step >= 6 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                                        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-5 h-5 bg-[#1E1E1E] border border-[#333] rounded-full flex items-center justify-center z-20">
                                            <Zap className="h-2.5 w-2.5 text-yellow-400" />
                                        </div>
                                        <div className="flex items-center gap-3 pl-2">
                                            <div className="h-8 w-8 rounded-xl bg-yellow-500/20 flex items-center justify-center text-yellow-400">
                                                <Sparkles className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <div className="text-[10px] text-yellow-400 font-bold uppercase tracking-wider mb-0.5">AI Agent</div>
                                                <div className="text-xs font-semibold text-white">Extrair Dados</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Node 3: Action */}
                                    <div className={`relative bg-[#1E1E1E] p-3 rounded-2xl border border-[#333] w-full shadow-2xl transition-all duration-700 delay-500 ${step >= 6 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                                                <Database className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <div className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mb-0.5">Action</div>
                                                <div className="text-xs font-semibold text-white">Salvar Lead</div>
                                            </div>
                                        </div>
                                        {/* Success Badge */}
                                        <div className="absolute -right-1 -top-1 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-lg animate-bounce">
                                            200 OK
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* CURSOR ANIMATION */}
                            <div
                                className="absolute z-40 pointer-events-none transition-all duration-700 apple-ease"
                                style={{
                                    top: step >= 4 ? (step >= 5 ? '56%' : '56%') : '110%',
                                    left: step >= 4 ? (step >= 5 ? '50%' : '50%') : '80%',
                                    opacity: step >= 6 ? 0 : 1,
                                    transform: step === 5 ? 'scale(0.9)' : 'scale(1)'
                                }}
                            >
                                <MousePointer2 className="h-8 w-8 text-black fill-black drop-shadow-xl" />
                                {step === 5 && (
                                    <div className="absolute -top-4 -left-4 w-16 h-16 bg-gray-400/30 rounded-full animate-pulse-ring" />
                                )}
                            </div>

                            {/* Home Indicator */}
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-300/50 rounded-full z-40" />
                        </div>

                        {/* Phone Frame Image */}
                        <img
                            src="https://library.shadcnblocks.com/images/block/mockups/phone-5.png"
                            alt="Phone Mockup"
                            className="absolute inset-0 w-full h-full z-50 pointer-events-none select-none"
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}
