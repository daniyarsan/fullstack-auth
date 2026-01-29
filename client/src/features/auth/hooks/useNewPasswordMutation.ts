import { useMutation } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

import { TypeNewPasswordSchema } from '@/features/auth/schemas'
import { passwordRecoveryService } from '@/features/auth/services'

import { toastMessageHandler } from '@/shared/utils'

export function useNewPasswordMutation() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const { mutate: newPassword, isPending: isLoadingNewPassword } = useMutation({
    mutationKey: ['new password'],
    mutationFn: ({
      values,
      recaptcha
    }: {
      values: TypeNewPasswordSchema
      recaptcha: string
    }) => passwordRecoveryService.newPassword(values, token, recaptcha),
    onSuccess() {
      toast.success('New password was set successfully!', {
        description: 'Please proceed to your account.'
      })
      router.push('/dashboard/settings')
    },
    onError(error) {
      toastMessageHandler(error)
    }
  })

  return {
    newPassword,
    isLoadingNewPassword
  }
}
