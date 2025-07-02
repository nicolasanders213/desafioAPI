import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Logout efetuado' });

  
   response.cookies.set('usernameCpf', '', {
    path: '/',
    httpOnly: true,
    maxAge: 0,
  });

  return response;
}