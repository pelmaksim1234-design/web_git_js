import type { UserPage } from '../types'

export interface ListParams {
  limit?: number
  skip?: number
  query?: string
}

export interface Readable<T> {
  getAll(params?: ListParams): Promise<UserPage>
  getById(id: number): Promise<T>
}

export interface Creatable<T, TCreate> {
  create(data: TCreate): Promise<T>
}

export interface Editable<T, TUpdate> {
  update(id: number, data: TUpdate): Promise<T>
}

export interface Deletable<T> {
  delete(id: number): Promise<T>
}
