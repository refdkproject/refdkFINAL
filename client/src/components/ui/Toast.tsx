import { useEffect } from "react"

interface ToastProps {
  message: string
  subMessage?: string
  show: boolean
  onClose: () => void
  duration?: number
  isError?: boolean
}

export function Toast({
  message,
  subMessage,
  show,
  onClose,
  duration = 3000,
  isError = false,
}: ToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [show, onClose, duration])

  if (!show) return null

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center">
      <div className="animate-fade-in bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-sm w-full mx-4">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            {isError ? (
              <svg
                className="h-6 w-6 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6 text-indigo-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p
              className={`text-sm font-medium ${
                isError
                  ? "text-red-900 dark:text-red-100"
                  : "text-gray-900 dark:text-white"
              }`}
            >
              {message}
            </p>
            {subMessage && (
              <p
                className={`mt-1 text-xs ${
                  isError
                    ? "text-red-500 dark:text-red-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {subMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
