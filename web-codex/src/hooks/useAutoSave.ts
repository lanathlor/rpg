import { useEffect, useRef } from 'react'

/**
 * Auto-save hook with debouncing and deep comparison
 * @param data The data to save
 * @param onSave Callback to save the data
 * @param delay Debounce delay in milliseconds (default: 500ms)
 */
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

    // Serialize data for comparison
    const currentDataString = JSON.stringify(data)

    // Skip on initial mount
    if (!isMountedRef.current) {
      isMountedRef.current = true
      previousDataRef.current = currentDataString
      return
    }

    // Skip if data hasn't actually changed
    if (previousDataRef.current === currentDataString) {
      return
    }

    // Data has changed, update ref and schedule save
    previousDataRef.current = currentDataString

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      onSave(data)
    }, delay)

    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [data, onSave, delay])
}
