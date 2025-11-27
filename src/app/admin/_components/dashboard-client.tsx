'use client'

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DashboardCharts } from './dashboard-charts';
import { 
    Users, CheckCircle, Target, TrendingUp, Clock, ArrowUpRight, 
    Eye, Filter, X, Globe, Smartphone, 
    Calendar, MapPin, Link2
} from 'lucide-react';
import Link from 'next/link';
import { translate, decodeLocation } from '@/lib/formatters';
import type { DashboardFilters } from '@/actions/admin';

type DashboardClientProps = {
    data: {
        stats: {
            total: number;
            completed: number;
            leads: number;
            totalVisits: number;
            uniqueVisitors: number;
            convertedVisits: number;
            bouncedVisits: number;
        };
        charts: any;
    };
    responses: any[];
    filterOptions: {
        sources: string[];
        regions: string[];
        cities: string[];
        devices: string[];
    };
    currentFilters: DashboardFilters;
};

export function DashboardClient({ data, responses, filterOptions, currentFilters }: DashboardClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showFilters, setShowFilters] = useState(false);

    const { stats, charts } = data;

    // Calcular taxas
    const visitToStartRate = stats.totalVisits > 0 ? Math.round((stats.convertedVisits / stats.totalVisits) * 100) : 0;
    const conversionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
    const leadRate = stats.completed > 0 ? Math.round((stats.leads / stats.completed) * 100) : 0;
    const bounceRate = stats.totalVisits > 0 ? Math.round((stats.bouncedVisits / stats.totalVisits) * 100) : 0;

    // Verificar se há filtros ativos
    const hasActiveFilters = Object.values(currentFilters).some(v => v);

    // Atualizar filtros
    const updateFilters = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`/admin?${params.toString()}`);
    };

    const clearFilters = () => {
        router.push('/admin');
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
                    <p className="text-gray-500 mt-1">Visão geral dos resultados da pesquisa</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>Tempo real</span>
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                            hasActiveFilters 
                                ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        <Filter className="h-4 w-4" />
                        Filtros
                        {hasActiveFilters && (
                            <span className="bg-indigo-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                                {Object.values(currentFilters).filter(v => v).length}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">Filtrar Dados</h3>
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                            >
                                <X className="h-4 w-4" />
                                Limpar filtros
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                        {/* Fonte */}
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">
                                <Link2 className="h-3 w-3 inline mr-1" />
                                Link de Referência
                            </label>
                            <select
                                value={currentFilters.utmSource || ''}
                                onChange={(e) => updateFilters('utmSource', e.target.value || null)}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="">Todas</option>
                                {filterOptions.sources.map(source => (
                                    <option key={source} value={source}>{source}</option>
                                ))}
                            </select>
                        </div>

                        {/* Estado */}
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">
                                <MapPin className="h-3 w-3 inline mr-1" />
                                Estado
                            </label>
                            <select
                                value={currentFilters.region || ''}
                                onChange={(e) => updateFilters('region', e.target.value || null)}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="">Todos</option>
                                {filterOptions.regions.map(region => (
                                    <option key={region} value={region}>{region}</option>
                                ))}
                            </select>
                        </div>

                        {/* Cidade */}
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">
                                <Globe className="h-3 w-3 inline mr-1" />
                                Cidade
                            </label>
                            <select
                                value={currentFilters.city || ''}
                                onChange={(e) => updateFilters('city', e.target.value || null)}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="">Todas</option>
                                {filterOptions.cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>

                        {/* Dispositivo */}
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">
                                <Smartphone className="h-3 w-3 inline mr-1" />
                                Dispositivo
                            </label>
                            <select
                                value={currentFilters.deviceType || ''}
                                onChange={(e) => updateFilters('deviceType', e.target.value || null)}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="">Todos</option>
                                {filterOptions.devices.map(device => (
                                    <option key={device} value={device}>{device}</option>
                                ))}
                            </select>
                        </div>

                        {/* Data Início */}
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">
                                <Calendar className="h-3 w-3 inline mr-1" />
                                Data Início
                            </label>
                            <input
                                type="date"
                                value={currentFilters.dateFrom || ''}
                                onChange={(e) => updateFilters('dateFrom', e.target.value || null)}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>

                        {/* Data Fim */}
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">
                                <Calendar className="h-3 w-3 inline mr-1" />
                                Data Fim
                            </label>
                            <input
                                type="date"
                                value={currentFilters.dateTo || ''}
                                onChange={(e) => updateFilters('dateTo', e.target.value || null)}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Visit Stats (Topo do funil) */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-2 mb-4">
                    <Eye className="h-5 w-5 text-slate-300" />
                    <h3 className="font-semibold">Métricas de Tráfego</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    <div>
                        <p className="text-slate-400 text-sm mb-1">Visitas Totais</p>
                        <p className="text-3xl font-bold">{stats.totalVisits}</p>
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm mb-1">Visitantes Únicos</p>
                        <p className="text-3xl font-bold">{stats.uniqueVisitors}</p>
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm mb-1">Iniciaram Pesquisa</p>
                        <p className="text-3xl font-bold">{stats.convertedVisits}</p>
                        <p className="text-xs text-emerald-400 mt-1">{visitToStartRate}% conversão</p>
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm mb-1">Bounce Rate</p>
                        <p className="text-3xl font-bold">{bounceRate}%</p>
                        <p className="text-xs text-red-400 mt-1">{stats.bouncedVisits} saíram sem interagir</p>
                    </div>
                </div>
            </div>

            {/* Response Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6">
                {/* Total Respostas */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg shadow-blue-500/25">
                            <Users className="h-6 w-6 text-white" />
                        </div>
                        <TrendingUp className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Total de Respostas</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>

                {/* Completas */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg shadow-green-500/25">
                            <CheckCircle className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            {conversionRate}%
                        </span>
                    </div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Completas</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.completed}</p>
                    <p className="text-xs text-gray-400 mt-1">Taxa de conclusão</p>
                </div>

                {/* Leads */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg shadow-purple-500/25">
                            <Target className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                            {leadRate}%
                        </span>
                    </div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Leads Capturados</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.leads}</p>
                    <p className="text-xs text-gray-400 mt-1">De respostas completas</p>
                </div>

                {/* Ticket Médio */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-green-50 rounded-xl">
                      <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-xs font-medium text-green-600">Pricing</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {(() => {
                      const lowCount = (data.charts.willingnessToPay || []).find((d: any) => d.name === 'low')?.value || 0;
                      const mediumCount = (data.charts.willingnessToPay || []).find((d: any) => d.name === 'medium')?.value || 0;
                      const highCount = (data.charts.willingnessToPay || []).find((d: any) => d.name === 'high')?.value || 0;

                      const total = lowCount + mediumCount + highCount;
                      if (total === 0) return '-';

                      // Valores médios de cada categoria
                      const avgTicket = (lowCount * 50 + mediumCount * 100 + highCount * 200) / total;
                      return `R$ ${avgTicket.toFixed(0)}`;
                    })()}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Ticket médio estimado</p>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Valor Percebido</span>
                      <span className="font-medium text-gray-700">
                        {(() => {
                          const highValue = (data.charts.perceivedValue || []).find((d: any) => d.name === 'high')?.value || 0;
                          const total = (data.charts.perceivedValue || []).reduce((sum: number, d: any) => sum + d.value, 0);
                          return total > 0 ? `${((highValue / total) * 100).toFixed(0)}% Alto` : '-';
                        })()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Funil Completo */}
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl shadow-lg text-white">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-white/80">Funil Completo</span>
                        <ArrowUpRight className="h-5 w-5 text-white/80" />
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-white/80">Visita → Resposta</span>
                            <span className="text-lg font-bold">{visitToStartRate}%</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                            <div className="bg-white rounded-full h-2 transition-all" style={{ width: `${visitToStartRate}%` }} />
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-white/80">Resposta → Fim</span>
                            <span className="text-lg font-bold">{conversionRate}%</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                            <div className="bg-white rounded-full h-2 transition-all" style={{ width: `${conversionRate}%` }} />
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-white/80">Fim → Lead</span>
                            <span className="text-lg font-bold">{leadRate}%</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                            <div className="bg-white rounded-full h-2 transition-all" style={{ width: `${leadRate}%` }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <DashboardCharts data={charts} />

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Respostas Recentes</h3>
                        <p className="text-sm text-gray-500 mt-0.5">Últimas 5 respostas recebidas</p>
                    </div>
                    <Link 
                        href="/admin/responses" 
                        className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                    >
                        Ver todas
                        <ArrowUpRight className="h-4 w-4" />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50/80 text-gray-500 font-medium">
                            <tr>
                                <th className="px-6 py-4">Data</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Segmento</th>
                                <th className="px-6 py-4">Origem</th>
                                <th className="px-6 py-4">Local</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {responses.slice(0, 5).map((response) => (
                                <tr key={response.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4 text-gray-900 whitespace-nowrap">
                                        {new Date(response.createdAt).toLocaleDateString('pt-BR', {
                                            day: '2-digit',
                                            month: 'short',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                            response.status === 'completed'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-amber-100 text-amber-700'
                                        }`}>
                                            {translate('status', response.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {translate('businessSegment', response.businessSegment) || '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {response.utmSource ? (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700">
                                                {response.utmSource}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">Direto</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 text-xs">
                                        {response.city && response.region ? `${decodeLocation(response.city)}, ${decodeLocation(response.region)}` : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{response.email || '-'}</td>
                                    <td className="px-6 py-4 text-right">
                                        <Link 
                                            href={`/admin/responses/${response.id}`} 
                                            className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-900 opacity-0 group-hover:opacity-100 transition-all font-medium text-sm"
                                        >
                                            Ver
                                            <ArrowUpRight className="h-3.5 w-3.5" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {responses.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center">
                                            <Users className="h-12 w-12 text-gray-300 mb-3" />
                                            <p className="text-gray-500 font-medium">Nenhuma resposta ainda</p>
                                            <p className="text-gray-400 text-sm mt-1">As respostas aparecerão aqui</p>
                                        </div>
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
