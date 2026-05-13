import apiFetch from './api'
import type { MTR, CreateMTRDTO } from '../types'

export const mtrService = {
  list(): Promise<MTR[]> {
    return apiFetch('/mtrs')
  },

  findById(id: number): Promise<MTR> {
    return apiFetch(`/mtrs/${id}`)
  },

  create(data: CreateMTRDTO): Promise<MTR> {
    return apiFetch('/mtrs', 'POST', data)
  },
}