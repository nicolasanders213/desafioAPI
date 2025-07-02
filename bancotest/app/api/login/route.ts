import { NextRequest, NextResponse } from 'next/server';
import { connection } from '../../database/db';
import { validarCPF } from '../../utils/cpf-validation';

export async function POST(req: NextRequest) {
  try {
    const { cpf, senha } = await req.json();

    if (!cpf || !senha) {
      return NextResponse.json(
        { success: false, message: 'CPF e senha são obrigatórios' },
        { status: 400 }
      );
    }

    
    if (!validarCPF(cpf)) {
      return NextResponse.json(
        { success: false, message: 'CPF inválido' },
        { status: 400 }
      );
    }

    const conn = await connection.getConnection();
    const cpfLimpo = cpf.replace(/\D/g, '');
    const [rows]: any = await conn.query(
      'SELECT * FROM Pessoas WHERE cpf = ? AND senha = ?',
      [cpfLimpo, senha]
    );
    conn.release();

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Credenciais inválidas' },
        { status: 401 }
      );
    }
    const response = NextResponse.json({ success: true });

    response.cookies.set('usernameCpf', cpfLimpo, {
      path: '/',
      httpOnly: true,
      maxAge: 60 * 60 * 24, // 1 dia
    });

    return response;

  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno no servidor' },
      { status: 500 }
    );
  }
}
