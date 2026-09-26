import z from 'zod';

export const registerUserSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
});

export type RegisterUserSchema = z.infer<typeof registerUserSchema>;
