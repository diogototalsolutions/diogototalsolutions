import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) return NextResponse.json({ message: "Dados inválidos" }, { status: 400 });

  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(parsed.data),
  });

  const data = await res.json();
  if (!res.ok) return NextResponse.json({ message: "Credenciais inválidas" }, { status: 401 });

  const response = NextResponse.json({ ok: true });
  response.cookies.set("dts_access_token", data.access_token, { httpOnly: true, secure: true, sameSite: "lax", path: "/" });
  return response;
}
