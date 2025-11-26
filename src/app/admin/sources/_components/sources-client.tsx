'use client'

import { useState } from 'react';
import { createReferenceSource, updateReferenceSource, deleteReferenceSource } from '@/actions/admin';
import { Plus, Copy, Check, ExternalLink, Users, CheckCircle, Target, Trash2, Edit2, X, Link2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

type SourceWithStats = {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    isActive: boolean;
    createdAt: Date;
    stats: {
        totalResponses: number;
        completedResponses: number;
        leads: number;
    };
};

export function SourcesClient({ sources }: { sources: SourceWithStats[] }) {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSource, setEditingSource] = useState<SourceWithStats | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        slug: '',
        name: '',
        description: '',
    });

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

    const handleCopy = async (slug: string) => {
        const url = `${baseUrl}?utm_source=${slug}`;
        await navigator.clipboard.writeText(url);
        setCopiedId(slug);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const openCreateModal = () => {
        setFormData({ slug: '', name: '', description: '' });
        setEditingSource(null);
        setError(null);
        setIsModalOpen(true);
    };

    const openEditModal = (source: SourceWithStats) => {
        setFormData({
            slug: source.slug,
            name: source.name,
            description: source.description || '',
        });
        setEditingSource(source);
        setError(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingSource(null);
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            if (editingSource) {
                const result = await updateReferenceSource(editingSource.id, {
                    name: formData.name,
                    description: formData.description || undefined,
                });
                if (!result.success) {
                    setError(result.error || 'Erro ao atualizar');
                    setIsSubmitting(false);
                    return;
                }
            } else {
                const result = await createReferenceSource({
                    slug: formData.slug.toLowerCase().trim(),
                    name: formData.name,
                    description: formData.description || undefined,
                });
                if (!result.success) {
                    setError(result.error || 'Erro ao criar');
                    setIsSubmitting(false);
                    return;
                }
            }

            closeModal();
            router.refresh();
        } catch (err) {
            setError('Erro inesperado. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Tem certeza que deseja excluir o link "${name}"?`)) return;

        try {
            await deleteReferenceSource(id);
            router.refresh();
        } catch (err) {
            alert('Erro ao excluir o link.');
        }
    };

    const handleToggleActive = async (source: SourceWithStats) => {
        try {
            await updateReferenceSource(source.id, { isActive: !source.isActive });
            router.refresh();
        } catch (err) {
            alert('Erro ao alterar status.');
        }
    };

    // Função para gerar slug a partir do nome
    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove acentos
            .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
            .replace(/\s+/g, '-') // Substitui espaços por hífens
            .replace(/-+/g, '-') // Remove hífens duplicados
            .trim();
    };

    return (
        <>
            {/* Header with Create Button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl">
                        <Link2 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">{sources.length} links criados</p>
                    </div>
                </div>
                <button
                    onClick={openCreateModal}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-indigo-500/25"
                >
                    <Plus className="h-5 w-5" />
                    Novo Link
                </button>
            </div>

            {/* Cards Grid */}
            {sources.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                        <Link2 className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum link criado</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                        Crie links personalizados para rastrear de onde vêm suas respostas. 
                        Ideal para compartilhar com amigos, parceiros ou em diferentes canais.
                    </p>
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors"
                    >
                        <Plus className="h-5 w-5" />
                        Criar Primeiro Link
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sources.map((source) => (
                        <div
                            key={source.id}
                            className={`bg-white rounded-2xl shadow-sm border transition-all duration-200 hover:shadow-md ${
                                source.isActive ? 'border-gray-100' : 'border-orange-200 bg-orange-50/50'
                            }`}
                        >
                            {/* Card Header */}
                            <div className="p-5 border-b border-gray-100">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 text-lg">{source.name}</h3>
                                        {source.description && (
                                            <p className="text-sm text-gray-500 mt-1">{source.description}</p>
                                        )}
                                    </div>
                                    <span
                                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                            source.isActive
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-orange-100 text-orange-700'
                                        }`}
                                    >
                                        {source.isActive ? 'Ativo' : 'Inativo'}
                                    </span>
                                </div>

                                {/* Link URL */}
                                <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                                    <code className="text-xs text-gray-600 flex-1 truncate">
                                        {baseUrl}?utm_source={source.slug}
                                    </code>
                                    <button
                                        onClick={() => handleCopy(source.slug)}
                                        className="p-1.5 rounded-md hover:bg-gray-200 transition-colors"
                                        title="Copiar link"
                                    >
                                        {copiedId === source.slug ? (
                                            <Check className="h-4 w-4 text-green-600" />
                                        ) : (
                                            <Copy className="h-4 w-4 text-gray-500" />
                                        )}
                                    </button>
                                    <a
                                        href={`${baseUrl}?utm_source=${source.slug}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1.5 rounded-md hover:bg-gray-200 transition-colors"
                                        title="Abrir link"
                                    >
                                        <ExternalLink className="h-4 w-4 text-gray-500" />
                                    </a>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 divide-x divide-gray-100">
                                <div className="p-4 text-center">
                                    <div className="flex items-center justify-center mb-1">
                                        <Users className="h-4 w-4 text-blue-500" />
                                    </div>
                                    <p className="text-xl font-bold text-gray-900">{source.stats.totalResponses}</p>
                                    <p className="text-xs text-gray-500">Respostas</p>
                                </div>
                                <div className="p-4 text-center">
                                    <div className="flex items-center justify-center mb-1">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                    </div>
                                    <p className="text-xl font-bold text-gray-900">{source.stats.completedResponses}</p>
                                    <p className="text-xs text-gray-500">Completas</p>
                                </div>
                                <div className="p-4 text-center">
                                    <div className="flex items-center justify-center mb-1">
                                        <Target className="h-4 w-4 text-purple-500" />
                                    </div>
                                    <p className="text-xl font-bold text-gray-900">{source.stats.leads}</p>
                                    <p className="text-xs text-gray-500">Leads</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
                                <button
                                    onClick={() => handleToggleActive(source)}
                                    className={`text-sm font-medium transition-colors ${
                                        source.isActive
                                            ? 'text-orange-600 hover:text-orange-700'
                                            : 'text-green-600 hover:text-green-700'
                                    }`}
                                >
                                    {source.isActive ? 'Desativar' : 'Ativar'}
                                </button>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => openEditModal(source)}
                                        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                                        title="Editar"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(source.id, source.name)}
                                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                                        title="Excluir"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal} />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">
                                {editingSource ? 'Editar Link' : 'Novo Link de Referência'}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Nome */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nome do Divulgador *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => {
                                        const name = e.target.value;
                                        setFormData((prev) => ({
                                            ...prev,
                                            name,
                                            slug: editingSource ? prev.slug : generateSlug(name),
                                        }));
                                    }}
                                    placeholder="Ex: João Silva, Parceiro X"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    required
                                />
                            </div>

                            {/* Slug */}
                            {!editingSource && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Identificador (slug) *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.slug}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''),
                                            }))
                                        }
                                        placeholder="joao-silva"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-mono text-sm"
                                        required
                                        pattern="[a-z0-9-]+"
                                    />
                                    <p className="text-xs text-gray-500 mt-1.5">
                                        Apenas letras minúsculas, números e hífens. Será usado na URL.
                                    </p>
                                </div>
                            )}

                            {/* Descrição */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Descrição (opcional)
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                                    placeholder="Ex: Amigo que vai divulgar no Instagram"
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                                />
                            </div>

                            {/* Preview */}
                            {!editingSource && formData.slug && (
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-xs font-medium text-gray-500 mb-2">Preview do Link:</p>
                                    <code className="text-sm text-indigo-600 break-all">
                                        {baseUrl}?utm_source={formData.slug}
                                    </code>
                                </div>
                            )}

                            {/* Error */}
                            {error && (
                                <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Salvando...' : editingSource ? 'Salvar' : 'Criar Link'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
