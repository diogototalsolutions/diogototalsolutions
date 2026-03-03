import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres."),
  company: z.string().trim().optional().or(z.literal("")),
  email: z.string().trim().email("Email inválido."),
  phone: z.string().trim().optional().or(z.literal("")),
  subject: z.string().trim().min(3, "Assunto deve ter pelo menos 3 caracteres."),
  message: z.string().trim().min(10, "Mensagem deve ter pelo menos 10 caracteres."),
  consent: z.boolean().refine((value) => value === true, {
    message: "Consentimento é obrigatório.",
  }),
  honey: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Email inválido."),
  password: z.string().min(1, "Password é obrigatória."),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
