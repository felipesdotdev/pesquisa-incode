import { headers } from 'next/headers';
import { UAParser } from 'ua-parser-js';

export async function getRequestInfo() {
    const headersList = await headers();

    // 1. IP do Usuário (tenta vários headers de proxy padrão)
    const ip = headersList.get('x-forwarded-for')?.split(',')[0] ||
        headersList.get('x-real-ip') ||
        'unknown';

    // 2. User Agent (Navegador/OS)
    const uaString = headersList.get('user-agent') || '';
    const parser = new UAParser(uaString);
    const device = parser.getDevice();
    const os = parser.getOS();
    const browser = parser.getBrowser();

    // 3. Geolocalização (Vercel/Cloudflare injetam esses headers)
    // Decodifica valores que podem vir com encoding URL
    const decodeIfEncoded = (value: string): string => {
        if (!value || value === 'unknown') return value;
        try {
            // Tenta decodificar se estiver com encoding URL
            return decodeURIComponent(value);
        } catch {
            // Se não for encoding válido, retorna o valor original
            return value;
        }
    };

    const country = headersList.get('x-vercel-ip-country') || 'unknown';
    const city = decodeIfEncoded(headersList.get('x-vercel-ip-city') || 'unknown');
    const region = decodeIfEncoded(headersList.get('x-vercel-ip-country-region') || 'unknown');

    // Normaliza os dados
    return {
        ip,
        userAgent: uaString,
        deviceType: device.type || 'desktop', // 'mobile', 'tablet', 'smarttv', etc
        deviceModel: device.model,
        os: `${os.name} ${os.version || ''}`.trim(),
        browser: `${browser.name} ${browser.version || ''}`.trim(),
        location: {
            country,
            city,
            region
        }
    };
}
