'use server'

import { db } from '@/db';
import { surveyResponses } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { getRequestInfo } from '@/lib/request-info';

// --- Action 1: Iniciar a Pesquisa (Cria o ID e salva UTMs) ---
// Chamamos isso assim que a página carrega ou o usuário clica em "Começar"
export async function startSurvey(metadata: {
    // Mantemos os UTMs vindo do cliente, pois o servidor não vê a URL completa facilmente em actions
    utmSource?: string | null;
    utmMedium?: string | null;
    utmCampaign?: string | null;
    utmTerm?: string | null;
    utmContent?: string | null;
    referrer?: string | null;
}) {
    try {
        // Coleta dados do servidor (IP, Geo, Device)
        const reqInfo = await getRequestInfo();

        const result = await db.insert(surveyResponses).values({
            status: 'started',
            stepTimings: {},

            // Dados de Marketing (Client-side)
            utmSource: metadata.utmSource,
            utmMedium: metadata.utmMedium,
            utmCampaign: metadata.utmCampaign,
            utmTerm: metadata.utmTerm,
            utmContent: metadata.utmContent,
            referrer: metadata.referrer,

            // Dados Técnicos (Server-side)
            ipAddress: reqInfo.ip,
            country: reqInfo.location.country,
            city: reqInfo.location.city,
            region: reqInfo.location.region,
            deviceType: reqInfo.deviceType,
            browser: reqInfo.browser,
            os: reqInfo.os,
        }).returning({ id: surveyResponses.id });

        return { success: true, id: result[0].id };
    } catch (error) {
        console.error('Erro ao iniciar pesquisa:', error);
        return { success: false, error: 'Falha ao iniciar sessão' };
    }
}

// --- Action 2: Atualizar Passo a Passo (Salva cada resposta) ---
// Chamamos isso toda vez que o usuário clica em "Próximo"
// Isso garante que se ele sair na pergunta 3, sabemos que ele parou na 3.

// Define os campos permitidos para atualização (segurança)
const StepSchema = z.object({
    surveyId: z.string(),
    stepName: z.string(), // ex: 'q1_screening', 'q2_segment'
    timeSpentOnStep: z.number(), // Segundos gastos na tela atual

    // Campos opcionais (pois cada passo envia um dado diferente)
    data: z.object({
        isBusinessOwner: z.boolean().optional(),
        businessSegment: z.string().optional(),
        businessSegmentOther: z.string().optional(),
        weeklyTimeSpent: z.string().optional(),
        painIntensity: z.number().optional(),
        currentSolution: z.string().optional(),
        currentSolutionTool: z.string().optional(),
        usageIntent: z.string().optional(),
        perceivedValue: z.string().optional(),
        willingnessToPay: z.string().optional(),
        magicWandTask: z.string().optional(),
        objectionReason: z.string().optional(),
        wantsBeta: z.boolean().optional(),
        email: z.string().email().optional(),
        whatsapp: z.string().optional(),
    })
});

export async function saveSurveyStep(input: z.infer<typeof StepSchema>) {
    const validation = StepSchema.safeParse(input);

    if (!validation.success) {
        return { success: false, error: 'Dados inválidos' };
    }

    const { surveyId, stepName, timeSpentOnStep, data } = validation.data;

    try {
        // 1. Buscar o registro atual para atualizar o JSON de timings
        const currentRecord = await db
            .select({ stepTimings: surveyResponses.stepTimings })
            .from(surveyResponses)
            .where(eq(surveyResponses.id, surveyId))
            .limit(1);

        if (!currentRecord.length) return { success: false, error: 'Sessão não encontrada' };

        // Atualiza o timing
        const currentTimings = (currentRecord[0].stepTimings as Record<string, number>) || {};
        const newTimings = { ...currentTimings, [stepName]: timeSpentOnStep };

        // 2. Atualizar no Banco
        await db.update(surveyResponses)
            .set({
                ...data, // Espalha os campos recebidos (ex: businessSegment)
                stepTimings: newTimings,
                status: stepName, // Atualiza onde o usuário está
                updatedAt: new Date(),
            })
            .where(eq(surveyResponses.id, surveyId));

        return { success: true };

    } catch (error) {
        console.error(`Erro ao salvar passo ${stepName}:`, error);
        return { success: false, error: 'Erro ao salvar progresso' };
    }
}
