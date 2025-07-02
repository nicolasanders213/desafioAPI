import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connection } from '@/app/database/db';
import { buscarContaPorCpf } from '@/app/services/database/pessoaService';

export async function POST(req: NextRequest) {
  const { novoLimite } = await req.json();
  const cookieStore = await cookies();
  const cpf = cookieStore.get('usernameCpf')?.value;

  if (!cpf) {
    return NextResponse.json({ erro: 'Usuário não autenticado.' }, { status: 401 });
  }

  const conn = await connection.getConnection();

  try {
    await conn.beginTransaction();

    const dados = await buscarContaPorCpf(cpf);
    const idConta = dados?.conta?.idConta;

    if (!idConta) {
      await conn.rollback();
      return NextResponse.json({ erro: 'Conta não encontrada.' }, { status: 404 });
    }

    const [contaRows]: any = await conn.query(
      `SELECT flagAtivo FROM Contas WHERE idConta = ?`,
      [idConta]
    );

    const flagAtivo = Boolean(contaRows[0]?.flagAtivo);

    if (!flagAtivo) {
      await conn.rollback();
      return NextResponse.json({ erro: 'Conta bloqueada. Desbloqueie a conta para alterar o limite.' }, { status: 403 });
    }

    await conn.query(
      `UPDATE Contas SET limiteSaqueDiario = ? WHERE idConta = ?`,
      [novoLimite, idConta]
    );

    await conn.commit();

    return NextResponse.json({
      sucesso: true,
      novoLimite: parseFloat(novoLimite),
      mensagem: 'Limite alterado com sucesso.'
    });

  } catch (error) {
    await conn.rollback();
    console.error('❌ Erro ao alterar limite:', error);
    return NextResponse.json({ erro: 'Erro ao alterar o limite.' }, { status: 500 });
  } finally {
    conn.release();
  }
}
