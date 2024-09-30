import { SortOrder } from "mongoose"

export type createSupplierParams = {
  organizationId?: string
  name: string
  email: string
  address: string
  description?: string
  image?: string
  createdById: string
  phone: string
}

export type fetchAllSuppliersParams = {
  searchString?: string
  pageNumber?: number
  pageSize?: number
  sortBy?: SortOrder
}

export type SupplierType = {
  _id: string
  name: string
  image?: string
  email?: string
  address?: string
  phone: string
  description?: string
  createdBy: string
  organization: string
  createdAt: string
}

export type fetchAllSuppliersResponse = {
  suppliers: SupplierType[]
  isNext: number
}

export type fetchSuppliersByUserParams = {
  organizationId: string
  email: string
  searchString?: string
  pageNumber?: number
  pageSize?: number
  sortBy?: SortOrder
}

export type fetchSuppliersByUserResponse = {
  suppliers: SupplierType[]
  isNext: number
}

export type updateSupplierParams = {
  supplierId: string
  name?: string
  description?: string
  phone?: string
  image?: string
  organizationId?: string
  email?: string
  address?: string
}
