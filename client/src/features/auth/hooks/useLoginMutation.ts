import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { TypeLoginSchema, TypeRegisterSchema } from '@/features/auth/schemas'
import { authService } from '@/features/auth/services'

import { toastMessageHandler } from '@/shared/utils'

export function useLoginMutation() {
  const router = useRouter()
  const { mutate: login, isPending: isLoadingLogin } = useMutation({
    mutationKey: ['login user'],
    mutationFn: ({
      values,
      recaptcha
    }: {
      values: TypeLoginSchema
      recaptcha: string
    }) => authService.login(values, recaptcha),
    onSuccess(data: any) {
      if (data.message) {
        toastMessageHandler(data)
      } else {
        toast.success('Authorization successfully')
        router.push('/dashboard/settings')
      }
    },
    onError(error) {
      toastMessageHandler(error)
    }
  })

  return {
    login,
    isLoadingLogin
  }
}
