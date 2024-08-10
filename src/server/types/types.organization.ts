import { SortOrder } from "mongoose"

export type Organization = {
  _id: string
  name: string
  logo: string
  description: string
  address: string
  phone: string
  createdBy: string
  products: []
  members: []
  __v: number
  createdAt: string
}

export type fetchAllOrganizationsParams = {
  searchString?: string
  pageNumber?: number
  pageSize?: number
  sortBy?: SortOrder
}

export type fetchAllOrganizationsResponse = {
  organizations: Organization[]
  isNext: number
}

export type fetchOrganizationsByUserParams = {
  organizationId?: string
  email: string
  searchString?: string
  pageNumber?: number
  pageSize?: number
  sortBy?: SortOrder
}

export type fetchOrganizationsByUserResponse = {
  organizations: Organization[]
  isNext: number
}

export type createOrganizationParams = {
  organizationId?: string
  name: string
  description: string
  phone: string
  logo: string
  address: string
  createdById?: string
}
