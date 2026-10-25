export interface User {
  id: number
  firstName: string
  lastName: string
  maidenName?: string
  age: number
  gender: string
  email: string
  phone: string
  username: string
  password?: string
  birthDate?: string
  image?: string
  bloodGroup?: string
  height?: number
  weight?: number
  eyeColor?: string
  hair?: {
    color: string
    type: string
  }
  address?: {
    address: string
    city: string
    state: string
    stateCode?: string
    postalCode?: string
    country?: string
  }
  role?: string
}

export type CreateUserDto = Pick<
  User,
  'firstName' | 'lastName' | 'email' | 'username' | 'password' | 'age' | 'gender' | 'phone'
>

export type UpdateUserDto = Partial<CreateUserDto>

export type UserFormValues = CreateUserDto

export interface UserPage {
  users: User[]
  total: number
  skip: number
  limit: number
}

export interface AuthSession {
  accessToken: string
  refreshToken: string
  user: User
}

export type AppLayout = 'default' | 'auth'
