import { z } from 'zod'

export const ResetPasswordSchema = z.object({
  email: z.email({ message: 'Wrong email address' })
})

export type TypeResetPasswordSchema = z.infer<typeof ResetPasswordSchema>
