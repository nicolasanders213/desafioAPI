'use client';

import { useEffect } from 'react';
import { Dialog } from './components/dialog';
import { Slider } from './components/slider';
import { Button } from './components/button';

interface PopupLimiteProps {
  mostrar: boolean;
  onFechar: () => void;
  limiteAtual: number;
  novoLimite: number;
  setNovoLimite: (valor: number) => void;
  onSalvar: () => void;
}

export default function PopupLimite({
  mostrar,
  onFechar,
  limiteAtual,
  novoLimite,
  setNovoLimite,
  onSalvar,
}: PopupLimiteProps) {
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const dialog = document.getElementById('popup-limite');
      if (dialog && !dialog.contains(e.target as Node)) {
        onFechar();
      }
    };

    if (mostrar) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [mostrar, onFechar]);

  if (!mostrar) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        id="popup-limite"
        className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative"
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Defina um novo limite de saque diário</h3>

        <div className="text-gray-600 text-sm mb-4">
          Limite atual: <strong>R$ {limiteAtual.toFixed(2).replace('.', ',')}</strong>
        </div>

        <div className="flex flex-col gap-2 mb-4">
          <Slider
            min={0}
            max={10000}
            step={50}
            value={[novoLimite]}
            onValueChange={(val: number[]) => setNovoLimite(val[0])}
          />
          <div className="text-right text-green-700 font-semibold">
            R$ {novoLimite.toFixed(2).replace('.', ',')}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onFechar}>Cancelar</Button>
          <Button className="bg-green-600 text-white" onClick={onSalvar}>Confirmar</Button>
        </div>
      </div>
    </div>
  );
}
