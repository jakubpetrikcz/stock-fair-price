import z from 'zod';

export const loginUserSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export type LoginUserSchema = z.infer<typeof loginUserSchema>;
