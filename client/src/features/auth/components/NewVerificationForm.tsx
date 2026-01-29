'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

import { AuthWrapper } from '@/features/auth/components/AuthWrapper'
import { useVerificationMutation } from '@/features/auth/hooks'

import { Loading } from '@/shared/components/ui/Loading'

export function NewVerificationForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const { verification } = useVerificationMutation()

  useEffect(() => {
    verification(token)
  }, [token, verification])

  return (
    <AuthWrapper heading='Email confirmation'>
      <div>
        <Loading />
      </div>
    </AuthWrapper>
  )
}
