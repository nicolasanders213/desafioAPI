'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, Eye, EyeOff, Settings, ArrowLeft } from 'lucide-react';
import Sidebar from './sidebar/side-nav';

interface HeaderProps {
  desc: string;
  children:
    | React.ReactNode
    | ((props: { saldoVisivel: boolean }) => React.ReactNode);
  mostrarControles?: boolean;
  voltarVisivel?: boolean;
}

export default function Header({
  desc,
  children,
  mostrarControles = true,
  voltarVisivel = false,
}: HeaderProps) {
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [saldoVisivel, setSaldoVisivel] = useState(true);
  const router = useRouter();

  const toggleSidebar = () => setSidebarAberta(!sidebarAberta);
  const toggleSaldo = () => setSaldoVisivel((prev) => !prev);

  return (
    <div className="h-screen overflow-hidden flex">
      {sidebarAberta && !voltarVisivel && (
        <div className="fixed top-0 left-0 h-full w-64 z-30">
          <Sidebar onClose={() => setSidebarAberta(false)} />
        </div>
      )}

      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarAberta && !voltarVisivel ? 'ml-64' : ''
        }`}
      >
        <header
          className="flex items-center justify-between text-white px-6 py-4 shadow-md fixed top-0 left-0 right-0 z-20"
          style={{
            backgroundImage: 'linear-gradient(to right, #16a34a, #ffffff)',
            marginLeft: sidebarAberta && !voltarVisivel ? '16rem' : 0,
            width: sidebarAberta && !voltarVisivel ? 'calc(100% - 16rem)' : '100%',
            transition: 'all 0.3s ease',
          }}
        >
          <div className="flex items-center gap-4">
            {voltarVisivel ? (
              <ArrowLeft
                className="w-6 h-6 cursor-pointer text-white"
                onClick={() => router.back()}
              />
            ) : (
              <Menu
                className="w-6 h-6 cursor-pointer text-white"
                onClick={toggleSidebar}
              />
            )}
            <h1 className="text-xl font-semibold text-white">{desc}</h1>
          </div>

          {mostrarControles && !voltarVisivel && (
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSaldo}
                className="text-green-600 hover:text-green-800"
              >
                {saldoVisivel ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
              <Settings
                className="w-6 h-6 cursor-pointer text-green-700"
                onClick={() => router.push('/config')}
              />
            </div>
          )}
        </header>

        <main className="pt-16 h-[calc(100vh-4rem)] overflow-y-auto p-6 bg-gray-50">
          {typeof children === 'function'
            ? children({ saldoVisivel })
            : children}
        </main>
      </div>
    </div>
  );
}
