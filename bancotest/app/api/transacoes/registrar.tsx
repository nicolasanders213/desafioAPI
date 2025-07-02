import type { NextApiRequest, NextApiResponse } from 'next';
import { connection } from '@/app/database/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Método não permitido');

  const { idConta, valor } = req.body;

  if (!idConta || typeof valor !== 'number') {
    return res.status(400).json({ erro: 'idConta e valor são obrigatórios' });
  }

  try {
    const conn = await connection.getConnection();
    await conn.beginTransaction();

    const [contaRows]: any = await conn.query(
      `SELECT saldo, limiteSaqueDiario FROM Contas WHERE idConta = ? AND flagAtivo = true`,
      [idConta]
    );

    if (!contaRows.length) {
      await conn.rollback();
      return res.status(404).json({ erro: 'Conta não encontrada ou inativa' });
    }

    const conta = contaRows[0];
    const novoSaldo = conta.saldo + valor;

    // Verificações:
    if (valor < 0 && Math.abs(valor) > conta.limiteSaqueDiario) {
      await conn.rollback();
      return res.status(400).json({ erro: 'Saque acima do limite diário' });
    }

    if (novoSaldo < 0) {
      await conn.rollback();
      return res.status(400).json({ erro: 'Saldo insuficiente' });
    }

    // Registrar transação
    await conn.query(
      `INSERT INTO Transacoes (idConta, valor) VALUES (?, ?)`,
      [idConta, valor]
    );

    // Atualizar saldo
    await conn.query(
      `UPDATE Contas SET saldo = ? WHERE idConta = ?`,
      [novoSaldo, idConta]
    );

    await conn.commit();
    conn.release();

    res.status(201).json({ sucesso: true, novoSaldo });
  } catch (error) {
    console.error('Erro ao registrar transação:', error);
    res.status(500).json({ erro: 'Erro ao registrar transação' });
  }
}
