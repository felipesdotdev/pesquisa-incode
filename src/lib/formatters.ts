export const TRANSLATIONS = {
    status: {
        started: 'Iniciado',
        completed: 'Concluído',
        disqualified: 'Desqualificado',
        q1_screening: 'Triagem',
        q2_segment: 'Segmento',
        q3_time_spent: 'Tempo Gasto',
        q4_pain_intensity: 'Dor',
        q5_current_solution: 'Solução Atual',
        q6_pitch_view: 'Pitch',
        q7_usage_intent: 'Intenção',
        q8_perceived_value: 'Valor Percebido',
        q9_willingness_to_pay: 'Preço',
        q10_magic_wand: 'Varinha Mágica',
        q11_objections: 'Objeções',
        q12_lead_capture: 'Lead',
    },
    businessSegment: {
        beauty: 'Beleza & Estética',
        food: 'Alimentação & Food Service',
        health: 'Saúde & Bem-estar',
        restaurant: 'Restaurantes',
        retail: 'Varejo',
        service: 'Serviços Gerais',
        store: 'Loja Física',
        value: 'Outro',
        other: 'Outro',
    },
    weeklyTimeSpent: {
        none: 'Nenhum',
        'less_than_2h': 'Menos de 2h',
        '2h_to_5h': '2h a 5h',
        '5h_to_10h': '5h a 10h',
        'more_than_10h': 'Mais de 10h',
    },
    usageIntent: {
        definitely_not: 'Definitivamente não',
        probably_not: 'Provavelmente não',
        unsure: 'Incerto',
        probably_yes: 'Provavelmente sim',
        definitely_yes: 'Com certeza',
    },
    perceivedValue: {
        low: 'Baixo',
        medium: 'Médio',
        high: 'Alto',
    },
    willingnessToPay: {
        low: 'Baixo (< R$50)',
        medium: 'Médio (R$50 - R$150)',
        high: 'Alto (> R$150)',
    },
    boolean: {
        true: 'Sim',
        false: 'Não',
    }
};

export function translate(category: keyof typeof TRANSLATIONS, key: string | null | undefined) {
    if (!key) return '-';
    // @ts-ignore
    return TRANSLATIONS[category]?.[key] || key;
}

export function formatDuration(seconds: number | null) {
    if (!seconds) return '-';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    if (minutes === 0) return `${remainingSeconds}s`;
    return `${minutes}m ${remainingSeconds}s`;
}

export function formatDate(date: Date | null) {
    if (!date) return '-';
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
}

// Decodifica valores que podem estar com encoding URL (ex: "Sumar%C3%A9" -> "Sumaré")
export function decodeLocation(value: string | null | undefined): string {
    if (!value || value === 'unknown' || value === '-') return value || '-';
    try {
        // Tenta decodificar se estiver com encoding URL
        return decodeURIComponent(value);
    } catch {
        // Se não for encoding válido, retorna o valor original
        return value;
    }
}
