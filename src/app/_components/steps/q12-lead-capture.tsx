"use client";

import { useState, useEffect } from "react";
import { completeSurvey } from "@/actions/survey";
import { Mail, MessageCircle, CheckCircle2, Loader2, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "react-hot-toast";

interface Q12Props {
  onNext: () => void;
  surveyId: string;
}

export function Q12LeadCapture({ onNext, surveyId }: Q12Props) {
  const [startTime] = useState(Date.now());
  const [wantsBeta, setWantsBeta] = useState(true);
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email && !whatsapp) {
      toast.error("Por favor, forneça pelo menos um método de contato.");
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Por favor, insira um email válido.");
      return;
    }

    setIsSubmitting(true);

    try {
      const endTime = Date.now();
      const timeSpent = (endTime - startTime) / 1000;

      const result = await completeSurvey(
        surveyId,
        timeSpent,
        wantsBeta,
        email || null,
        whatsapp || null
      );

      if (result.success) {
        if (email) {
          if (result.emailSent) {
            toast.success(
              "✉️ Email de confirmação enviado! Verifique sua caixa de entrada.",
              { duration: 5000 }
            );
          } else {
            toast.error(
              "⚠️ Não conseguimos enviar o email de confirmação. Mas sua resposta foi salva!",
              { duration: 5000 }
            );
          }
        } else {
          toast.success("✅ Resposta salva com sucesso!");
        }

        setTimeout(() => {
          onNext();
        }, 1500);
      } else {
        toast.error(result.error || "Erro ao finalizar pesquisa");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao enviar. Tente novamente.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl mx-auto space-y-6 md:space-y-8">
        
        {/* Header */}
        <div className="space-y-2 md:space-y-3 relative pl-8 md:pl-20">
          <div className="flex items-center gap-2 absolute left-0 md:left-8 top-0.5">
            <span className="text-lg md:text-xl font-normal text-gray-900">12</span>
            <ArrowRight className="h-4 w-4 md:h-5 md:w-5 text-gray-900" />
          </div>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 leading-snug">
            O beta está previsto para Janeiro de 2026.
          </h2>
          <p className="text-base md:text-lg text-gray-600">
            Onde devemos te avisar?
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="pl-8 md:pl-20 space-y-6">
          
          {/* Beta Interest Checkbox */}
          <div className="bg-gradient-to-br from-[#F3EBFC] to-[#F8F4FC] rounded-2xl border-2 border-gray-200 p-5 md:p-6 shadow-md">
            <label className="flex items-start gap-4 cursor-pointer group">
              <div className="flex-shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={wantsBeta}
                  onChange={(e) => setWantsBeta(e.target.checked)}
                  className="w-5 h-5 md:w-6 md:h-6 text-[#C2A9F9] bg-white border-2 border-gray-300 rounded focus:ring-2 focus:ring-[#C2A9F9]/20 cursor-pointer"
                />
              </div>
              <div className="flex-1">
                <span className="text-base md:text-lg font-semibold text-gray-900 block mb-1 group-hover:text-gray-700 transition-colors">
                  Quero participar do Beta! 🚀
                </span>
                <span className="text-sm md:text-base text-gray-600">
                  Receba acesso prioritário quando lançarmos em Janeiro de 2026
                </span>
              </div>
            </label>
          </div>

          {/* Email Input */}
          <div className="space-y-3">
            <label htmlFor="email" className="flex items-center gap-2 text-sm md:text-base font-medium text-gray-700">
              <Mail className="w-4 h-4 md:w-5 md:h-5 text-[#B290F7]" />
              Email (recomendado)
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full rounded-2xl border-2 border-gray-200 bg-white p-4 md:p-5 text-sm md:text-base shadow-md outline-none focus:border-[#C2A9F9] focus:ring-2 focus:ring-[#C2A9F9]/20 placeholder:text-gray-400 transition-all"
            />
          </div>

          {/* WhatsApp Input */}
          <div className="space-y-3">
            <label htmlFor="whatsapp" className="flex items-center gap-2 text-sm md:text-base font-medium text-gray-700">
              <MessageCircle className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
              WhatsApp (opcional)
            </label>
            <input
              id="whatsapp"
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="(11) 99999-9999"
              className="w-full rounded-2xl border-2 border-gray-200 bg-white p-4 md:p-5 text-sm md:text-base shadow-md outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 placeholder:text-gray-400 transition-all"
            />
          </div>

          {/* Privacy Notice */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 md:p-5 rounded-2xl text-blue-800 text-xs md:text-sm border-2 border-blue-200 shadow-sm leading-relaxed">
            🔒 Seus dados estão protegidos pela LGPD. Usaremos apenas para entrar em contato sobre o beta do Incode. Você pode cancelar a qualquer momento.
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex text-lg md:text-xl px-3 md:px-3.5 py-1.5 font-bold items-center justify-center gap-2 rounded-full bg-[#C2A9F9] text-white shadow-md transition-all hover:bg-[#B290F7] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-[#C2A9F9]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Finalizar Pesquisa
              </>
            )}
          </button>

          {/* Footer Note */}
          <p className="text-center text-sm md:text-base text-gray-500 pt-2">
            💜 Muito obrigado por ajudar a construir o futuro da automação no Brasil!
          </p>
        </form>

      </div>
    </div>
  );
}
