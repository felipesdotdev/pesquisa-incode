'use server'

import { cookies } from 'next/headers';
import { encrypt } from '@/lib/auth';
import { db } from '@/db';
import { surveyResponses } from '@/db/schema';
import { count, desc, eq, sql } from 'drizzle-orm';
import { redirect } from 'next/navigation';

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

export async function getDashboardData() {
    // Totais
    const totalResponses = await db.select({ count: count() }).from(surveyResponses);
    const completedResponses = await db.select({ count: count() }).from(surveyResponses).where(eq(surveyResponses.status, 'completed'));
    const leads = await db.select({ count: count() }).from(surveyResponses).where(sql`${surveyResponses.email} IS NOT NULL`);

    // Gráficos

    // 1. Segmentos
    const segments = await db.select({
        name: surveyResponses.businessSegment,
        value: count()
    })
        .from(surveyResponses)
        .where(sql`${surveyResponses.businessSegment} IS NOT NULL`)
        .groupBy(surveyResponses.businessSegment);

    // 2. Intensidade da Dor
    const painIntensity = await db.select({
        name: surveyResponses.painIntensity,
        value: count()
    })
        .from(surveyResponses)
        .where(sql`${surveyResponses.painIntensity} IS NOT NULL`)
        .groupBy(surveyResponses.painIntensity);

    // 3. Tempo Gasto (Weekly)
    const timeSpent = await db.select({
        name: surveyResponses.weeklyTimeSpent,
        value: count()
    })
        .from(surveyResponses)
        .where(sql`${surveyResponses.weeklyTimeSpent} IS NOT NULL`)
        .groupBy(surveyResponses.weeklyTimeSpent);

    // 4. Intenção de Uso
    const usageIntent = await db.select({
        name: surveyResponses.usageIntent,
        value: count()
    })
        .from(surveyResponses)
        .where(sql`${surveyResponses.usageIntent} IS NOT NULL`)
        .groupBy(surveyResponses.usageIntent);

    // 5. UTM Source
    const utmSource = await db.select({
        name: surveyResponses.utmSource,
        value: count()
    })
        .from(surveyResponses)
        .where(sql`${surveyResponses.utmSource} IS NOT NULL`)
        .groupBy(surveyResponses.utmSource);

    // 6. Geo (Region/State)
    const geoRegion = await db.select({
        name: surveyResponses.region,
        value: count()
    })
        .from(surveyResponses)
        .where(sql`${surveyResponses.region} IS NOT NULL`)
        .groupBy(surveyResponses.region);

    // 7. Average Time per Step (Calculated in JS)
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
        .sort((a, b) => b.value - a.value); // Sort by longest duration

    return {
        stats: {
            total: totalResponses[0].count,
            completed: completedResponses[0].count,
            leads: leads[0].count,
        },
        charts: {
            segments,
            painIntensity,
            timeSpent,
            usageIntent,
            utmSource,
            geoRegion,
            avgStepTimings
        }
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
