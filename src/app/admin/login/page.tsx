'use client'

import { login } from '@/actions/admin';
import { useActionState } from 'react';
import { Loader2 } from 'lucide-react';

const initialState = {
    error: '',
};

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(login, initialState);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">
                        Incode Research
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Acesso restrito para administradores
                    </p>
                </div>

                <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
                    <form action={formAction} className="space-y-6">
                        <div>
                            <label htmlFor="user" className="block text-sm font-medium text-gray-700">
                                Usuário
                            </label>
                            <div className="mt-1">
                                <input
                                    id="user"
                                    name="user"
                                    type="text"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Senha
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                                />
                            </div>
                        </div>

                        {state?.error && (
                            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">
                                {state.error}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {isPending ? (
                                    <Loader2 className="animate-spin h-5 w-5" />
                                ) : (
                                    'Entrar'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
