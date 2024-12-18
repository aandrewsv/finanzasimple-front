// src/app/api/request-access/route.ts
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    const data = await resend.emails.send({
      from: 'FinanzaSimple <onboarding@resend.dev>',
      to: [process.env.ADMIN_EMAIL || ''],
      subject: 'Solicitud de acceso a FinanzaSimple',
      html: `
        <h2>Nueva solicitud de acceso</h2>
        <p>Administrador, has recibido una nueva solicitud de acceso del siguiente correo: <br> ${email}</p><br>
        <p>Saludos,<br>Equipo FinanzaSimple</p>
      `,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}