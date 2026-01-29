'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTheme } from 'next-themes'
import React, { useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { AuthWrapper } from '@/features/auth/components/AuthWrapper'
import { useRegisterMutation } from '@/features/auth/hooks'
import { RegisterSchema, TypeRegisterSchema } from '@/features/auth/schemas'

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

export function RegisterForm() {
  const { theme } = useTheme()
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null)

  const form = useForm<TypeRegisterSchema>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      passwordRepeat: ''
    }
  })

  const { register, isLoadingRegister } = useRegisterMutation()

  const onsubmit = async (values: TypeRegisterSchema) => {
    if (recaptchaValue) {
      register({ values, recaptcha: recaptchaValue })
    } else {
      toast.error('Please complete recaptha')
    }
  }

  return (
    <AuthWrapper
      heading='Registration'
      description='Please enter login and password to get in'
      backButtonHref='/auth/login'
      backButtonLabel='Login'
      isShowSocial
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onsubmit)}
          className='grid gap-2 space-y-2'
        >
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder='John'
                    {...field}
                    disabled={isLoadingRegister}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                    disabled={isLoadingRegister}
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
                    disabled={isLoadingRegister}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='passwordRepeat'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Repeat Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder='******'
                    type='password'
                    {...field}
                    disabled={isLoadingRegister}
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
          <Button type='submit' disabled={isLoadingRegister}>
            Create Account
          </Button>
        </form>
      </Form>
    </AuthWrapper>
  )
}
