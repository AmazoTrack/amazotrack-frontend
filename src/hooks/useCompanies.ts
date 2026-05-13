import { useState, useEffect, useCallback } from 'react'
import { companyService } from '../services/company.service'
import type { Company } from '../types'

export function useCompanies(page = 1, limit = 20) {
  const [companies, setCompanies] = useState<Company[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await companyService.list(page, limit)
      setCompanies(response.data)
      setTotal(response.total)
    } catch {
      setError('Não foi possível carregar as empresas.')
    } finally {
      setIsLoading(false)
    }
  }, [page, limit])

  useEffect(() => { fetch() }, [fetch])

  return { companies, total, isLoading, error, refetch: fetch }
}
