'use client'
import { type PropsWithChildren } from 'react'

import { TanstackQueryProvider } from '@/shared/providers/TanstackQueryProvider'
import { ThemeProvider } from '@/shared/providers/ThemeProvider'
import { ToastProvider } from '@/shared/providers/ToastProvider'

export function MainProvider({ children }: PropsWithChildren<unknown>) {
  return (
    <TanstackQueryProvider>
      <ThemeProvider
        attribute='class'
        defaultTheme='light'
        disableTransitionOnChange
        storageKey='auth-theme'
      >
        <ToastProvider />
        {children}
      </ThemeProvider>
    </TanstackQueryProvider>
  )
}
