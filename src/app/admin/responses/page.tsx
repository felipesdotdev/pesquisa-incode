import { getResponses } from '@/actions/admin';
import { translate } from '@/lib/formatters';
import Link from 'next/link';

// Desabilitar cache para sempre buscar dados atualizados
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ResponsesPage() {
    const responses = await getResponses();

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-gray-900">Todas as Respostas</h2>
                <p className="text-gray-500 mt-2">Lista detalhada das últimas 100 respostas.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium">
                            <tr>
                                <th className="px-6 py-3 whitespace-nowrap">Data</th>
                                <th className="px-6 py-3 whitespace-nowrap">Status</th>
                                <th className="px-6 py-3 whitespace-nowrap">Segmento</th>
                                <th className="px-6 py-3 whitespace-nowrap">Dor (0-10)</th>
                                <th className="px-6 py-3 whitespace-nowrap">Tempo Gasto</th>
                                <th className="px-6 py-3 whitespace-nowrap">Intenção</th>
                                <th className="px-6 py-3 whitespace-nowrap">Contato</th>
                                <th className="px-6 py-3 whitespace-nowrap"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {responses.map((response) => (
                                <tr key={response.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4 text-gray-900 whitespace-nowrap">
                                        {new Date(response.createdAt).toLocaleDateString('pt-BR')} <br />
                                        <span className="text-xs text-gray-400">{new Date(response.createdAt).toLocaleTimeString('pt-BR')}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${response.status === 'completed'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {translate('status', response.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                                        {translate('businessSegment', response.businessSegment)}
                                        {response.businessSegmentOther && <span className="text-xs text-gray-400 block">({response.businessSegmentOther})</span>}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap text-center">
                                        {response.painIntensity !== null ? response.painIntensity : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                                        {translate('weeklyTimeSpent', response.weeklyTimeSpent)}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                                        {translate('usageIntent', response.usageIntent)}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                                        {response.email && <div className="text-gray-900">{response.email}</div>}
                                        {response.whatsapp && <div className="text-gray-500 text-xs">{response.whatsapp}</div>}
                                        {!response.email && !response.whatsapp && '-'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link href={`/admin/responses/${response.id}`} className="text-indigo-600 hover:text-indigo-900 font-medium">
                                            Ver
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {responses.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                                        Nenhuma resposta encontrada.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
