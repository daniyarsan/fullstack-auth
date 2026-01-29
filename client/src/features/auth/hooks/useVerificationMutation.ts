import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { verificationService } from '@/features/auth/services'

export function useVerificationMutation() {
  const router = useRouter()

  const { mutate: verification } = useMutation({
    mutationKey: ['new verification'],
    mutationFn: async (token: string | null) =>
      verificationService.newVerification(token),
    onSuccess: () => {
      toast.success('Verification done successfully.')
      router.push('/dashbaord/settings')
    },
    onError: err => {
      router.push('/auth/login')
    }
  })

  return { verification }
}
