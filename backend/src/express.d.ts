import { User } from '@prisma/generated/client'
import 'express-session'

declare module 'express-session' {
  interface SessionData {
    userId?: string
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: User
    }
  }
}

declare module 'http' {
  interface IncomingHttpHeaders {
    'x-session-token'?: string
  }
}
