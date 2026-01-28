import { Metadata } from 'next'
import React from 'react'

import { RegisterForm } from '@/features/auth/components'

export const metadata: Metadata = {
  title: 'Create Account'
}

export default function RegisterPage() {
  return <RegisterForm />
}
