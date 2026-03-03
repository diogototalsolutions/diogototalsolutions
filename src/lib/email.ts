import "server-only";
import nodemailer from "nodemailer";
import { Resend } from "resend";

type QuoteEmailPayload = {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: Date;
};

function buildEmailBody(payload: QuoteEmailPayload) {
  return [
    "Novo pedido de orçamento/contacto recebido no site da DTS.",
    "",
    `Nome: ${payload.name}`,
    `Empresa: ${payload.company || "N/A"}`,
    `Email: ${payload.email}`,
    `Telefone: ${payload.phone || "N/A"}`,
    `Assunto: ${payload.subject}`,
    `Mensagem: ${payload.message}`,
    `Data/Hora: ${payload.createdAt.toISOString()}`,
  ].join("\n");
}

function resolveToEmail() {
  return process.env.CONTACT_TO_EMAIL || "minedigas@gmail.com";
}

export async function sendQuoteNotificationEmail(payload: QuoteEmailPayload) {
  const to = resolveToEmail();
  const emailSubject = `[DTS] Pedido de Orçamento - ${payload.subject}`;
  const body = buildEmailBody(payload);

  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "DTS Website <onboarding@resend.dev>",
      to,
      subject: emailSubject,
      text: body,
    });
    return { provider: "resend" as const };
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
    throw new Error("Nenhuma configuração de email disponível (RESEND_API_KEY ou SMTP_*). ");
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: Number(smtpPort),
    secure: Number(smtpPort) === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  await transporter.sendMail({
    from: `DTS Website <${smtpUser}>`,
    to,
    subject: emailSubject,
    text: body,
    replyTo: payload.email,
  });

  return { provider: "smtp" as const };
}
