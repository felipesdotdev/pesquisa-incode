export const TRANSLATIONS = {
    status: {
      started: 'Iniciado',
      completed: 'Concluído',
      disqualified: 'Desqualificado',
      q1screening: 'Triagem',
      q2segment: 'Segmento',
      q3timespent: 'Tempo Gasto',
      q4painintensity: 'Dor',
      q5currentsolution: 'Solução Atual',
      q6pitchview: 'Pitch',
      q7usageintent: 'Intenção',
      q8perceivedvalue: 'Valor Percebido',
      q9willingnesstopay: 'Preço',
      q10magicwand: 'Varinha Mágica',
      q11objections: 'Objeções',
      q12leadcapture: 'Lead',
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
      lessthan2h: 'Menos de 2h',
      '2hto5h': '2 a 5h',
      '5hto10h': '5 a 10h',
      '10hto20h': '10 a 20h',
      hover20h: 'Acima de 20h',
    },
    usageIntent: {
      definitelynot: 'Definitivamente não',
      probablynot: 'Provavelmente não',
      unsure: 'Incerto',
      probablyyes: 'Provavelmente sim',
      definitelyyes: 'Com certeza',
    },
    perceivedValue: {
      low: 'Baixo',
      medium: 'Médio',
      high: 'Alto',
    },
    willingnessToPay: {
      low: 'Baixo (R$50)',
      medium: 'Médio (R$50 - R$150)',
      high: 'Alto (R$150+)',
    },
    boolean: {
      true: 'Sim',
      false: 'Não',
    },
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
  
  // Decodifica valores que podem estar com encoding URL (ex: "Sumaré" -> "Sumare")
  export function decodeLocation(value: string | null | undefined): string {
    if (!value || value === 'unknown' || value === '-') return '-';
    
    try {
      // Tenta decodificar se estiver com encoding URL
      return decodeURIComponent(value);
    } catch {
      // Se não for encoding válido, retorna o valor original
      return value;
    }
  }
  