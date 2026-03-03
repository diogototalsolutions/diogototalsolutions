import { NextRequest, NextResponse } from "next/server";
import { sendQuoteNotificationEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";
import { db } from "@/lib/supabase/rest";
import { contactFormSchema } from "@/lib/validations";

function getClientIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: NextRequest) {
  if (!checkRateLimit(getClientIp(req)).allowed) return NextResponse.json({ success: false, message: "Demasiados pedidos." }, { status: 429 });

  const parsed = contactFormSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ success: false, message: "Dados inválidos." }, { status: 400 });

  const payload = parsed.data;
  if (payload.honey?.trim()) return NextResponse.json({ success: true, message: "Pedido recebido." });

  await db.insert("quote_requests", {
    name: payload.name,
    company: payload.company || null,
    email: payload.email,
    phone: payload.phone || null,
    subject: payload.subject,
    message: payload.message,
    consent: payload.consent,
    status: "novo",
  });

  let warning: string | null = null;
  try {
    await sendQuoteNotificationEmail({ ...payload, createdAt: new Date() });
  } catch {
    warning = "Pedido guardado, mas o email falhou.";
  }

  return NextResponse.json({ success: true, message: "Pedido enviado com sucesso.", warning }, { status: 201 });
}
