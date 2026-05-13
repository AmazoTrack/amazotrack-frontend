import apiFetch from './api'
import type { Company, CreateCompanyDTO, PaginatedResponse } from '../types'

export const companyService = {
  list(page = 1, limit = 20): Promise<PaginatedResponse<Company>> {
    return apiFetch(`/companies?page=${page}&limit=${limit}`)
  },

  findById(id: number): Promise<Company> {
    return apiFetch(`/companies/${id}`)
  },

  create(data: CreateCompanyDTO): Promise<Company> {
    return apiFetch('/companies', 'POST', data)
  },

  update(id: number, data: Partial<CreateCompanyDTO>): Promise<Company> {
    return apiFetch(`/companies/${id}`, 'PUT', data)
  },

  remove(id: number): Promise<{ error: false; message: string }> {
    return apiFetch(`/companies/${id}`, 'DELETE')
  },
}