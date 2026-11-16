import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'

type Validator<T> = (value: unknown) => value is T

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  isValid: Validator<T>,
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key)
      if (stored === null) return initialValue

      const parsed: unknown = JSON.parse(stored)
      if (isValid(parsed)) return parsed

      console.error(`Saved value for "${key}" has an invalid format; using the default.`)
    } catch (error) {
      console.error(`Could not read "${key}" from localStorage; using the default.`, error)
    }

    return initialValue
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Could not save "${key}" to localStorage.`, error)
    }
  }, [key, value])

  return [value, setValue]
}
