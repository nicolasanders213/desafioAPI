// action.ts
'use server';

import { cookies } from 'next/headers';
import { ToastType } from '../../hooks/toast';
import { z } from 'zod';
import { connection } from '../../database/db';
import { validarCPF } from '../../utils/cpf-validation';

const FormSchema = z.object({
  username: z
    .string()
    .nonempty({ message: 'CPF é obrigatório' })
    .refine((cpf) => validarCPF(cpf), { message: 'CPF inválido' }),
  password: z.string().nonempty({ message: 'Senha é obrigatória' }),
});

export type State = {
  errors?: { username?: string[]; password?: string[] };
  toast?: { type: ToastType; message: string };
  success?: boolean;
};

export const postSubmit = async (
  _prevState: State,
  formData: FormData
): Promise<State> => {
  const parsed = FormSchema.safeParse({
    username: formData.get('username'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { username, password } = parsed.data;

  try {
    const conn = await connection.getConnection();
    const [rows] = await conn.query(
      'SELECT * FROM Pessoas WHERE cpf = ? AND senha = ?',
      [username, password]
    );
    conn.release();

    if ((rows as any[]).length === 0) {
      return { toast: { type: 'error', message: 'CPF ou senha inválidos.' } };
    }

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'usernameCpf',
      value: username,
      httpOnly: true,
      path: '/',
      maxAge: 24 * 60 * 60,
    });

    // Return success flag
    return { success: true };
  } catch (error) {
    console.error('Erro no login:', error);
    return {
      toast: {
        type: 'error',
        message: 'Erro ao realizar login. Tente novamente.',
      },
    };
  }
};
