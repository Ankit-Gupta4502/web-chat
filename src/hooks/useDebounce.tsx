"use client"
import { useEffect, useState } from 'react'

const useDebounce = (value: string = "", delay: number = 400): string => {
    const [debouncedValue, setDebouncedValue] = useState("")
    useEffect(() => {
        const id = setTimeout(() => setDebouncedValue(value), delay)
        return (() => clearTimeout(id))
    }, [value, delay])
    return debouncedValue
}

export default useDebounce