import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connection } from '@/app/database/db';
import { buscarContaPorCpf } from '@/app/services/database/pessoaService';

export async function POST(req: NextRequest) {
  const { valor, senha } = await req.json();
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
      `SELECT saldo, flagAtivo, p.senha FROM Contas c JOIN Pessoas p ON c.idPessoa = p.idPessoa WHERE idConta = ?`,
      [idConta]
    );

    if (!contaRows.length) {
      await conn.rollback();
      return NextResponse.json({ erro: 'Conta inexistente.' }, { status: 404 });
    }

    const senhaCorreta = contaRows[0].senha;

    if (senhaCorreta.trim() !== senha.trim()) {
      await conn.rollback();
      return NextResponse.json({ erro: 'Senha incorreta.' }, { status: 403 });
    }

    const isAtiva = Boolean(contaRows[0].flagAtivo);
    if (!isAtiva) {
      await conn.rollback();
      return NextResponse.json({ erro: 'Conta bloqueada, por favor desbloqueie a conta no menu de configurações.' }, { status: 403 });
    }

    const saldoAtual = parseFloat(contaRows[0].saldo);
    const novoSaldo = saldoAtual + parseFloat(valor);

    console.log(`Atualizando conta ${idConta}: ${saldoAtual} + ${valor} = ${novoSaldo}`);

    await conn.query(
      `UPDATE Contas SET saldo = ? WHERE idConta = ?`,
      [novoSaldo, idConta]
    );

    await conn.query(
      `INSERT INTO Transacoes (idConta, valor, dataTransacao) VALUES (?, ?, NOW())`,
      [idConta, valor]
    );

    await conn.commit();

    return NextResponse.json({
      sucesso: true,
      novoSaldo: novoSaldo,
      valorDepositado: parseFloat(valor)
    });

  } catch (error) {
    await conn.rollback();
    console.error('Erro no depósito:', error);
    return NextResponse.json({ erro: 'Erro ao processar depósito' }, { status: 500 });
  } finally {
    conn.release();
  }
}
