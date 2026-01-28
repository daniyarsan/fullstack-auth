import { FetchClient } from '@/shared/utils'

export const api = new FetchClient({
  baseUrl: (process.env.SERVER_URL as string) || 'http://localhost:3000',
  options: {
    credentials: 'include'
  }
})
