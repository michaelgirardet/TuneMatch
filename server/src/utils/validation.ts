import { z } from 'zod';

export const registerSchema = z.object({
  nom_utilisateur: z.string().min(3).max(100),
  email: z.string().email(),
  mot_de_passe: z.string().min(8),
  role: z.enum(['artiste', 'producteur'])
}).strict(); // .strict() rejette les propriétés supplémentaires

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  mot_de_passe: z.string()
}).strict();

export const forgotPasswordSchema = z.object({
  email: z.string().email()
}).strict();

export const resetPasswordSchema = z.object({
  token: z.string(),
  email: z.string().email(),
  newPassword: z.string().min(8)
}).strict();

export const socialLinksSchema = z.object({
  platform: z.enum(['youtube', 'instagram', 'soundcloud']),
  link: z.string().url()
}).strict();

export const genresSchema = z.object({
  genres: z.array(z.string()).min(1).max(5)
}).strict(); 