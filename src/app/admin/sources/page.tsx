import { getReferenceSources, getReferenceSourceStats } from '@/actions/admin';
import { SourcesClient } from './_components/sources-client';

// Desabilitar cache para sempre buscar dados atualizados
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function SourcesPage() {
    const sources = await getReferenceSources();

    // Buscar estatísticas para cada fonte
    const sourcesWithStats = await Promise.all(
        sources.map(async (source) => {
            const stats = await getReferenceSourceStats(source.slug);
            return {
                ...source,
                stats,
            };
        })
    );

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-gray-900">Links de Referência</h2>
                <p className="text-gray-500 mt-2">
                    Crie links personalizados para divulgadores rastrearem de onde vêm suas respostas.
                </p>
            </div>

            <SourcesClient sources={sourcesWithStats} />
        </div>
    );
}
