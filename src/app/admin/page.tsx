import { getDashboardData, getResponses } from '@/actions/admin';
import { DashboardCharts } from './_components/dashboard-charts';
import { Users, CheckCircle, Target } from 'lucide-react';
import Link from 'next/link';
import { translate } from '@/lib/formatters';

export default async function AdminDashboard() {
    const { stats, charts } = await getDashboardData();
    const recentResponses = await getResponses(); // Fetching all for now, but we'll slice 5

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
                <p className="text-gray-500 mt-2">Visão geral dos resultados da pesquisa.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="p-3 bg-blue-50 rounded-xl">
                        <Users className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total de Respostas</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="p-3 bg-green-50 rounded-xl">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Completas</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                        <p className="text-xs text-gray-400">
                            {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}% conversão
                        </p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="p-3 bg-purple-50 rounded-xl">
                        <Target className="h-8 w-8 text-purple-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Leads Capturados</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.leads}</p>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <DashboardCharts data={charts} />

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Respostas Recentes</h3>
                    <Link href="/admin/responses" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                        Ver todas
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium">
                            <tr>
                                <th className="px-6 py-3">Data</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Segmento</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {recentResponses.slice(0, 5).map((response) => (
                                <tr key={response.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4 text-gray-900">
                                        {new Date(response.createdAt).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${response.status === 'completed'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {translate('status', response.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{translate('businessSegment', response.businessSegment)}</td>
                                    <td className="px-6 py-4 text-gray-600">{response.email || '-'}</td>
                                    <td className="px-6 py-4 text-right">
                                        <Link href={`/admin/responses/${response.id}`} className="text-indigo-600 hover:text-indigo-900 opacity-0 group-hover:opacity-100 transition-opacity">
                                            Ver detalhes
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {recentResponses.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
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
