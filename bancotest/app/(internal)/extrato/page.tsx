'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/ui/header';
import { Transacao } from '@/app/types/types';

export default function ExtratoPage() {
  const [nome, setNome] = useState('Usuário');
  const [saldo, setSaldo] = useState(0);
  const [extrato, setExtrato] = useState<Transacao[]>([]);
  const [inicio, setInicio] = useState('');
  const [fim, setFim] = useState('');
  const [filtrado, setFiltrado] = useState(false);
  const router = useRouter();

  const fetchDados = async () => {
    try {
      const res = await fetch('/api/pessoas', { cache: 'no-store' });
      const data = await res.json();
      setNome(data.nome);
      setSaldo(parseFloat(data.saldo));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchExtrato = async (inicio?: string, fim?: string) => {
    try {
      const params = new URLSearchParams();
      if (inicio) params.append('inicio', inicio);
      if (fim) params.append('fim', fim);
      const res = await fetch(`/api/transacoes/extrato?${params.toString()}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setExtrato(data);
      }
    } catch (err) {
      console.error('Erro ao carregar extrato:', err);
    }
  };

  const limparBusca = () => {
    const hoje = new Date();
    const trintaDiasAtras = new Date();
    trintaDiasAtras.setDate(hoje.getDate() - 30);
    const formatoData = (data: Date) => data.toISOString().split('T')[0];

    const dataInicio = formatoData(trintaDiasAtras);
    const dataFim = formatoData(hoje);

    setInicio(dataInicio);
    setFim(dataFim);
    setFiltrado(false);
    fetchExtrato(dataInicio, dataFim);
  };

  const buscarPorPeriodo = () => {
    setFiltrado(true);
    fetchExtrato(inicio, fim);
  };

  useEffect(() => {
    const hoje = new Date();
    const trintaDiasAtras = new Date();
    trintaDiasAtras.setDate(hoje.getDate() - 30);
    const formatoData = (data: Date) => data.toISOString().split('T')[0];

    const dataInicio = formatoData(trintaDiasAtras);
    const dataFim = formatoData(hoje);

    setInicio(dataInicio);
    setFim(dataFim);

    fetchDados();
    fetchExtrato(dataInicio, dataFim);
  }, []);

  return (
    <Header desc="Extrato" voltarVisivel>
      {() => (
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6 w-full max-w-5xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Extrato por período</h2>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-4">
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Início</label>
                <input type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} className="border text-gray-400 border-gray-300 rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Fim</label>
                <input type="date" value={fim} onChange={(e) => setFim(e.target.value)} className="border text-gray-400 border-gray-300 rounded px-3 py-2" />
              </div>
              <button
                onClick={buscarPorPeriodo}
                className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
              >
                Buscar
              </button>
              <button
                onClick={limparBusca}
                className="border border-red-500 text-red-600 px-4 py-2 rounded hover:bg-red-50"
              >
                Limpar busca
              </button>
            </div>
          </div>

          <div className="overflow-y-auto max-h-64">
            <table className="min-w-full bg-white shadow-md rounded-md">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="text-left text-gray-600 bg-gray-100">
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3">Descrição</th>
                  <th className="px-4 py-3">Valor</th>
                </tr>
              </thead>
              <tbody>
                {extrato.map((t, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-3 text-gray-500">{new Date(t.dataTransacao).toLocaleDateString('pt-BR')}</td>
                    <td className="px-4 py-3 font-bold text-gray-400">{t.valor >= 0 ? 'Depósito' : 'Saque'}</td>
                    <td className={`px-4 py-3 font-semibold ${t.valor >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {t.valor >= 0 ? '+' : '-'}R$ {Math.abs(t.valor).toFixed(2).replace('.', ',')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!filtrado && (
            <p className="text-xs text-gray-400 mt-2">*Extrato dos últimos 30 dias</p>
          )}
        </div>
      )}
    </Header>
  );
}
