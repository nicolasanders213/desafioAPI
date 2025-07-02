'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/ui/header';
import { Transacao } from '@/app/types/types';
import { BanknoteArrowDown, BanknoteArrowUp } from 'lucide-react';

export default function MainPage() {
  const [nome, setNome] = useState('Usuário');
  const [saldo, setSaldo] = useState(0);
  const [extrato, setExtrato] = useState<Transacao[]>([]);
  const router = useRouter();

  useEffect(() => {
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

  const fetchExtrato = async () => {
      try {
        const res = await fetch('/api/transacoes/extrato');
        const data = await res.json();
        if (Array.isArray(data)) {
          setExtrato(data);
        }
      } catch (err) {
        console.error('Erro ao carregar extrato:', err);
      }
    };
    fetchExtrato();
    fetchDados();
  }, []);

  return (
    <Header desc={`Bem-vindo, ${nome}`}>
      {({ saldoVisivel }) => (
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6 w-full max-w-5xl mx-auto">
          <div className="flex justify-start items-center mb-6">
            <p className="text-green-700 font-bold text-2xl mr-8 font-medium">Saldo Atual</p>
            <div className="flex items-center">
              <span className="text-2xl font-bold text-green-700">
                R$ {saldoVisivel ? (isNaN(saldo) ? '0,00' : saldo.toFixed(2).replace('.', ',')) : '••••••'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => router.push('/deposito')}
              className="flex flex-col items-center justify-center gap-2 border border-green-600 text-green-700 bg-white hover:bg-green-50 font-semibold py-4 rounded-xl shadow transition-all duration-200"
            >
              <BanknoteArrowUp className="w-6 h-6" />
              <span>Depósito</span>
            </button>

            <button
              onClick={() => router.push('/saque')}
              className="flex flex-col items-center justify-center gap-2 border border-red-600 text-red-600 bg-white hover:bg-red-50 font-semibold py-4 rounded-xl shadow transition-all duration-200"
            >
              <BanknoteArrowDown className="w-6 h-6" />
              <span>Saque</span>
            </button>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Extrato dos últimos 30 dias</h2>
            <button
              className="text-blue-600 text-sm hover:underline"
              onClick={() => router.push('/extrato')}
            >
              Ver mais
            </button>
          </div>
          <div className="overflow-x-auto max-h-64">
            <table className="min-w-full bg-white shadow-md rounded-md">
              <thead>
                <tr className="text-left text-gray-600 bg-gray-100">
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3">Descrição</th>
                  <th className="px-4 py-3">Valor</th>
                </tr>
              </thead>
              <tbody>
                {extrato.map((t) => (
                  <tr key={`${t.idTransacao}-${t.dataTransacao}`} className="border-t">
                    <td className="px-4 py-3 text-gray-500">{new Date(t.dataTransacao).toLocaleDateString('pt-BR')}</td>
                    <td className="px-4 py-3 font-bold text-gray-400">{t.valor >= 0 ? "Depósito" : "Saque"}</td>
                    <td
                      className={`px-4 py-3 ${
                        t.valor >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {t.valor >= 0 ? '+ ' : '- '}R$ {Math.abs(t.valor).toFixed(2).replace('.', ',')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Header>
  );
}
