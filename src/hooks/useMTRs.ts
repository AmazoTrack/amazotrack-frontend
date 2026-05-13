import { useState, useEffect, useCallback } from 'react'
import { mtrService } from '../services/mtr.service'
import type { MTR } from '../types'

export function useMTRs() {
  const [mtrs, setMtrs] = useState<MTR[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await mtrService.list()
      setMtrs(data)
    } catch {
      setError('Não foi possível carregar os MTRs.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { mtrs, isLoading, error, refetch: fetch }
}