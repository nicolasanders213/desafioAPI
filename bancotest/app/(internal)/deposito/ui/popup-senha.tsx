'use client';

type Props = {
  senha: string;
  onChangeSenha: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancelar: () => void;
  onConfirmar: () => void;
};

export default function PopupSenha({
  senha,
  onChangeSenha,
  onCancelar,
  onConfirmar,
}: Props) {
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onCancelar}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-sm rounded-xl shadow-lg p-6 relative"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Digite a senha para confirmar o depósito
        </h3>

        <input
          type="password"
          value={senha}
          onChange={onChangeSenha}
          className={"w-full text-gray-600 border-2 rounded-lg px-4 py-2 focus:outline-none border-green-700"}
        />
        <div className="flex justify-end mt-4 gap-2">
          <button
            onClick={onCancelar}
            className="border border-red-500 text-red-500 px-4 py-2 rounded-lg hover:bg-red-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
