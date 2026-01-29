'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTheme } from 'next-themes'
import React, { useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { AuthWrapper } from '@/features/auth/components/AuthWrapper'
import { useLoginMutation } from '@/features/auth/hooks'
import { LoginSchema, TypeLoginSchema } from '@/features/auth/schemas'

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

export function LoginForm() {
  const { theme } = useTheme()
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null)

  const form = useForm<TypeLoginSchema>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const { login, isLoadingLogin } = useLoginMutation()

  const onsubmit = async (values: TypeLoginSchema) => {
    if (recaptchaValue) {
      login({ values, recaptcha: recaptchaValue })
    } else {
      toast.error('Please complete recaptha')
    }
  }

  return (
    <AuthWrapper
      heading='Login'
      description='Please enter login and password enter'
      backButtonHref='/auth/register'
      backButtonLabel='Register'
      isShowSocial
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
                    disabled={isLoadingLogin}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder='******'
                    type='password'
                    {...field}
                    disabled={isLoadingLogin}
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

          <Button type='submit' disabled={isLoadingLogin}>
            Login
          </Button>
        </form>
      </Form>
    </AuthWrapper>
  )
}
