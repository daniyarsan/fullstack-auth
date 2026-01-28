import { Metadata } from 'next'
import React from 'react'

import { LoginForm } from '@/features/auth/components/LoginForm'

export const metadata: Metadata = {
  title: 'Login to Account'
}

export default function LoginPage() {
  return <LoginForm />
}
