import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connection } from '@/app/database/db';
import { buscarContaPorCpf } from '@/app/services/database/pessoaService';

export async function POST() {
  const cookieStore = await cookies();
  const cpf = cookieStore.get('usernameCpf')?.value;

  if (!cpf) {
    return NextResponse.json({ erro: 'CPF não encontrado na sessão.' }, { status: 401 });
  }

  try {
    const pessoa = await buscarContaPorCpf(cpf);

    if (!pessoa || !pessoa.conta) {
      return NextResponse.json({ erro: 'Conta não encontrada.' }, { status: 404 });
    }

    await connection.query(
      'UPDATE Contas SET flagAtivo = FALSE WHERE idConta = ?',
      [pessoa.conta.idConta]
    );

    return NextResponse.json({ mensagem: 'Conta bloqueada com sucesso.' });
  } catch (error) {
    console.error('Erro ao bloquear conta:', error);
    return NextResponse.json({ erro: 'Erro interno ao bloquear a conta.' }, { status: 500 });
  }
}
