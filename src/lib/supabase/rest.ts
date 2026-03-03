import "server-only";

const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function request(path: string, init: RequestInit = {}) {
  const res = await fetch(`${baseUrl}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: serviceRole,
      Authorization: `Bearer ${serviceRole}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  if (res.status === 204) return null;
  return res.json();
}

export const db = {
  select: (path: string) => request(path),
  insert: (table: string, body: unknown) => request(`${table}`, { method: "POST", body: JSON.stringify(body), headers: { Prefer: "return=representation" } }),
  update: (path: string, body: unknown) => request(path, { method: "PATCH", body: JSON.stringify(body), headers: { Prefer: "return=representation" } }),
  remove: (path: string) => request(path, { method: "DELETE", headers: { Prefer: "return=minimal" } }),
  count: async (table: string, filter = "") => {
    const res = await fetch(`${baseUrl}/rest/v1/${table}?select=id${filter ? `&${filter}` : ""}`, {
      headers: { apikey: serviceRole, Authorization: `Bearer ${serviceRole}`, Prefer: "count=exact" },
      cache: "no-store",
    });
    const countHeader = res.headers.get("content-range") || "0/0";
    return Number(countHeader.split("/")[1] || 0);
  },
};
