import { toast } from 'sonner'

export function toastMessageHandler(error: unknown) {
  if (error instanceof Error && error.message) {
    const message = error.message
    const dotIndex = message.indexOf('.')

    if (dotIndex !== -1) {
      toast.error(message.slice(0, dotIndex), {
        description: message.slice(dotIndex + 1).trim()
      })
    } else {
      toast.error(message)
    }
  } else {
    toast.error('Server error')
  }
}
