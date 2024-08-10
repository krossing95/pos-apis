import { SortOrder } from "mongoose"

export type createCategoryParams = {
  organizationId?: string
  name: string
  description: string
  image: string
  createdById?: string
}

export type fetchAllCategoriesParams = {
  searchString?: string
  pageNumber?: number
  pageSize?: number
  sortBy?: SortOrder
}

export type CategoryType = {
  _id: string
  name: string
  image: string
  description: string
  createdBy: string
  organization: string
  createdAt: string
}

export type fetchAllCategoriesResponse = {
  categories: CategoryType[]
  isNext: number
}

export type fetchCategoriesByUserParams = {
  organizationId: string
  email: string
  searchString?: string
  pageNumber?: number
  pageSize?: number
  sortBy?: SortOrder
}

export type fetchCategoriesByUserResponse = {
  categories: CategoryType[]
  isNext: number
}

export type updateCategoryParams = {
  categoryId: string
  name?: string
  description?: string
  phone?: string
  image?: string
  organizationId?: string
}
