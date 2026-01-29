import { Metadata } from 'next'
import React from 'react'

import { ResetPasswordForm } from '@/features/auth/components'

export const metadata: Metadata = {
  title: 'Password Reset Page'
}

export default function ResetPasswordPage() {
  return <ResetPasswordForm />
}
