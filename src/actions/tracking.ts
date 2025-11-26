'use server'

import { db } from '@/db';
import { siteVisits, surveyResponses } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { getRequestInfo } from '@/lib/request-info';

export type VisitData = {
    visitorId: string;
    utmSource?: string | null;
    utmMedium?: string | null;
    utmCampaign?: string | null;
    utmTerm?: string | null;
    utmContent?: string | null;
    referrer?: string | null;
    landingPage?: string | null;
    screenWidth?: number;
    screenHeight?: number;
    viewportWidth?: number;
    viewportHeight?: number;
    devicePixelRatio?: number;
    touchSupport?: boolean;
    timezone?: string;
    metadata?: Record<string, any>;
};

// Registra uma nova visita ao site
export async function trackVisit(data: VisitData) {
    try {
        const reqInfo = await getRequestInfo();

        const result = await db.insert(siteVisits).values({
            visitorId: data.visitorId,
            
            // UTMs
            utmSource: data.utmSource,
            utmMedium: data.utmMedium,
            utmCampaign: data.utmCampaign,
            utmTerm: data.utmTerm,
            utmContent: data.utmContent,
            referrer: data.referrer,
            landingPage: data.landingPage,

            // Server-side info
            deviceType: reqInfo.deviceType,
            browser: reqInfo.browser,
            os: reqInfo.os,
            ipAddress: reqInfo.ip,
            country: reqInfo.location.country,
            city: reqInfo.location.city,
            region: reqInfo.location.region,

            // Client-side info
            screenWidth: data.screenWidth,
            screenHeight: data.screenHeight,
            viewportWidth: data.viewportWidth,
            viewportHeight: data.viewportHeight,
            devicePixelRatio: data.devicePixelRatio,
            touchSupport: data.touchSupport,
            timezone: data.timezone,
            metadata: data.metadata || {},
        }).returning({ id: siteVisits.id });

        return { success: true, id: result[0].id };
    } catch (error) {
        console.error('Erro ao registrar visita:', error);
        return { success: false, error: 'Falha ao registrar visita' };
    }
}

// Atualiza visita quando usuário clica em começar
export async function updateVisitEngagement(visitorId: string, data: {
    clickedStart?: boolean;
    lastSeenStep?: string;
    scrollDepthPercent?: number;
    timeOnSiteSeconds?: number;
}) {
    try {
        await db.update(siteVisits)
            .set(data)
            .where(eq(siteVisits.visitorId, visitorId));

        return { success: true };
    } catch (error) {
        console.error('Erro ao atualizar engajamento:', error);
        return { success: false };
    }
}

// Marca visita como convertida quando começa a responder
export async function markVisitAsConverted(visitorId: string, responseId: string) {
    try {
        await db.update(siteVisits)
            .set({
                convertedToResponse: true,
                responseId: responseId,
            })
            .where(eq(siteVisits.visitorId, visitorId));

        return { success: true };
    } catch (error) {
        console.error('Erro ao marcar conversão:', error);
        return { success: false };
    }
}

// Buscar estatísticas de visitas
export async function getVisitStats(filters?: {
    utmSource?: string;
    region?: string;
    city?: string;
    dateFrom?: Date;
    dateTo?: Date;
}) {
    try {
        // Construir condições de filtro
        const conditions = [];
        
        if (filters?.utmSource) {
            conditions.push(eq(siteVisits.utmSource, filters.utmSource));
        }
        if (filters?.region) {
            conditions.push(eq(siteVisits.region, filters.region));
        }
        if (filters?.city) {
            conditions.push(eq(siteVisits.city, filters.city));
        }
        if (filters?.dateFrom) {
            conditions.push(sql`${siteVisits.createdAt} >= ${filters.dateFrom}`);
        }
        if (filters?.dateTo) {
            conditions.push(sql`${siteVisits.createdAt} <= ${filters.dateTo}`);
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        // Total de visitas
        const totalVisits = await db
            .select({ count: sql<number>`count(*)` })
            .from(siteVisits)
            .where(whereClause);

        // Visitas únicas (por visitorId)
        const uniqueVisitors = await db
            .select({ count: sql<number>`count(distinct ${siteVisits.visitorId})` })
            .from(siteVisits)
            .where(whereClause);

        // Convertidos
        const converted = await db
            .select({ count: sql<number>`count(*)` })
            .from(siteVisits)
            .where(whereClause ? and(whereClause, eq(siteVisits.convertedToResponse, true)) : eq(siteVisits.convertedToResponse, true));

        // Clicou em começar mas não converteu
        const clickedStartNotConverted = await db
            .select({ count: sql<number>`count(*)` })
            .from(siteVisits)
            .where(whereClause 
                ? and(whereClause, eq(siteVisits.clickedStart, true), eq(siteVisits.convertedToResponse, false))
                : and(eq(siteVisits.clickedStart, true), eq(siteVisits.convertedToResponse, false))
            );

        return {
            totalVisits: Number(totalVisits[0]?.count || 0),
            uniqueVisitors: Number(uniqueVisitors[0]?.count || 0),
            converted: Number(converted[0]?.count || 0),
            clickedStartNotConverted: Number(clickedStartNotConverted[0]?.count || 0),
            bounceRate: totalVisits[0]?.count > 0 
                ? Math.round(((Number(totalVisits[0].count) - Number(converted[0]?.count || 0)) / Number(totalVisits[0].count)) * 100)
                : 0,
            conversionRate: totalVisits[0]?.count > 0
                ? Math.round((Number(converted[0]?.count || 0) / Number(totalVisits[0].count)) * 100)
                : 0,
        };
    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        return {
            totalVisits: 0,
            uniqueVisitors: 0,
            converted: 0,
            clickedStartNotConverted: 0,
            bounceRate: 0,
            conversionRate: 0,
        };
    }
}

// Verificar se visitante já completou a pesquisa
export async function checkVisitorCompletion(visitorId: string) {
    try {
        const response = await db
            .select({ 
                id: surveyResponses.id, 
                status: surveyResponses.status,
                createdAt: surveyResponses.createdAt 
            })
            .from(surveyResponses)
            .where(eq(surveyResponses.visitorId, visitorId))
            .orderBy(sql`${surveyResponses.createdAt} DESC`)
            .limit(1);

        if (response.length > 0) {
            return {
                hasResponded: true,
                isCompleted: response[0].status === 'completed',
                responseId: response[0].id,
                respondedAt: response[0].createdAt,
            };
        }

        return {
            hasResponded: false,
            isCompleted: false,
            responseId: null,
            respondedAt: null,
        };
    } catch (error) {
        console.error('Erro ao verificar conclusão:', error);
        return {
            hasResponded: false,
            isCompleted: false,
            responseId: null,
            respondedAt: null,
        };
    }
}
