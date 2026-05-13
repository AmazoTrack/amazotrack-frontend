import { useState, useEffect, useCallback } from 'react'
import { wasteService } from '../services/waste.service'
import type { Waste } from '../types'

export function useWastes(page = 1, limit = 20) {
  const [wastes, setWastes] = useState<Waste[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await wasteService.list(page, limit)
      setWastes(response.data)
      setTotal(response.total)
    } catch {
      setError('Não foi possível carregar os resíduos.')
    } finally {
      setIsLoading(false)
    }
  }, [page, limit])

  useEffect(() => { fetch() }, [fetch])

  return { wastes, total, isLoading, error, refetch: fetch }
}