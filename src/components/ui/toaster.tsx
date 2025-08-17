'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'

import { Toast, ToastProvider, ToastViewport } from '@/components/ui/toast'
import { useToast } from '@/components/ui/use-toast'

export function Toaster() {
  const { toasts } = useToast()
  const { theme } = useTheme()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast
            key={id}
            {...props}
            className={`${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}
          >
            <div className="grid gap-1">
              {title && <div className="text-sm font-semibold">{title}</div>}
              {description && (
                <div className="text-sm opacity-90">{description}</div>
              )}
            </div>
            {action}
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
