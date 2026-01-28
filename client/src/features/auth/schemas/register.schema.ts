import { z } from 'zod'

export const RegisterSchema = z
  .object({
    name: z.string().min(1, {
      message: 'Name is required'
    }),
    email: z.email({ message: 'Email is required' }),
    password: z.string().min(6, {
      message: 'Password is required and should be at least 6 characters'
    }),
    passwordRepeat: z.string().min(6, {
      message: 'Password repeat is required and should be at least 6 characters'
    })
  })
  .refine(data => data.password === data.passwordRepeat, {
    message: 'Password dont match',
    path: ['passwordRepeat']
  })

export type TypeRegisterSchema = z.infer<typeof RegisterSchema>
