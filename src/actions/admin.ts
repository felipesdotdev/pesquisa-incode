'use server'

import { cookies } from 'next/headers';
import { encrypt } from '@/lib/auth';
import { db } from '@/db';
import { surveyResponses, referenceSources, siteVisits } from '@/db/schema';
import { count, desc, eq, sql, and, or, gte, lte } from 'drizzle-orm';
import { redirect } from 'next/navigation';

// Tipos para filtros
export type DashboardFilters = {
    utmSource?: string;
    region?: string;
    city?: string;
    dateFrom?: string;
    dateTo?: string;
    deviceType?: string;
};

export async function login(prevState: any, formData: FormData) {
    const user = formData.get('user') as string;
    const password = formData.get('password') as string;

    const adminUser = process.env.ADMIN_USER;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminUser || !adminPassword) {
        return { error: 'Credenciais de administrador não configuradas no servidor.' };
    }

    if (user === adminUser && password === adminPassword) {
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        const session = await encrypt({ user, expires });

        (await cookies()).set('session', session, { expires, httpOnly: true });

        // Não redirecionar aqui para poder tratar o sucesso no client se quiser, 
        // mas o padrão é redirecionar ou retornar sucesso.
        // Vamos retornar sucesso e deixar o componente redirecionar ou usar redirect aqui.
        // Usando redirect aqui para simplificar.
    } else {
        return { error: 'Usuário ou senha incorretos.' };
    }

    redirect('/admin');
}

export async function logout() {
    (await cookies()).delete('session');
    redirect('/admin/login');
}

// Helper para construir condições de filtro
function buildFilterConditions(filters?: DashboardFilters) {
    const conditions = [];
    
    if (filters?.utmSource) {
        conditions.push(eq(surveyResponses.utmSource, filters.utmSource));
    }
    if (filters?.region) {
        conditions.push(eq(surveyResponses.region, filters.region));
    }
    if (filters?.city) {
        conditions.push(eq(surveyResponses.city, filters.city));
    }
    if (filters?.deviceType) {
        conditions.push(eq(surveyResponses.deviceType, filters.deviceType));
    }
    if (filters?.dateFrom) {
        conditions.push(gte(surveyResponses.createdAt, new Date(filters.dateFrom)));
    }
    if (filters?.dateTo) {
        conditions.push(lte(surveyResponses.createdAt, new Date(filters.dateTo)));
    }

    return conditions.length > 0 ? and(...conditions) : undefined;
}

export async function getDashboardData(filters?: DashboardFilters) {
    const whereClause = buildFilterConditions(filters);

    // Totais
    const totalResponses = await db.select({ count: count() }).from(surveyResponses).where(whereClause);
    const completedResponses = await db.select({ count: count() })
        .from(surveyResponses)
        .where(whereClause ? and(whereClause, eq(surveyResponses.status, 'completed')) : eq(surveyResponses.status, 'completed'));
    const leads = await db.select({ count: count() })
        .from(surveyResponses)
        .where(whereClause ? and(whereClause, sql`${surveyResponses.email} IS NOT NULL`) : sql`${surveyResponses.email} IS NOT NULL`);

    // Estatísticas de visitas
    const totalVisits = await db.select({ count: count() }).from(siteVisits);
    const uniqueVisitors = await db
        .select({ count: sql<number>`count(distinct ${siteVisits.visitorId})` })
        .from(siteVisits);
    const convertedVisits = await db.select({ count: count() })
        .from(siteVisits)
        .where(eq(siteVisits.convertedToResponse, true));
    const bouncedVisits = await db.select({ count: count() })
        .from(siteVisits)
        .where(and(eq(siteVisits.convertedToResponse, false), eq(siteVisits.clickedStart, false)));

    // Gráficos

    // 1. Segmentos
    const segments = await db.select({
        name: surveyResponses.businessSegment,
        value: count()
    })
        .from(surveyResponses)
        .where(whereClause ? and(whereClause, sql`${surveyResponses.businessSegment} IS NOT NULL`) : sql`${surveyResponses.businessSegment} IS NOT NULL`)
        .groupBy(surveyResponses.businessSegment);

    // 2. Intensidade da Dor
    const painIntensity = await db.select({
        name: surveyResponses.painIntensity,
        value: count()
    })
        .from(surveyResponses)
        .where(whereClause ? and(whereClause, sql`${surveyResponses.painIntensity} IS NOT NULL`) : sql`${surveyResponses.painIntensity} IS NOT NULL`)
        .groupBy(surveyResponses.painIntensity);

    // 3. Tempo Gasto (Weekly)
    const timeSpent = await db.select({
        name: surveyResponses.weeklyTimeSpent,
        value: count()
    })
        .from(surveyResponses)
        .where(whereClause ? and(whereClause, sql`${surveyResponses.weeklyTimeSpent} IS NOT NULL`) : sql`${surveyResponses.weeklyTimeSpent} IS NOT NULL`)
        .groupBy(surveyResponses.weeklyTimeSpent);

    // 4. Intenção de Uso
    const usageIntent = await db.select({
        name: surveyResponses.usageIntent,
        value: count()
    })
        .from(surveyResponses)
        .where(whereClause ? and(whereClause, sql`${surveyResponses.usageIntent} IS NOT NULL`) : sql`${surveyResponses.usageIntent} IS NOT NULL`)
        .groupBy(surveyResponses.usageIntent);

    // 5. UTM Source
    const utmSource = await db.select({
        name: surveyResponses.utmSource,
        value: count()
    })
        .from(surveyResponses)
        .where(whereClause ? and(whereClause, sql`${surveyResponses.utmSource} IS NOT NULL`) : sql`${surveyResponses.utmSource} IS NOT NULL`)
        .groupBy(surveyResponses.utmSource);

    // 6. Geo (Region/State)
    const geoRegion = await db.select({
        name: surveyResponses.region,
        value: count()
    })
        .from(surveyResponses)
        .where(whereClause ? and(whereClause, sql`${surveyResponses.region} IS NOT NULL`) : sql`${surveyResponses.region} IS NOT NULL`)
        .groupBy(surveyResponses.region);

    // 7. Cidades
    const geoCities = await db.select({
        name: surveyResponses.city,
        value: count()
    })
        .from(surveyResponses)
        .where(whereClause ? and(whereClause, sql`${surveyResponses.city} IS NOT NULL`) : sql`${surveyResponses.city} IS NOT NULL`)
        .groupBy(surveyResponses.city);

    // 8. Device Types
    const deviceTypes = await db.select({
        name: surveyResponses.deviceType,
        value: count()
    })
        .from(surveyResponses)
        .where(whereClause ? and(whereClause, sql`${surveyResponses.deviceType} IS NOT NULL`) : sql`${surveyResponses.deviceType} IS NOT NULL`)
        .groupBy(surveyResponses.deviceType);

    // 9. Browsers
    const browsers = await db.select({
        name: surveyResponses.browser,
        value: count()
    })
        .from(surveyResponses)
        .where(whereClause ? and(whereClause, sql`${surveyResponses.browser} IS NOT NULL`) : sql`${surveyResponses.browser} IS NOT NULL`)
        .groupBy(surveyResponses.browser);

    // 10. OS
    const operatingSystems = await db.select({
        name: surveyResponses.os,
        value: count()
    })
        .from(surveyResponses)
        .where(whereClause ? and(whereClause, sql`${surveyResponses.os} IS NOT NULL`) : sql`${surveyResponses.os} IS NOT NULL`)
        .groupBy(surveyResponses.os);

    // 11. Funil de abandono
    const funnelData = await db.select({
        status: surveyResponses.status,
        count: count()
    })
        .from(surveyResponses)
        .where(whereClause)
        .groupBy(surveyResponses.status);

    // 12. Respostas por dia (últimos 30 dias)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const responsesPerDay = await db.select({
        date: sql<string>`DATE(${surveyResponses.createdAt})`,
        count: count()
    })
        .from(surveyResponses)
        .where(gte(surveyResponses.createdAt, thirtyDaysAgo))
        .groupBy(sql`DATE(${surveyResponses.createdAt})`)
        .orderBy(sql`DATE(${surveyResponses.createdAt})`);

    // 13. Average Time per Step (Calculated in JS)
    const timingsData = await db.select({
        timings: surveyResponses.stepTimings
    })
        .from(surveyResponses)
        .where(eq(surveyResponses.status, 'completed'))
        .limit(500);

    const stepAverages: Record<string, { total: number; count: number }> = {};

    timingsData.forEach(row => {
        const timings = row.timings as Record<string, number> | null;
        if (timings) {
            Object.entries(timings).forEach(([step, time]) => {
                if (typeof time === 'number') {
                    if (!stepAverages[step]) stepAverages[step] = { total: 0, count: 0 };
                    stepAverages[step].total += time;
                    stepAverages[step].count += 1;
                }
            });
        }
    });

    const avgStepTimings = Object.entries(stepAverages)
        .map(([name, data]) => ({
            name,
            value: Math.round(data.total / data.count)
        }))
        .sort((a, b) => b.value - a.value);

    return {
        stats: {
            total: totalResponses[0].count,
            completed: completedResponses[0].count,
            leads: leads[0].count,
            totalVisits: Number(totalVisits[0]?.count || 0),
            uniqueVisitors: Number(uniqueVisitors[0]?.count || 0),
            convertedVisits: Number(convertedVisits[0]?.count || 0),
            bouncedVisits: Number(bouncedVisits[0]?.count || 0),
        },
        charts: {
            segments,
            painIntensity,
            timeSpent,
            usageIntent,
            utmSource,
            geoRegion,
            geoCities,
            deviceTypes,
            browsers,
            operatingSystems,
            funnelData,
            responsesPerDay,
            avgStepTimings
        }
    };
}

// Obter opções de filtro disponíveis
export async function getFilterOptions() {
    const sources = await db.selectDistinct({ value: surveyResponses.utmSource })
        .from(surveyResponses)
        .where(sql`${surveyResponses.utmSource} IS NOT NULL`);

    const regions = await db.selectDistinct({ value: surveyResponses.region })
        .from(surveyResponses)
        .where(sql`${surveyResponses.region} IS NOT NULL`);

    const cities = await db.selectDistinct({ value: surveyResponses.city })
        .from(surveyResponses)
        .where(sql`${surveyResponses.city} IS NOT NULL`);

    const devices = await db.selectDistinct({ value: surveyResponses.deviceType })
        .from(surveyResponses)
        .where(sql`${surveyResponses.deviceType} IS NOT NULL`);

    return {
        sources: sources.map(s => s.value).filter(Boolean) as string[],
        regions: regions.map(r => r.value).filter(Boolean) as string[],
        cities: cities.map(c => c.value).filter(Boolean) as string[],
        devices: devices.map(d => d.value).filter(Boolean) as string[],
    };
}

export async function getResponses() {
    return await db.select()
        .from(surveyResponses)
        .orderBy(desc(surveyResponses.createdAt))
        .limit(100);
}

export async function getResponseById(id: string) {
    const result = await db.select()
        .from(surveyResponses)
        .where(eq(surveyResponses.id, id))
        .limit(1);

    return result[0] || null;
}

// === Reference Sources (Links de Referência) ===

export async function getReferenceSources() {
    return await db.select()
        .from(referenceSources)
        .orderBy(desc(referenceSources.createdAt));
}

export async function getReferenceSourceById(id: string) {
    const result = await db.select()
        .from(referenceSources)
        .where(eq(referenceSources.id, id))
        .limit(1);

    return result[0] || null;
}

export async function getReferenceSourceBySlug(slug: string) {
    const result = await db.select()
        .from(referenceSources)
        .where(eq(referenceSources.slug, slug))
        .limit(1);

    return result[0] || null;
}

export async function createReferenceSource(data: {
    slug: string;
    name: string;
    description?: string;
}) {
    try {
        // Validar slug (apenas letras, números, hífens)
        const slugRegex = /^[a-z0-9-]+$/;
        if (!slugRegex.test(data.slug)) {
            return { success: false, error: 'O identificador deve conter apenas letras minúsculas, números e hífens.' };
        }

        // Verificar se o slug já existe
        const existing = await getReferenceSourceBySlug(data.slug);
        if (existing) {
            return { success: false, error: 'Já existe um link com este identificador.' };
        }

        const result = await db.insert(referenceSources).values({
            slug: data.slug,
            name: data.name,
            description: data.description || null,
        }).returning({ id: referenceSources.id });

        return { success: true, id: result[0].id };
    } catch (error) {
        console.error('Erro ao criar fonte de referência:', error);
        return { success: false, error: 'Falha ao criar o link de referência.' };
    }
}

export async function updateReferenceSource(id: string, data: {
    name?: string;
    description?: string;
    isActive?: boolean;
}) {
    try {
        await db.update(referenceSources)
            .set({
                ...data,
                updatedAt: new Date(),
            })
            .where(eq(referenceSources.id, id));

        return { success: true };
    } catch (error) {
        console.error('Erro ao atualizar fonte de referência:', error);
        return { success: false, error: 'Falha ao atualizar o link de referência.' };
    }
}

export async function deleteReferenceSource(id: string) {
    try {
        await db.delete(referenceSources)
            .where(eq(referenceSources.id, id));

        return { success: true };
    } catch (error) {
        console.error('Erro ao deletar fonte de referência:', error);
        return { success: false, error: 'Falha ao deletar o link de referência.' };
    }
}

export async function getReferenceSourceStats(slug: string) {
    // Buscar estatísticas de uma fonte específica
    const totalResponses = await db.select({ count: count() })
        .from(surveyResponses)
        .where(eq(surveyResponses.utmSource, slug));

    const completedResponses = await db.select({ count: count() })
        .from(surveyResponses)
        .where(and(
            eq(surveyResponses.utmSource, slug),
            eq(surveyResponses.status, 'completed')
        ));

    const leads = await db.select({ count: count() })
        .from(surveyResponses)
        .where(and(
            eq(surveyResponses.utmSource, slug),
            sql`${surveyResponses.email} IS NOT NULL`
        ));

    return {
        totalResponses: totalResponses[0].count,
        completedResponses: completedResponses[0].count,
        leads: leads[0].count,
    };
}

export async function getResponsesBySource(slug: string) {
    return await db.select()
        .from(surveyResponses)
        .where(eq(surveyResponses.utmSource, slug))
        .orderBy(desc(surveyResponses.createdAt))
        .limit(100);
}
