import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { TypeResetPasswordSchema } from '@/features/auth/schemas/reset-password.schema'
import {
  authService,
  passwordRecoveryService,
  verificationService
} from '@/features/auth/services'

import { toastMessageHandler } from '@/shared/utils'

export function useResetPasswordMutation() {
  const router = useRouter()

  const { mutate: reset, isPending: isLoadingReset } = useMutation({
    mutationKey: ['reset password'],
    mutationFn: ({
      values,
      recaptcha
    }: {
      values: TypeResetPasswordSchema
      recaptcha: string
    }) => passwordRecoveryService.reset(values, recaptcha),
    onSuccess() {
      toast.success('Check your email box', {
        description: 'Reset password email was sent'
      })
    },
    onError(error) {
      toastMessageHandler(error)
    }
  })

  return {
    reset,
    isLoadingReset
  }
}
