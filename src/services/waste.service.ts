import apiFetch from './api'
import type { Waste, CreateWasteDTO, UpdateWasteDTO, PaginatedResponse } from '../types'

export const wasteService = {
  list(page = 1, limit = 20): Promise<PaginatedResponse<Waste>> {
    return apiFetch(`/wastes?page=${page}&limit=${limit}`)
  },

  findById(id: number): Promise<Waste> {
    return apiFetch(`/wastes/${id}`)
  },

  create(data: CreateWasteDTO): Promise<Waste> {
    return apiFetch('/wastes', 'POST', data)
  },

  update(id: number, data: UpdateWasteDTO): Promise<Waste> {
    return apiFetch(`/wastes/${id}`, 'PUT', data)
  },

  remove(id: number): Promise<{ error: false; message: string }> {
    return apiFetch(`/wastes/${id}`, 'DELETE')
  },
}