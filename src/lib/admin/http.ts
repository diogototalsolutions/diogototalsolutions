import { NextResponse } from "next/server";

export function jsonError(status: number, code: string, message: string) {
  return NextResponse.json({ error: { code, message } }, { status });
}

export function jsonSuccess<T>(data: T, init?: { status?: number; meta?: Record<string, unknown> }) {
  return NextResponse.json({ data, ...(init?.meta ? { meta: init.meta } : {}) }, { status: init?.status ?? 200 });
}

export function normalizeOptionalString(value?: string | null) {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function parsePagination(params: URLSearchParams, defaultPageSize = 10) {
  const page = Math.max(1, Number(params.get("page") || 1));
  const pageSize = Math.min(100, Math.max(1, Number(params.get("pageSize") || defaultPageSize)));
  const skip = (page - 1) * pageSize;
  const take = pageSize;
  return { page, pageSize, skip, take };
}
