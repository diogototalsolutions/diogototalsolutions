import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const token = (await cookies()).get("dts_access_token")?.value;

  if (!token) redirect("/login");

  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`, {
    headers: {
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) redirect("/login");

  const user = await res.json();
  return { user };
}
