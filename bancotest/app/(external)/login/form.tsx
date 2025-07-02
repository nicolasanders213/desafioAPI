'use client'

import Cleave from 'cleave.js/react';
import { useToast } from "../../hooks/toast";
import { useRouter } from 'next/navigation';
import React, { useState } from "react";

export default function Form () {
    const router = useRouter();
  const { addToast } = useToast();

  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cpf: cpf, senha }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      addToast(data.message || 'Erro ao logar', 'error');
      return;
    }

    addToast('Login realizado com sucesso!', 'success');
    router.push('/home');
  };


    return (
        <div>
            <form
                onSubmit={handleSubmit}
                className="bg-white bg-opacity-90 p-6 rounded-2xl shadow-md w-full max-w-md space-y-4">
                    <h2 className="text-2xl font-bold text-green-700 text-center">Banco Teste</h2>

                    <Cleave
                            placeholder="CPF"
                            name="cpf-formatado"
                            options={{
                                delimiters: ['.', '.', '-'],
                                blocks: [3, 3, 3, 2],
                                numericOnly: true,
                            }}
                            value={cpf}
                            onChange={(e) => setCpf(e.target.value)}
                            className="w-full placeholder-gray-500 text-gray-700 p-2 border border-gray-300 rounded-md"
                            required
                    />


                    <input
                        placeholder="Senha"
                        name="password"
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        className="w-full placeholder-gray-500 text-gray-700 p-2 border border-gray-300 rounded-md"
                        required
                        />


                    <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition"
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>

                    <div className="text-center">
                    <span
                        onClick={() => router.push('/cadastro')}
                        className="text-sm text-blue-600 hover:underline cursor-pointer"
                    >
                        Não tem conta? Cadastre-se
                    </span>
                </div>
            </form>
        </div>
        
        
    )
}