'use client';

import { useEffect, useState } from 'react';
import Header from '../../ui/header';
import { User, Lock, Unlock, LogOut } from 'lucide-react';
import { toast } from 'react-hot-toast';
import DadosPopup from './ui/dados-popup';
import PopupLimite from './ui/limite-popup';
import Switch from './ui/switch';
import { useRouter } from 'next/navigation';
import { cpfFormatted } from '../../utils/cpf-formatted';

interface Usuario {
  nome: string;
  cpf: string;
  dataNascimento: string;
  saldo: number;
  limiteSaqueDiario: number;
  flagAtivo: boolean;
  tipoConta: number;
  tipoContaDescricao: string;
  dataCriacao: string;
}

export default function ConfiguracoesPage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [mostrarPopupLimite, setMostrarPopupLimite] = useState(false);
  const [novoLimite, setNovoLimite] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const res = await fetch('/api/usuario');
        const data = await res.json();
        setUsuario(data);
        setNovoLimite(data.limiteSaqueDiario);
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      }
    };

    fetchUsuario();
  }, []);

  const toggleConta = async (valor: boolean) => {
    try {
      const res = await fetch(`/api/usuario/${valor ? 'desbloquear' : 'bloquear'}`, { method: 'POST' });
      if (res.ok) {
        toast.success(`Conta ${valor ? 'desbloqueada' : 'bloqueada'} com sucesso.`);
        setUsuario((prev) => prev ? { ...prev, flagAtivo: valor } : prev);
      } else {
        toast.error('Erro ao alterar o status da conta.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Erro ao processar a solicitação.');
    }
  };

  const salvarNovoLimite = async () => {
    try {
      const res = await fetch('/api/usuario/limite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ novoLimite }),
      });

      if (res.ok) {
        toast.success('Limite atualizado com sucesso.');
        setUsuario((prev) => prev ? { ...prev, limiteSaqueDiario: novoLimite } : prev);
        setMostrarPopupLimite(false);
      } else {
        toast.error('Erro ao atualizar o limite.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Erro ao processar a solicitação.');
    }
  };

  const logout = async () => {
    const res = await fetch('/api/logout', { method: 'POST' });
    if (res.ok) {
      router.push('/login');
    }
  };

  return (
    <Header desc="Configurações" mostrarControles={false} voltarVisivel={true}>
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="text-gray-600 w-8 h-8" />
            </div>
            <div>
              <p className="text-base font-semibold text-gray-800">{usuario?.nome}</p>
              <p className="text-sm text-gray-500">{cpfFormatted(usuario?.cpf || '')}</p>
            </div>
          </div>
          <button
            onClick={() => setMostrarPopup(true)}
            className="text-sm text-blue-600 hover:underline"
          >
            Ver dados da conta
          </button>
        </div>

        <hr />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {usuario?.flagAtivo ? (
              <>
                <Unlock className="text-green-600 w-4 h-4" />
                <span className="text-green-700 font-medium">Conta Ativa</span>
              </>
            ) : (
              <>
                <Lock className="text-red-600 w-4 h-4" />
                <span className="text-red-600 font-medium">Conta Bloqueada</span>
              </>
            )}
          </div>
          <Switch checked={usuario?.flagAtivo} onCheckedChange={toggleConta} />
        </div>

        <hr />

        <div>
          <span className="text-gray-700 font-medium block mb-1">Limite diário de saque</span>
          <p className="text-sm text-gray-600 mb-2">
            R$ {usuario?.limiteSaqueDiario?.toFixed(2).replace('.', ',')}
          </p>
          <button
            onClick={() => setMostrarPopupLimite(true)}
            className="text-sm text-blue-600 hover:underline"
          >
            Definir novo limite
          </button>
        </div>

        <hr />

        <div className="pt-4">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 border border-red-600 text-red-600 bg-white hover:bg-red-50 font-semibold px-6 py-3 rounded-lg shadow transition duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span>Sair</span>
          </button>
        </div>

        <DadosPopup usuario={usuario} mostrar={mostrarPopup} onFechar={() => setMostrarPopup(false)} />

        <PopupLimite
          mostrar={mostrarPopupLimite}
          onFechar={() => setMostrarPopupLimite(false)}
          limiteAtual={usuario?.limiteSaqueDiario || 0}
          novoLimite={novoLimite}
          setNovoLimite={setNovoLimite}
          onSalvar={salvarNovoLimite}
        />
      </div>
    </Header>
  );
}
