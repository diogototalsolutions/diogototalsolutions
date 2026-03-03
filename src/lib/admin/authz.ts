import "server-only";
import { auth } from "@/auth";

export async function requireStaff() {
  const session = await auth();
  if (!session?.user) {
    return { error: { status: 401, message: "Não autenticado." } } as const;
  }
  if (session.user.role !== "STAFF" && session.user.role !== "ADMIN") {
    return { error: { status: 403, message: "Sem permissão." } } as const;
  }
  return { session } as const;
}

export async function requireAdmin() {
  const result = await requireStaff();
  if ("error" in result) return result;
  if (result.session.user.role !== "ADMIN") {
    return { error: { status: 403, message: "Apenas ADMIN pode executar esta ação." } } as const;
  }
  return result;
}
