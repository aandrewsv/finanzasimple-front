"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
            <div className="grid gap-1">
              {title && <ToastTitle className="text-gray-900 dark:text-gray-50">{title}</ToastTitle>}
              {description && (
                <ToastDescription className="text-gray-500 dark:text-gray-400">{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
