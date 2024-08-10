import { stat } from "fs"

export const defaultGetQuery = {
  isDeleted: { $ne: true },
}

export const defaultGetActiveProductsQuery = {
  status: "active",
  ...defaultGetQuery,
}
