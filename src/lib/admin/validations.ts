import { QuoteRequestStatus } from "@prisma/client";
import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const clientCreateSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email().optional().or(z.literal("")),
  phone: z.string().trim().optional().or(z.literal("")),
  company: z.string().trim().optional().or(z.literal("")),
  nif: z.string().trim().optional().or(z.literal("")),
  address: z.string().trim().optional().or(z.literal("")),
  notes: z.string().trim().optional().or(z.literal("")),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

export const clientUpdateSchema = clientCreateSchema.partial().refine((data) => Object.keys(data).length > 0, "Sem dados para atualizar");

export const serviceCreateSchema = z.object({
  name: z.string().trim().min(2),
  slug: z.string().trim().min(3).regex(slugRegex),
  description: z.string().trim().min(10),
  basePrice: z.union([z.number().nonnegative(), z.string().trim().min(1), z.null()]).optional(),
  active: z.boolean().default(true),
  category: z.string().trim().optional().or(z.literal("")),
});

export const serviceUpdateSchema = serviceCreateSchema.partial().refine((data) => Object.keys(data).length > 0, "Sem dados para atualizar");

export const clientServiceCreateSchema = z.object({
  serviceId: z.string().cuid(),
  notes: z.string().trim().optional().or(z.literal("")),
  startDate: z.string().datetime().optional().or(z.literal("")),
  status: z.enum(["ACTIVE", "PAUSED", "COMPLETED"]).default("ACTIVE"),
});

export const clientServiceUpdateSchema = z
  .object({
    notes: z.string().trim().optional().or(z.literal("")),
    status: z.enum(["ACTIVE", "PAUSED", "COMPLETED"]).optional(),
    startDate: z.string().datetime().optional().or(z.literal("")),
  })
  .refine((data) => Object.keys(data).length > 0, "Sem dados para atualizar");

export const quoteRequestUpdateSchema = z
  .object({
    status: z.nativeEnum(QuoteRequestStatus).optional(),
    internalNotes: z.string().trim().optional().or(z.literal("")),
  })
  .refine((data) => Object.keys(data).length > 0, "Sem dados para atualizar");
