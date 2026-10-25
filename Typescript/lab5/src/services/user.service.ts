import { http } from '../api/http-client'
import type { CreateUserDto, UpdateUserDto, User, UserPage } from '../types'
import type { Creatable, Deletable, Editable, ListParams, Readable } from './interfaces'

export class UserService
  implements
    Readable<User>,
    Creatable<User, CreateUserDto>,
    Editable<User, UpdateUserDto>,
    Deletable<User>
{
  getAll({ limit = 10, skip = 0, query }: ListParams = {}): Promise<UserPage> {
    const params = new URLSearchParams({ limit: String(limit), skip: String(skip) })
    const path = query
      ? `/users/search?q=${encodeURIComponent(query)}&${params.toString()}`
      : `/users?${params.toString()}`
    return http<UserPage>(path)
  }

  getById(id: number): Promise<User> {
    return http<User>(`/users/${id}`)
  }

  create(data: CreateUserDto): Promise<User> {
    return http<User>('/users/add', { method: 'POST', body: JSON.stringify(data) })
  }

  update(id: number, data: UpdateUserDto): Promise<User> {
    return http<User>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) })
  }

  delete(id: number): Promise<User> {
    return http<User>(`/users/${id}`, { method: 'DELETE' })
  }
}
