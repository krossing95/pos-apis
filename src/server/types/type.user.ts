export type getOrCreateUserParams = {
  email: string
  name: string
}

export type userDetailsFromAuthType = {
  email: string
  image: string
  name: string
}

export type userDetailsFromTokenType = {
  _id: string
  username: string
  email: string
  name: string
  phone: string
  onboarded: boolean
  verified: boolean
  organizations: any[]
  activeOrganization: string
  createdAt: Date
  __v: number
}

export type updateUserDetailsParams = {
  name?: string
  username?: string
  email?: string
  phone?: string
  onboarded?: boolean
  verified?: boolean
  organizations?: any[]
  activeOrganization?: string
  createdAt?: Date
  __v?: number
  _id: string
}

export type FullUserSessionType = userDetailsFromAuthType &
  userDetailsFromTokenType

export interface UserTokenData {
  user: User
  token: Token
}

export interface Token {
  name: string
  email: string
  picture: string
  sub: string
  tokenData: TokenData
  iat: number
  exp: number
  jti: string
}

export interface TokenData {
  _id: string
  username: string
  email: string
  name: string
  onboarded: boolean
  verified: boolean
  organizations: string[]
  createdAt: Date
  __v: number
  activeOrganization: string
  phone: string
  user_role: string
  isDeleted: boolean
}

export interface User {
  name: string
  email: string
  image: string
}
