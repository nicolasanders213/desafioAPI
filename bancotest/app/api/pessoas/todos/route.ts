import { NextResponse } from 'next/server';
import { buscarTodasPessoas } from '@/app/services/database/pessoaService';

export async function GET() {
  try {
    const pessoas = await buscarTodasPessoas();
    return NextResponse.json(pessoas);
  } catch (error) {
    console.error('Erro ao buscar pessoas:', error);
    return NextResponse.json({ erro: 'Erro interno ao buscar pessoas' }, { status: 500 });
  }
}