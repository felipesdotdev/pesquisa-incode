import { pgTable, uuid, text, integer, boolean, timestamp, jsonb, varchar } from 'drizzle-orm/pg-core';

export const surveyResponses = pgTable('survey_responses', {
    // --- Identificação Básica ---
    id: uuid('id').defaultRandom().primaryKey(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),

    // Status: 'started', 'completed' ou o ID da última pergunta respondida (para calcular funil de desistência)
    status: varchar('status', { length: 50 }).default('started'),

    // --- Respostas do Formulário (Mapeado das Perguntas 1-12) ---
    // Q1: Screening
    isBusinessOwner: boolean('is_business_owner'), // True se passou no filtro

    // Q2: Segmento
    businessSegment: text('business_segment'),
    businessSegmentOther: text('business_segment_other'), // Caso marque "Outro"

    // Q3: Tempo gasto (Dor)
    weeklyTimeSpent: text('weekly_time_spent'),

    // Q4: Intensidade da Dor (0-10)
    painIntensity: integer('pain_intensity'),

    // Q5: Solução Atual
    currentSolution: text('current_solution'),
    currentSolutionTool: text('current_solution_tool'), // Qual ferramenta usa

    // Q7: Intenção de Uso
    usageIntent: text('usage_intent'),

    // Q8: Percepção de Valor (Quanto acha que vale)
    perceivedValue: text('perceived_value'),

    // Q9: Willingness to Pay (Quanto pagaria)
    willingnessToPay: text('willingness_to_pay'),

    // Q10: Varinha Mágica (Qualitativo)
    magicWandTask: text('magic_wand_task'),

    // Q11: Objeções
    objectionReason: text('objection_reason'),

    // Q12: Lead
    wantsBeta: boolean('wants_beta'),
    email: text('email'),
    whatsapp: text('whatsapp'),

    // --- Rastreamento de Marketing (UTMs) ---
    // Fundamental para saber de onde vieram os leads (Instagram, LinkedIn, Ads)
    utmSource: text('utm_source'),
    utmMedium: text('utm_medium'),
    utmCampaign: text('utm_campaign'),
    utmTerm: text('utm_term'),
    utmContent: text('utm_content'),
    referrer: text('referrer'), // De qual site veio antes

    // --- Metadados Técnicos e de Comportamento ---
    deviceType: text('device_type'), // mobile, desktop
    browser: text('browser'),
    os: text('os'),

    // GeoIP & Network
    ipAddress: text('ip_address'), // CUIDADO COM LGPD (Talvez anonimizar ou hash se não for crítico)
    country: text('country'),
    city: text('city'),
    region: text('region'),

    // Analytics de Performance
    totalDurationSeconds: integer('total_duration_seconds'), // Quanto tempo levou no total

    // JSON para guardar tempos individuais por pergunta. 
    // Ex: { "q1": 2.5, "q2": 5.1, "pitch_view_time": 10.0 }
    // Isso ajuda a ver onde as pessoas travam ou se leem o pitch rápido demais.
    stepTimings: jsonb('step_timings'),
});
