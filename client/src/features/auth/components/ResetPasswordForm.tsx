'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTheme } from 'next-themes'
import React, { useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { AuthWrapper } from '@/features/auth/components/AuthWrapper'
import { useResetPasswordMutation } from '@/features/auth/hooks'
import {
  ResetPasswordSchema,
  TypeResetPasswordSchema
} from '@/features/auth/schemas/reset-password.schema'

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input
} from '@/shared/components/ui'

export function ResetPasswordForm() {
  const { theme } = useTheme()
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null)

  const form = useForm<TypeResetPasswordSchema>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: ''
    }
  })

  const { reset, isLoadingReset } = useResetPasswordMutation()

  const onsubmit = async (values: TypeResetPasswordSchema) => {
    if (recaptchaValue) {
      reset({ values, recaptcha: recaptchaValue })
    } else {
      toast.error('Please complete reCaptcha')
    }
  }

  return (
    <AuthWrapper
      heading='Reset password'
      description='Please enter email to reset your password'
      backButtonHref='/auth/login'
      backButtonLabel='Reset'
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onsubmit)}
          className='grid gap-2 space-y-2'
        >
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder='john@example.com'
                    type='email'
                    {...field}
                    disabled={isLoadingReset}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='flex justify-center'>
            <ReCAPTCHA
              sitekey={process.env.GOOGLE_RECAPTCHA_SITE_KEY as string}
              onChange={setRecaptchaValue}
              theme={theme === 'light' ? 'light' : 'dark'}
            />
          </div>

          <Button type='submit' disabled={isLoadingReset}>
            Login
          </Button>
        </form>
      </Form>
    </AuthWrapper>
  )
}
