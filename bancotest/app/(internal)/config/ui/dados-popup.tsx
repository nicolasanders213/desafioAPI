import { Usuario } from "../../../types/types";
import { cpfFormatted } from "../../../utils/cpf-formatted";

interface Props {
  usuario: Usuario | null;
  mostrar: boolean;
  onFechar: () => void;
}

export default function DadosPopup({ usuario, mostrar, onFechar }: Props) {
  if (!mostrar || !usuario) return null;

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onFechar();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20"
      onClick={handleOutsideClick}
    >
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 relative">
        <button
          onClick={onFechar}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        >
          Voltar
        </button>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Informações da Conta</h3>
        <div className="space-y-2 text-gray-700">
          <p><strong>Nome:</strong> {usuario.nome}</p>
          <p><strong>CPF:</strong> {cpfFormatted(usuario?.cpf || '')}</p>
          <p><strong>Data de Nascimento:</strong> {new Date(usuario.dataNascimento).toLocaleDateString('pt-BR')}</p>
          <p><strong>Limite Saque Diário:</strong> R$ {Number(usuario.limiteSaqueDiario).toFixed(2).replace('.', ',')}</p>
          <p><strong>Status da Conta:</strong> {usuario.flagAtivo ? 'Ativa' : 'Bloqueada'}</p>
          <p><strong>Tipo da Conta:</strong> {usuario.tipoContaDescricao}</p>
          <p><strong>Data de Criação:</strong> {new Date(usuario.dataCriacao).toLocaleString('pt-BR')}</p>
        </div>
      </div>
    </div>
  );
}
