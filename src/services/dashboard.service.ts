import apiFetch from './api'
import type { DashboardSummary } from '../types'

export const dashboardService = {
  summary(): Promise<DashboardSummary> {
    return apiFetch('/dashboard/summary')
  },
}