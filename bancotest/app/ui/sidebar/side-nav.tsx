import { useRouter, usePathname } from 'next/navigation';
import {
  Home,
  BanknoteArrowUp,
  BanknoteArrowDown,
  Newspaper,
  Settings,
  LogOut,
} from 'lucide-react';
import { postLogout } from './action';

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();

  const navigate = (path: string) => {
    router.push(path);
    if (onClose) onClose();
  };

  const logout = async () => {
    if (confirm('Deseja realmente sair?')) {
      await postLogout();
      router.push('/login');
    }
  };

  const navItemClass = (path: string) =>
    `flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer transition hover:bg-green-100 text-gray-700 ${
      pathname === path ? 'bg-green-200 font-semibold' : ''
    }`;

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-white border-r shadow-md z-50 flex flex-col justify-between">
      {/* Menu principal */}
      <nav className="flex flex-col p-6 space-y-4">
        <div onClick={() => navigate('/home')} className={navItemClass('/home')}>
          <Home className="w-5 h-5" /> Início
        </div>
        <div onClick={() => navigate('/deposito')} className={navItemClass('/deposito')}>
          <BanknoteArrowUp className="w-5 h-5" /> Depósito
        </div>
        <div onClick={() => navigate('/saque')} className={navItemClass('/saque')}>
          <BanknoteArrowDown className="w-5 h-5" /> Saque
        </div>
        <div onClick={() => navigate('/extrato')} className={navItemClass('/extrato')}>
          <Newspaper className="w-5 h-5" /> Extrato
        </div>
      </nav>

      {/* Rodapé fixo */}
      <div className="p-6 border-t space-y-4">
        <div onClick={() => navigate('/config')} className={navItemClass('/config')}>
          <Settings className="w-5 h-5" /> Configurações
        </div>
        <div
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer text-red-600 hover:bg-red-100"
        >
          <LogOut className="w-5 h-5" /> Sair
        </div>
      </div>
    </aside>
  );
}
