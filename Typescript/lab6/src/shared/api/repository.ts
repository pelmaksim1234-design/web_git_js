export interface ListParams {
  limit?: number
  skip?: number
  query?: string
}

export interface Readable<T, TPage> {
  getAll(params?: ListParams): Promise<TPage>
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
