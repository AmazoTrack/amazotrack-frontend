import { useState, useEffect } from 'react'
import { dashboardService } from '../services/dashboard.service'
import type { DashboardSummary } from '../types'

export function useDashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    dashboardService.summary()
      .then(setSummary)
      .catch(() => setError('Não foi possível carregar o dashboard.'))
      .finally(() => setIsLoading(false))
  }, [])

  return { summary, isLoading, error }
}