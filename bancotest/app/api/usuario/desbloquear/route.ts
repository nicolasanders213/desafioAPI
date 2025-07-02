  import { NextResponse } from 'next/server';
  import { cookies } from 'next/headers';
  import { connection } from '@/app/database/db';
  import { buscarContaPorCpf } from '@/app/services/database/pessoaService';

  export async function POST() {
    const cookieStore = await cookies();
    const cpf = cookieStore.get('usernameCpf')?.value;

    if (!cpf) {
      return NextResponse.json({ erro: 'CPF não encontrado na sessão' }, { status: 401 });
    }

    try {
      const pessoa = await buscarContaPorCpf(cpf);

      if (!pessoa || !pessoa.conta) {
        return NextResponse.json({ erro: 'Usuário não encontrado' }, { status: 404 });
      }

      await connection.query(
        'UPDATE Contas SET flagAtivo = true WHERE idConta = ?',
        [pessoa.conta.idConta]
      );

      return NextResponse.json({ mensagem: 'Conta desbloqueada com sucesso.' });
    } catch (error) {
      console.error('Erro ao desbloquear conta:', error);
      return NextResponse.json({ erro: 'Erro ao desbloquear a conta.' }, { status: 500 });
    }
  }