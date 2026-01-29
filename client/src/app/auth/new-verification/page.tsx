import { Metadata } from 'next'
import React from 'react'

import { NewVerificationForm } from '@/features/auth/components'

export const metadata: Metadata = {
  title: 'Email confirmation'
}

export default function NewVerificationPage() {
  return <NewVerificationForm />
}
