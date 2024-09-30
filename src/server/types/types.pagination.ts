export type PaginationResponse<T> = {
  isNext: boolean
  results: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export type PaginationOptions = {
  pageNumber?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export type FilterOptions = PaginationOptions & {
  searchString?: string
}
