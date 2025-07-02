import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  criarPessoaComConta,
  buscarContaPorCpf,
} from '@/app/services/database/pessoaService';
import { validarCPF } from '@/app/utils/cpf-validation';

export async function POST(req: NextRequest) {
  const { nome, cpf, dataNascimento, senha } = await req.json();

  try {
    
        if (!cpf || !senha || !nome || !dataNascimento) {
          return NextResponse.json(
            { success: false, message: 'Preencha todos os campos' },
            { status: 400 }
          );
        }
    
        
        if (!validarCPF(cpf)) {
          return NextResponse.json(
            { success: false, message: 'CPF inválido' },
            { status: 400 }
          );
        }
    const idPessoa = await criarPessoaComConta({ nome, cpf, dataNascimento, senha });
    return NextResponse.json({ sucesso: true, idPessoa });
  } catch (error: any) {
    console.error('Erro ao cadastrar pessoa e conta:', error);
    const msg = error?.code === 'ER_DUP_ENTRY' ? 'CPF já cadastrado' : 'Erro ao cadastrar';
    return NextResponse.json({ erro: msg }, { status: 500 });
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const cpf = cookieStore.get('usernameCpf')?.value;

    if (!cpf) {
      return NextResponse.json({ error: 'Usuário não autenticado.' }, { status: 401 });
    }

    const dados = await buscarContaPorCpf(cpf);

    if (!dados) {
      return NextResponse.json({ error: 'Pessoa ou conta não encontrada.' }, { status: 404 });
    }

    return NextResponse.json({
  nome: dados.nome,
  saldo: dados.conta.saldo,
});
  } catch (error) {
    console.error('Erro na API /pessoas:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}