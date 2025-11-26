"use server";

import { db } from "@/db";
import { surveyResponses, referenceSources } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getRequestInfo } from "@/lib/request-info";
import { sendEmail, getConfirmationEmailHTML } from "@/lib/email";
import { createReferenceSource } from "./admin";

// ============================================================
// SCHEMAS DE VALIDAÇÃO ZOD
// ============================================================

const startSurveySchema = z.object({
  visitorId: z.string().nullable().optional(),
  utmSource: z.string().nullable().optional(),
  utmMedium: z.string().nullable().optional(),
  utmCampaign: z.string().nullable().optional(),
  utmTerm: z.string().nullable().optional(),
  utmContent: z.string().nullable().optional(),
  referrer: z.string().nullable().optional(),
});

const saveSurveyStepSchema = z.object({
  responseId: z.string().uuid(),
  stepName: z.string(),
  timeSpentOnStep: z.number().min(0),
  data: z.record(z.any()),
});

const completeSurveySchema = z.object({
  responseId: z.string().uuid(),
  totalDuration: z.number().min(0),
  wantsBeta: z.boolean(),
  email: z.string().email().nullable().optional(),
  whatsapp: z.string().nullable().optional(),
});

// ============================================================
// ACTION 1: Iniciar a Pesquisa (Cria o ID e salva UTMs)
// ============================================================

export async function startSurvey(metadata: unknown) {
  try {
    // Validar entrada
    const validatedData = startSurveySchema.parse(metadata);

    // Coleta dados do servidor (IP, Geo, Device)
    const reqInfo = await getRequestInfo();

    const result = await db
      .insert(surveyResponses)
      .values({
        status: "started",
        stepTimings: {},
        visitorId: validatedData.visitorId,

        // Dados de Marketing (Client-side)
        utmSource: validatedData.utmSource,
        utmMedium: validatedData.utmMedium,
        utmCampaign: validatedData.utmCampaign,
        utmTerm: validatedData.utmTerm,
        utmContent: validatedData.utmContent,
        referrer: validatedData.referrer,

        // Dados do Servidor (IP, Device, Geo)
        deviceType: reqInfo.deviceType,
        browser: reqInfo.browser,
        os: reqInfo.os,
        ipAddress: reqInfo.ip,
        country: reqInfo.location.country,
        city: reqInfo.location.city,
        region: reqInfo.location.region,
      })
      .returning({ id: surveyResponses.id });

    return { success: true, id: result[0].id };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Erro de validação:", error.errors);
      return { success: false, error: "Dados inválidos fornecidos." };
    }
    console.error("Erro ao iniciar pesquisa:", error);
    return { success: false, error: "Falha ao iniciar pesquisa." };
  }
}

// ============================================================
// ACTION 2: Salvar uma Etapa da Pesquisa
// ============================================================

export async function saveSurveyStep(
  responseId: string,
  stepName: string,
  timeSpentOnStep: number,
  data: Record<string, any>
) {
  try {
    // Validar entrada
    saveSurveyStepSchema.parse({
      responseId,
      stepName,
      timeSpentOnStep,
      data,
    });

    // Buscar resposta existente
    const existingResponse = await db
      .select()
      .from(surveyResponses)
      .where(eq(surveyResponses.id, responseId))
      .limit(1);

    if (existingResponse.length === 0) {
      return { success: false, error: "Resposta não encontrada." };
    }

    const currentTimings = (existingResponse[0].stepTimings as Record<
      string,
      number
    >) || {};

    // Atualizar resposta com novos dados + timing
    await db
      .update(surveyResponses)
      .set({
        ...data,
        status: stepName,
        stepTimings: {
          ...currentTimings,
          [stepName]: timeSpentOnStep,
        },
        updatedAt: new Date(),
      })
      .where(eq(surveyResponses.id, responseId));

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Erro de validação:", error.errors);
      return { success: false, error: "Dados inválidos fornecidos." };
    }
    console.error("Erro ao salvar etapa:", error);
    return { success: false, error: "Falha ao salvar etapa." };
  }
}

// ============================================================
// ACTION 3: Completar a Pesquisa (Thank You)
// ============================================================

export async function completeSurvey(
  responseId: string,
  totalDuration: number,
  wantsBeta: boolean,
  email?: string | null,
  whatsapp?: string | null
) {
  try {
    // Validar entrada
    completeSurveySchema.parse({
      responseId,
      totalDuration,
      wantsBeta,
      email,
      whatsapp,
    });

    // Atualizar resposta como completa
    await db
      .update(surveyResponses)
      .set({
        status: "completed",
        wantsBeta,
        email: email || null,
        whatsapp: whatsapp || null,
        totalDurationSeconds: Math.round(totalDuration), // Converter para inteiro
        completedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(surveyResponses.id, responseId));

    // Enviar email de confirmação se fornecido
    let emailSent = false;
    if (email) {
      try {
        // Buscar dados da resposta para personalizar email
        const response = await db
          .select()
          .from(surveyResponses)
          .where(eq(surveyResponses.id, responseId))
          .limit(1);

        const utmSource = response[0]?.utmSource;
        let referralLink: string | undefined = undefined;

        // Criar link de referral automático se veio de utm_source
        if (utmSource && utmSource !== "direct") {
          const existingSource = await db
            .select()
            .from(referenceSources)
            .where(eq(referenceSources.slug, utmSource))
            .limit(1);

          if (existingSource.length === 0) {
            // Criar fonte automaticamente
            await createReferenceSource({
              name: `Auto: ${utmSource}`,
              slug: utmSource,
              description: "Criado automaticamente",
            });
          }

          referralLink = `${process.env.NEXT_PUBLIC_BASE_URL || "https://useincode.app"}?utm_source=${utmSource}`;
        }

        const userName = email.split("@")[0]; // Extrai nome do email
        const emailHTML = getConfirmationEmailHTML(userName, referralLink);

        const emailResult = await sendEmail({
          to: email,
          subject: "✨ Sua resposta foi recebida | Incode Research",
          html: emailHTML,
        });

        emailSent = emailResult.success;
      } catch (emailError) {
        console.error("Erro ao enviar email:", emailError);
        // Não falha a operação principal se email falhar
      }
    }

    return { 
      success: true, 
      emailSent,
      message: "Pesquisa concluída com sucesso!" 
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Erro de validação:", error.errors);
      return { success: false, error: "Dados inválidos fornecidos.", emailSent: false };
    }
    console.error("Erro ao completar pesquisa:", error);
    return { success: false, error: "Falha ao completar pesquisa.", emailSent: false };
  }
}
