import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(2),
  company: z.string().trim().optional().or(z.literal("")),
  email: z.string().trim().email(),
  phone: z.string().trim().optional().or(z.literal("")),
  subject: z.string().trim().min(3),
  message: z.string().trim().min(10),
  consent: z.boolean().refine((value) => value),
  honey: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export const clientSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email().optional().or(z.literal("")),
  phone: z.string().trim().optional().or(z.literal("")),
  company: z.string().trim().optional().or(z.literal("")),
  notes: z.string().trim().optional().or(z.literal("")),
});

export const serviceSchema = z.object({
  client_id: z.string().uuid().optional().or(z.literal("")),
  title: z.string().trim().min(2),
  description: z.string().trim().min(5),
  status: z.enum(["active", "paused", "done"]),
  is_public: z.boolean().optional(),
});
