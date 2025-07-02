import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { buscarUsuarioCompletoPorCpf } from '@/app/services/database/usuarioService';

export async function GET() {
  const cookieStore = await cookies();
  const cpf = cookieStore.get('usernameCpf')?.value;

  if (!cpf) {
    return NextResponse.json({ erro: 'CPF não encontrado na sessão' }, { status: 401 });
  }

  try {
    const usuario = await buscarUsuarioCompletoPorCpf(cpf);

    if (!usuario) {
      return NextResponse.json({ erro: 'Usuário não encontrado' }, { status: 404 });
    }

    return NextResponse.json(usuario);
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error);
    return NextResponse.json({ erro: 'Erro interno do servidor' }, { status: 500 });
  }
}