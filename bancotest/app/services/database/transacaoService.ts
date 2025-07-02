import { connection } from '@/app/database/db';

export async function registrarTransacao(idConta: number, valor: number): Promise<{ sucesso: boolean; novoSaldo?: number; erro?: string }> {
  const conn = await connection.getConnection();
  try {
    await conn.beginTransaction();

    const [contaRows]: any = await conn.query(
      `SELECT saldo, limiteSaqueDiario FROM Contas WHERE idConta = ? AND flagAtivo = true`,
      [idConta]
    );

    if (!contaRows.length) {
      await conn.rollback();
      return { sucesso: false, erro: 'Conta não encontrada ou inativa' };
    }

    const conta = contaRows[0];
    const novoSaldo = conta.saldo + valor;

    if (valor < 0 && Math.abs(valor) > conta.limiteSaqueDiario) {
      await conn.rollback();
      return { sucesso: false, erro: 'Saque acima do limite diário' };
    }

    if (novoSaldo < 0) {
      await conn.rollback();
      return { sucesso: false, erro: 'Saldo insuficiente' };
    }

    await conn.query(`INSERT INTO Transacoes (idConta, valor, dataTransacao) VALUES (?, ?, NOW())`, [idConta, valor]);
    await conn.query(`UPDATE Contas SET saldo = ? WHERE idConta = ?`, [novoSaldo, idConta]);

    await conn.commit();
    return { sucesso: true, novoSaldo };
  } catch (error) {
    await conn.rollback();
    console.error('Erro ao registrar transação:', error);
    return { sucesso: false, erro: 'Erro interno ao registrar transação' };
  } finally {
    conn.release();
  }
}

export async function buscarExtrato(idConta: number, inicio?: string, fim?: string) {
  try {
    let query = `SELECT dataTransacao, valor FROM Transacoes WHERE idConta = ?`;
    const params: any[] = [idConta];

    if (inicio && fim) {
      query += ` AND dataTransacao BETWEEN ? AND ?`;
      params.push(inicio, fim);
    } else {
      query += ` AND dataTransacao >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`;
    }

    query += ` ORDER BY dataTransacao DESC`;

    const [rows]: any = await connection.query(query, params);
    return rows;
  } catch (error) {
    console.error('Erro ao buscar extrato:', error);
    return [];
  }
}
