import { z } from 'zod'

export const LoginSchema = z.object({
  email: z.email({ message: 'Email is required' }),
  password: z.string().min(6, {
    message: 'Password is required and should be at least 6 characters'
  })
})

export type TypeLoginSchema = z.infer<typeof LoginSchema>
