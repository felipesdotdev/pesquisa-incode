import { getResponseById } from '@/actions/admin';
import { translate, formatDate, formatDuration, decodeLocation } from '@/lib/formatters';
import Link from 'next/link';
import { ArrowLeft, User, Clock, MapPin, Monitor, BarChart2 } from 'lucide-react';
import { notFound } from 'next/navigation';

// Desabilitar cache para sempre buscar dados atualizados
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ResponseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const response = await getResponseById(id);

    if (!response) {
        notFound();
    }

    const stepTimings = response.stepTimings as Record<string, number> | null;

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link href="/admin/responses" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft className="h-6 w-6 text-gray-500" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Detalhes da Resposta</h1>
                        <p className="text-sm text-gray-500">ID: {response.id}</p>
                    </div>
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-medium ${response.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {translate('status', response.status)}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Coluna Principal (2/3) */}
                <div className="md:col-span-2 space-y-6">

                    {/* Lead Info */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center space-x-3 mb-6">
                            <User className="h-5 w-5 text-indigo-600" />
                            <h2 className="text-lg font-semibold text-gray-900">Informações do Lead</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium text-gray-900">{response.email || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">WhatsApp</p>
                                <p className="font-medium text-gray-900">{response.whatsapp || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Interesse no Beta</p>
                                <p className="font-medium text-gray-900">{translate('boolean', String(response.wantsBeta))}</p>
                            </div>
                        </div>
                    </div>

                    {/* Respostas da Pesquisa */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center space-x-3 mb-6">
                            <BarChart2 className="h-5 w-5 text-indigo-600" />
                            <h2 className="text-lg font-semibold text-gray-900">Respostas da Pesquisa</h2>
                        </div>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500">Dono de Negócio?</p>
                                    <p className="font-medium text-gray-900">{translate('boolean', String(response.isBusinessOwner))}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Segmento</p>
                                    <p className="font-medium text-gray-900">
                                        {translate('businessSegment', response.businessSegment)}
                                        {response.businessSegmentOther && ` (${response.businessSegmentOther})`}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Tempo Gasto (Semanal)</p>
                                    <p className="font-medium text-gray-900">{translate('weeklyTimeSpent', response.weeklyTimeSpent)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Intensidade da Dor</p>
                                    <div className="flex items-center space-x-2">
                                        <span className="font-medium text-gray-900">{response.painIntensity ?? '-'}</span>
                                        {response.painIntensity !== null && (
                                            <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-indigo-500"
                                                    style={{ width: `${(response.painIntensity / 10) * 100}%` }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <p className="text-sm text-gray-500">Solução Atual</p>
                                    <p className="font-medium text-gray-900">{response.currentSolution || '-'}</p>
                                    {response.currentSolutionTool && (
                                        <p className="text-sm text-gray-600 mt-1">Ferramenta: {response.currentSolutionTool}</p>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Intenção de Uso</p>
                                    <p className="font-medium text-gray-900">{translate('usageIntent', response.usageIntent)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Valor Percebido</p>
                                    <p className="font-medium text-gray-900">{translate('perceivedValue', response.perceivedValue)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Willingness to Pay</p>
                                    <p className="font-medium text-gray-900">{translate('willingnessToPay', response.willingnessToPay)}</p>
                                </div>
                            </div>

                            {/* Perguntas Abertas */}
                            <div className="pt-4 border-t border-gray-100 space-y-4">
                                {response.magicWandTask && (
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Tarefa "Varinha Mágica"</p>
                                        <div className="bg-gray-50 p-3 rounded-lg text-gray-800 text-sm italic">
                                            "{response.magicWandTask}"
                                        </div>
                                    </div>
                                )}
                                {response.objectionReason && (
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Motivo da Objeção</p>
                                        <div className="bg-red-50 p-3 rounded-lg text-red-800 text-sm italic">
                                            "{response.objectionReason}"
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Coluna Lateral (1/3) */}
                <div className="space-y-6">

                    {/* Metadados */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center space-x-3 mb-6">
                            <Monitor className="h-5 w-5 text-indigo-600" />
                            <h2 className="text-lg font-semibold text-gray-900">Metadados</h2>
                        </div>
                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Data</span>
                                <span className="font-medium text-gray-900">{formatDate(response.createdAt)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Dispositivo</span>
                                <span className="font-medium text-gray-900 capitalize">{response.deviceType || '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Navegador</span>
                                <span className="font-medium text-gray-900">{response.browser || '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">OS</span>
                                <span className="font-medium text-gray-900">{response.os || '-'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Geo & Marketing */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center space-x-3 mb-6">
                            <MapPin className="h-5 w-5 text-indigo-600" />
                            <h2 className="text-lg font-semibold text-gray-900">Origem</h2>
                        </div>
                        <div className="space-y-4 text-sm">
                            <div>
                                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Localização</p>
                                <p className="font-medium text-gray-900">
                                    {response.city ? `${decodeLocation(response.city)}, ` : ''}
                                    {decodeLocation(response.region)}
                                </p>
                                <p className="text-xs text-gray-400">{response.country || ''}</p>
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">UTM Tags</p>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Source</span>
                                        <span className="font-medium text-gray-900">{response.utmSource || '-'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Medium</span>
                                        <span className="font-medium text-gray-900">{response.utmMedium || '-'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Campaign</span>
                                        <span className="font-medium text-gray-900">{response.utmCampaign || '-'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timings */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center space-x-3 mb-6">
                            <Clock className="h-5 w-5 text-indigo-600" />
                            <h2 className="text-lg font-semibold text-gray-900">Tempos</h2>
                        </div>
                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500">Duração Total</span>
                                <span className="font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                                    {formatDuration(response.totalDurationSeconds)}
                                </span>
                            </div>

                            {stepTimings && (
                                <div className="pt-4 border-t border-gray-100 space-y-2">
                                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Por Etapa</p>
                                    {Object.entries(stepTimings).map(([key, value]) => (
                                        <div key={key} className="flex justify-between text-xs">
                                            <span className="text-gray-500 truncate max-w-[150px]" title={key}>
                                                {translate('status', key)}
                                            </span>
                                            <span className="font-medium text-gray-700">
                                                {typeof value === 'number' ? formatDuration(value) : '-'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
