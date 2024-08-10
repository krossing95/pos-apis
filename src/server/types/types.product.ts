export type createProductParams = {
  name: string
  description: string
  image: string
  categoryId: string
  createdById: string
  organizationId: string
  costPrice: number
  sellingPrice: number
  quantity: number
  onHandQuantity?: number
  supplierId: string
  genericName: string
  productCode: string
  dateOfArrival: Date | string
}

export type fetchAllProductsParams = {
  searchString?: string
  pageNumber?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export type ProductType = {
  _id: string
  name: string
  description: string
  image: string
  categoryId: string
  createdBy: string
  organization: string
  costPrice: number
  sellingPrice: number
  quantity: number
  onHandQuantity: number
  quantitySold: number
  supplierId: string
  categoryName: string
  genericName: string
  productCode: string
  dateOfArrival: Date | string
  createdAt: string
  status: string
}

export type fetchAllProductsResponse = {
  products: ProductType[]
  isNext: number
}

export type fetchProductsByOrganizationParams = {
  email: string
  organizationId: string
  searchString?: string
  pageNumber?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export type fetchProductsByUserResponse = {
  products: ProductType[]
  isNext: number
}

export type updateProductParams = {
  productId: string
  name?: string
  description?: string
  image?: string
  categoryId?: string
  costPrice?: number
  sellingPrice?: number
  quantity?: number
  onHandQuantity?: number
  supplierId?: string
  categoryName?: string
  genericName?: string
  productCode?: string
  dateOfArrival?: Date | string
  organizationId?: string
  status?: string
}

export type deleteProductParams = {
  productId: string
}

export enum ProductStatus {
  active = "active",
  inactive = "inactive",
  archived = "archived",
}
