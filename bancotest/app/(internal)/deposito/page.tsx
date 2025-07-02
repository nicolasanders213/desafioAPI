'use client';

import { useEffect, useState } from 'react';
import Header from '@/app/ui/header';
import type { Transacao } from '@/app/types/types';
import PopupSenha from '@/app/(internal)/deposito/ui/popup-senha';
import { useRouter } from 'next/navigation';
import { formatarValorInput } from '@/app/utils/input-value-formatted';

export default function DepositoPage() {
  const [sidebarAberta, setSidebarAberta] = useState(true);
  const [valor, setValor] = useState('R$ 0,00');
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [senha, setSenha] = useState('');
  const [erroSenha, setErroSenha] = useState(false);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const router = useRouter();

  useEffect(() => {
    carregarTransacoes();
  }, []);

  const carregarTransacoes = async () => {
    try {
      const res = await fetch('/api/deposito/extrato');
      const data = await res.json();
      if (Array.isArray(data)) {
        setTransacoes(data);
      } else {
        console.error('Formato inesperado:', data);
        setTransacoes([]);
      }
    } catch (err) {
      console.error('Erro ao buscar transações:', err);
      setTransacoes([]);
    }
  };

    const confirmarDeposito = async () => {

    try {
      const res = await fetch('/api/deposito', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ valor: valorNumerico, senha: senha }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.erro || 'Erro ao realizar depósito.');
        return;
      }

      await carregarTransacoes();
      fecharPopup();

      alert(`Depósito realizado com sucesso!\nNovo saldo: R$ ${parseFloat(data.novoSaldo).toFixed(2).replace('.', ',')}`);
    } catch (err) {
        console.error('Erro ao confirmar depósito:', err);
        alert('Erro inesperado ao realizar o depósito.');
      }
    };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValor(formatarValorInput(e.target.value));
  };

  const valorNumerico = parseFloat(valor.replace(/[R$\s.]/g, '').replace(',', '.')) || 0;

  const abrirPopup = () => setMostrarPopup(true);
  const fecharPopup = () => {
    setSenha('');
    setErroSenha(false);
    setMostrarPopup(false);
  };

  return (
    <Header desc="Depósito" mostrarControles={false} voltarVisivel={true}>
        <div className="bg-white rounded-2xl shadow-md p-4 max-w-2xl mx-auto">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Quanto deseja depositar?</h2>

              <input
                  type="text"
                  value={valor}
                  onChange={handleInput}
                  className="w-full border-2 border-green-700 rounded-lg px-4 py-3 text-xl text-gray-800 placeholder-gray-500 focus:outline-none mb-2"
                  placeholder="Digite o valor para o depósito"
              />

              <button
                  onClick={abrirPopup}
                  className="bg-green-700 text-white px-6 py-3 mt-4 rounded-lg hover:bg-green-800"
              >
                  Confirmar Depósito
              </button>

              <h3 className="text-lg font-semibold text-gray-700 mt-10 mb-4">Histórico de Depósitos</h3>
              <div className="max-h-64 overflow-y-auto rounded-md border">
                <table className="min-w-full bg-white">
                  <thead className="sticky top-0 bg-gray-100 z-10">
                    <tr className="text-left text-gray-600">
                      <th className="px-4 py-3">Data</th>
                      <th className="px-4 py-3">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transacoes.map((t) => (
                      <tr key={t.idTransacao} className="border-t">
                        <td className="px-4 py-3 text-gray-400">{new Date(t.dataTransacao).toLocaleDateString('pt-BR')}</td>
                        <td className="px-4 py-3 text-green-600 font-semibold">
                          +R$ {Number(t.valor).toFixed(2).replace('.', ',')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
        {mostrarPopup && (
            <PopupSenha
                senha={senha}
                onChangeSenha={(e) => setSenha(e.target.value)}
                onCancelar={fecharPopup}
                onConfirmar={confirmarDeposito}
            />
            )}
        </div>
    </Header>

    
  );
}