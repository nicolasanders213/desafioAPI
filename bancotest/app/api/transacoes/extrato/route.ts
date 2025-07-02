import { NextRequest, NextResponse } from 'next/server';
import { connection } from '@/app/database/db';
import { buscarContaPorCpf } from '@/app/services/database/pessoaService';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const inicio = url.searchParams.get('inicio') ?? undefined;
  const fim = url.searchParams.get('fim') ?? undefined;

  const cookieStore = await cookies();
  const cpf = cookieStore.get('usernameCpf')?.value;

  if (!cpf) {
    return new Response(JSON.stringify({ erro: 'Parâmetro idConta é obrigatório' }), { status: 400 });
  }

  try {
    const dados = await buscarContaPorCpf(cpf);
    const idConta = dados?.conta?.idConta;

    if (!idConta) {
      return NextResponse.json({ erro: 'Conta não encontrada.' }, { status: 404 });
    }

    let query = `
      SELECT dataTransacao, valor
      FROM Transacoes
      WHERE idConta = ?
    `;
    const params: any[] = [idConta];

    if (inicio && fim) {
      query += ` AND dataTransacao BETWEEN ? AND ?`;
      params.push(`${inicio} 00:00:00`, `${fim} 23:59:59`);
    } else {
      query += ` AND dataTransacao >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`;
    }

    query += ` ORDER BY dataTransacao DESC`;

    const [rows]: any = await connection.query(query, params);
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar extrato:', error);
    return new Response(JSON.stringify({ erro: 'Erro ao buscar extrato' }), { status: 500 });
  }
}
