import type { NextApiRequest, NextApiResponse } from 'next';
import { connection } from '@/app/database/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { idConta } = req.query;

  try {
    const [rows]: any = await connection.query(
      `SELECT saldo FROM Contas WHERE idConta = ? AND flagAtivo = true`,
      [idConta]
    );

    if (!rows.length) {
      return res.status(404).json({ erro: 'Conta não encontrada ou inativa' });
    }

    res.status(200).json({ saldo: rows[0].saldo });
  } catch (error) {
    console.error('Erro ao consultar saldo:', error);
    res.status(500).json({ erro: 'Erro ao consultar saldo' });
  }
}