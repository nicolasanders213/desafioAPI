'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cleave from 'cleave.js/react';

export default function CadastroForm() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/pessoas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, cpf: cpf.replace(/\D/g, ''), senha, dataNascimento }),
    });
    const data = await res.json();

    if (!res.ok) {
      setMensagem(data.erro || data.message);
    } else {
      setMensagem('Cadastrado com sucesso!');
      setTimeout(() => router.push('/login'), 2000);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md space-y-4"
    >
      <h2 className="text-2xl font-bold text-green-700 text-center">Cadastro de Usuário</h2>

      <input
        type="text"
        placeholder="Nome completo"
        value={nome}
        onChange={e => setNome(e.target.value)}
        className="w-full placeholder-gray-500 text-gray-500 p-2 border border-gray-300 rounded-md"
        required
      />

      <Cleave
        placeholder="CPF"
        options={{ delimiters: ['.', '.', '-'], blocks: [3, 3, 3, 2], numericOnly: true }}
        value={cpf}
        onChange={e => setCpf(e.target.value)}
        className="w-full placeholder-gray-500 text-gray-500 p-2 border border-gray-300 rounded-md"
        required
      />

      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={e => setSenha(e.target.value)}
        className="w-full placeholder-gray-500 text-gray-500 p-2 border border-gray-300 rounded-md"
        required
      />

      <input
        type="date"
        value={dataNascimento}
        onChange={e => setDataNascimento(e.target.value)}
        className="w-full placeholder-gray-500 text-gray-500 p-2 border border-gray-300 rounded-md"
        required
      />

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => router.push('/login')}
          className="w-1/2 bg-white border border-red-600 text-red-600 font-bold py-2 px-4 rounded-md transition hover:bg-red-50"
        >
          Voltar
        </button>

        <button
          type="submit"
          className="w-1/2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition"
        >
          Cadastrar
        </button>
      </div>

      {mensagem && <p className="text-center text-sm text-green-700">{mensagem}</p>}
    </form>
  );
}
