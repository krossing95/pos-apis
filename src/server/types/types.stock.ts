export type StockType = {
  itemName?: string
  itemId: string
  categoryId: string
  oldQuantity: number
  quantityAdded: number
  newQuantity: number
  createdBy: string
  createdAt?: string
  organization: string
  isDeleted?: boolean
}

export type StockFilterOptions = {
  organizationId: string
  searchString?: string
  pageNumber?: number
  pageSize?: number
  sortBy?: string
}
