import { pgTable, uuid, text, integer, boolean, timestamp, jsonb, varchar } from 'drizzle-orm/pg-core';

// Tabela de Fontes de Referência (Links personalizados para divulgadores)
export const referenceSources = pgTable('reference_sources', {
    id: uuid('id').defaultRandom().primaryKey(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),

    // Identificador único do link (vai ser usado como utm_source)
    slug: varchar('slug', { length: 100 }).notNull().unique(),

    // Nome/descrição do divulgador
    name: text('name').notNull(),

    // Descrição adicional (ex: "Amigo do Instagram", "Parceiro X")
    description: text('description'),

    // Se está ativo ou não
    isActive: boolean('is_active').default(true).notNull(),

    // Contadores (atualizados via triggers ou na aplicação)
    totalClicks: integer('total_clicks').default(0).notNull(),
    totalResponses: integer('total_responses').default(0).notNull(),
    totalCompleted: integer('total_completed').default(0).notNull(),
    totalLeads: integer('total_leads').default(0).notNull(),
});

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
    completedAt: timestamp('completed_at'), // Quando a pesquisa foi completada

    // JSON para guardar tempos individuais por pergunta. 
    // Ex: { "q1": 2.5, "q2": 5.1, "pitch_view_time": 10.0 }
    // Isso ajuda a ver onde as pessoas travam ou se leem o pitch rápido demais.
    stepTimings: jsonb('step_timings'),

    // Adicionar referência ao visitante
    visitorId: varchar('visitor_id', { length: 100 }),
});

// Tabela de Visitas (registra TODOS que entraram no site, mesmo sem responder)
export const siteVisits = pgTable('site_visits', {
    id: uuid('id').defaultRandom().primaryKey(),
    createdAt: timestamp('created_at').defaultNow().notNull(),

    // Identificador único do visitante (gerado no client e salvo no localStorage)
    visitorId: varchar('visitor_id', { length: 100 }),

    // Se converteu em resposta
    convertedToResponse: boolean('converted_to_response').default(false),
    responseId: uuid('response_id'), // FK para surveyResponses se converteu

    // --- Rastreamento de Marketing (UTMs) ---
    utmSource: text('utm_source'),
    utmMedium: text('utm_medium'),
    utmCampaign: text('utm_campaign'),
    utmTerm: text('utm_term'),
    utmContent: text('utm_content'),
    referrer: text('referrer'),

    // --- Metadados Técnicos ---
    deviceType: text('device_type'),
    browser: text('browser'),
    browserVersion: text('browser_version'),
    os: text('os'),
    osVersion: text('os_version'),

    // --- Tela e Dispositivo ---
    screenWidth: integer('screen_width'),
    screenHeight: integer('screen_height'),
    viewportWidth: integer('viewport_width'),
    viewportHeight: integer('viewport_height'),
    devicePixelRatio: integer('device_pixel_ratio'),
    touchSupport: boolean('touch_support'),

    // --- GeoIP & Network ---
    ipAddress: text('ip_address'),
    country: text('country'),
    city: text('city'),
    region: text('region'),
    timezone: text('timezone'),
    isp: text('isp'),

    // --- Comportamento na Página ---
    landingPage: text('landing_page'),
    exitPage: text('exit_page'),
    pageViews: integer('page_views').default(1),
    timeOnSiteSeconds: integer('time_on_site_seconds'),
    scrollDepthPercent: integer('scroll_depth_percent'),
    
    // --- Engajamento ---
    clickedStart: boolean('clicked_start').default(false),
    lastSeenStep: varchar('last_seen_step', { length: 50 }),

    // --- Metadados extras em JSON ---
    metadata: jsonb('metadata'),
});
