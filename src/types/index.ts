// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface User {
  id: number
  name: string
  email: string
}

export interface AuthResponse {
  token: string
}

// ─── Enums ────────────────────────────────────────────────────────────────────

export type CompanyType = 'geradora' | 'destinadora'

export type WasteClass = 'I' | 'II_A' | 'II_B'

export type WasteStatus = 'gerado' | 'coletado' | 'transportado' | 'destinado'

// ─── Company ──────────────────────────────────────────────────────────────────

export interface Company {
  id: number
  corporateName: string
  cnpj: string
  type: CompanyType
  licenseNumber?: string | null
  issuingAgency?: string | null
  licenseExpiry?: string | null
  acceptedWasteTypes?: string | null
  phone?: string | null
  email?: string | null
  createdAt: string
}

export interface CreateCompanyDTO {
  corporateName: string
  cnpj: string
  type: CompanyType
  licenseNumber?: string
  issuingAgency?: string
  licenseExpiry?: string
  acceptedWasteTypes?: string
  phone?: string
  email?: string
}

// ─── Waste ────────────────────────────────────────────────────────────────────

export interface Waste {
  id: number
  code?: string | null
  description: string
  quantity: number
  unit: string
  sector: string
  class: WasteClass
  status: WasteStatus
  createdAt: string
  deletedAt?: string | null
  userId: number
  companyId: number
}

export interface CreateWasteDTO {
  code?: string
  description: string
  quantity: number
  unit: string
  sector: string
  companyId: number
}

export interface UpdateWasteDTO {
  code?: string
  description?: string
  quantity?: number
  unit?: string
  sector?: string
  class?: WasteClass
}

// ─── Movement ─────────────────────────────────────────────────────────────────

export interface Movement {
  id: number
  wasteId: number
  companyId: number
  type: WasteStatus
  notes?: string | null
  date: string
  createdAt: string
  waste?: {
    id: number
    description: string
    status: WasteStatus
  }
  company?: {
    id: number
    corporateName: string
  }
}

export interface CreateMovementDTO {
  wasteId: number
  companyId: number
  type: WasteStatus
  notes?: string
}

// ─── MTR ──────────────────────────────────────────────────────────────────────

export interface MTR {
  id: number
  number: string
  transporter: string
  issueDate: string
  wasteId: number
  destinationId: number
  waste?: Waste
  destination?: Company
}

export interface CreateMTRDTO {
  wasteId: number
  destinationId: number
  transporter: string
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface DashboardSummary {
  totals: {
    wastes: number
    companies: number
    movements: number
  }
  wastesByStatus: Array<{
    status: WasteStatus
    _count: number
  }>
  wastesByClass: Array<{
    class: WasteClass
    _count: number
  }>
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

export interface ApiError {
  error: true
  message: string
  details: Array<{
    field: string
    message: string
  }>
}