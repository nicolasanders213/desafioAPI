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

    if(dados?.conta?.flagAtivo == false){
      await conn.rollback();
      return NextResponse.json({ erro: 'Conta bloqueada, por favor desbloqueie a conta no menu de configurações.' }, { status: 500 });
    }

    const [contaRows]: any = await conn.query(
      `SELECT c.saldo, c.limiteSaqueDiario, p.senha FROM Contas c JOIN Pessoas p ON c.idPessoa = p.idPessoa WHERE idConta = ?`,
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

    if(parseFloat(valor) > parseFloat(contaRows[0].limiteSaqueDiario)){
        await conn.rollback();
        return NextResponse.json({ erro: 'Valor acima do limite permitido para saque.' }, { status: 500 });
    }

    const saldoAtual = parseFloat(contaRows[0].saldo);
    const limiteSaqueDiarioAtual = parseFloat(contaRows[0].limiteSaqueDiario);
    const novoSaldo = saldoAtual - parseFloat(valor);
    const novoLimiteSaqueDiario = limiteSaqueDiarioAtual - parseFloat(valor);

    if(novoSaldo < 0){
        await conn.rollback();
      return NextResponse.json({ erro: 'Saldo insuficiente para o saque.' }, { status: 500 });
    }

    console.log(`✅ Atualizando conta ${idConta}: ${saldoAtual} - ${valor} = ${novoSaldo}`);

    await conn.query(
      `UPDATE Contas SET saldo = ?, limiteSaqueDiario = ? WHERE idConta = ?`,
      [novoSaldo, novoLimiteSaqueDiario, idConta]
    );

    await conn.query(
      `INSERT INTO Transacoes (idConta, valor, dataTransacao) VALUES (?, ?, NOW())`,
      [idConta, -valor]
    );

    await conn.commit();

    return NextResponse.json({
      sucesso: true,
      novoSaldo: novoSaldo,
      valorSacado: parseFloat(valor)
    });

  } catch (error) {
    await conn.rollback();
    console.error('❌ Erro no saque:', error);
    return NextResponse.json({ erro: 'Erro ao processar saque' }, { status: 500 });
  } finally {
    conn.release();
  }
}