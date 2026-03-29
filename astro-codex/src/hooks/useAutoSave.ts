import { useEffect, useRef } from 'react'

export function useAutoSave<T>(
  data: T | null,
  onSave: (data: T) => void,
  delay: number = 500
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const previousDataRef = useRef<string | null>(null)
  const isMountedRef = useRef(false)

  useEffect(() => {
    if (!data) return

    const currentDataString = JSON.stringify(data)

    if (!isMountedRef.current) {
      isMountedRef.current = true
      previousDataRef.current = currentDataString
      return
    }

    if (previousDataRef.current === currentDataString) {
      return
    }

    previousDataRef.current = currentDataString

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      onSave(data)
    }, delay)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [data, onSave, delay])
}
