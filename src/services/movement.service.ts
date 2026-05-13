import apiFetch from './api'
import type { Movement, CreateMovementDTO, PaginatedResponse } from '../types'

export const movementService = {
  list(page = 1, limit = 20): Promise<PaginatedResponse<Movement>> {
    return apiFetch(`/movements?page=${page}&limit=${limit}`)
  },

  findById(id: number): Promise<Movement> {
    return apiFetch(`/movements/${id}`)
  },

  create(data: CreateMovementDTO): Promise<Movement> {
    return apiFetch('/movements', 'POST', data)
  },

  remove(id: number): Promise<{ error: false; message: string }> {
    return apiFetch(`/movements/${id}`, 'DELETE')
  },
}