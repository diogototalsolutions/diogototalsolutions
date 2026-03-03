import { NextRequest, NextResponse } from "next/server";
import { QuoteRequestStatus } from "@prisma/client";
import { sendQuoteNotificationEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { contactFormSchema } from "@/lib/validations";

function getClientIp(req: NextRequest) {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  const realIp = req.headers.get("x-real-ip");
  return realIp || "unknown";
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateLimit = checkRateLimit(ip);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, message: "Demasiados pedidos. Tente novamente em alguns minutos." },
        { status: 429 },
      );
    }

    const body = await req.json();
    const parsed = contactFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Dados inválidos. Verifique os campos e tente novamente.",
          errors: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const payload = parsed.data;

    if (payload.honey && payload.honey.trim().length > 0) {
      return NextResponse.json(
        {
          success: true,
          message: "Pedido recebido com sucesso.",
        },
        { status: 200 },
      );
    }

    const quoteRequest = await prisma.quoteRequest.create({
      data: {
        name: payload.name,
        company: payload.company || null,
        email: payload.email,
        phone: payload.phone || null,
        subject: payload.subject,
        message: payload.message,
        consent: payload.consent,
        status: QuoteRequestStatus.NOVO,
      },
    });

    let emailWarning: string | null = null;

    try {
      await sendQuoteNotificationEmail({
        name: quoteRequest.name,
        company: quoteRequest.company || undefined,
        email: quoteRequest.email,
        phone: quoteRequest.phone || undefined,
        subject: quoteRequest.subject,
        message: quoteRequest.message,
        createdAt: quoteRequest.createdAt,
      });
    } catch (emailError) {
      console.error("[CONTACT_EMAIL_ERROR]", emailError);
      emailWarning = "O pedido foi registado, mas houve uma falha no envio imediato do email.";
    }

    return NextResponse.json(
      {
        success: true,
        message: "Pedido enviado com sucesso. A equipa DTS irá responder em breve.",
        warning: emailWarning,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[CONTACT_API_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        message: "Não foi possível processar o pedido neste momento. Tente novamente mais tarde.",
      },
      { status: 500 },
    );
  }
}
