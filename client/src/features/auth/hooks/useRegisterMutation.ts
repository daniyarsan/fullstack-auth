import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { TypeRegisterSchema } from '@/features/auth/schemas'
import { authService } from '@/features/auth/services'

import { toastMessageHandler } from '@/shared/utils'

export function useRegisterMutation() {
  const { mutate: register, isPending: isLoadingRegister } = useMutation({
    mutationKey: ['register user'],
    mutationFn: ({
      values,
      recaptcha
    }: {
      values: TypeRegisterSchema
      recaptcha: string
    }) => authService.register(values, recaptcha),
    onSuccess(data: any) {
      toastMessageHandler(data)
    },
    onError(error) {
      toastMessageHandler(error)
    }
  })

  return {
    register,
    isLoadingRegister
  }
}
