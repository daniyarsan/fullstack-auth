'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import React, { useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { AuthWrapper } from '@/features/auth/components/AuthWrapper'
import { useNewPasswordMutation } from '@/features/auth/hooks'
import {
  NewPasswordSchema,
  TypeNewPasswordSchema
} from '@/features/auth/schemas'

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

export function NewPasswordForm() {
  const { theme } = useTheme()
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null)

  const form = useForm<TypeNewPasswordSchema>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: ''
    }
  })

  const { newPassword, isLoadingNewPassword } = useNewPasswordMutation()

  const onsubmit = async (values: TypeNewPasswordSchema) => {
    if (recaptchaValue) {
      newPassword({ values, recaptcha: recaptchaValue })
    } else {
      toast.error('Please complete reCaptcha')
    }
  }

  return (
    <AuthWrapper
      heading='New password'
      description='Please enter new password'
      backButtonHref='/auth/login'
      backButtonLabel='Login'
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onsubmit)}
          className='grid gap-2 space-y-2'
        >
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <Link
                  href='/auth/reset-password'
                  className='ml-auto inline-block text-sm underline'
                >
                  Forgot password?
                </Link>
                <FormControl>
                  <Input
                    placeholder='******'
                    type='password'
                    {...field}
                    disabled={isLoadingNewPassword}
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

          <Button type='submit' disabled={isLoadingNewPassword}>
            Login
          </Button>
        </form>
      </Form>
    </AuthWrapper>
  )
}
