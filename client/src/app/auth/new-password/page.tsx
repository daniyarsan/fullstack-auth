import { Metadata } from 'next'
import React from 'react'

import { NewPasswordForm } from '@/features/auth/components'

export const metadata: Metadata = {
  title: 'New Password Page'
}

export default function Page() {
  return <NewPasswordForm />
}
