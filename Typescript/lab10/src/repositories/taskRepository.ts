import { httpRequest } from '../api/httpClient'
import type { Task, TaskInput, TaskPage } from '../types/task'

type ApiTodo = {
  id: number
  todo: string
  completed: boolean
  userId: number
  description?: string
  priority?: Task['priority']
  category?: string
}

type TodosResponse = {
  todos: ApiTodo[]
  total: number
  skip: number
  limit: number
}

const metadata = new Map<number, Pick<Task, 'description' | 'priority' | 'category'>>()

function toTask(todo: ApiTodo): Task {
  const local = metadata.get(todo.id)
  return {
    id: todo.id,
    title: todo.todo,
    description: local?.description ?? todo.description ?? '',
    completed: todo.completed,
    priority: local?.priority ?? todo.priority ?? 'medium',
    category: local?.category ?? todo.category ?? 'General',
  }
}

function rememberMetadata(task: TaskInput, id: number) {
  metadata.set(id, {
    description: task.description,
    priority: task.priority,
    category: task.category,
  })
}

export const taskRepository = {
  async getAll(limit: number, skip: number, query: string, signal?: AbortSignal): Promise<TaskPage> {
    const params = new URLSearchParams({ limit: String(limit), skip: String(skip) })
    const path = query.trim()
      ? `/todos/search?${params}&q=${encodeURIComponent(query.trim())}`
      : `/todos?${params}`
    const data = await httpRequest<TodosResponse>(path, { signal })
    return {
      items: data.todos.map(toTask),
      total: data.total,
      skip: data.skip,
      limit: data.limit,
    }
  },

  async getById(id: number, signal?: AbortSignal): Promise<Task> {
    const todo = await httpRequest<ApiTodo>(`/todos/${id}`, { signal })
    return toTask(todo)
  },

  async create(task: TaskInput): Promise<Task> {
    const created = await httpRequest<ApiTodo>('/todos/add', {
      method: 'POST',
      body: JSON.stringify({
        todo: task.title,
        completed: task.completed,
        userId: 1,
      }),
    })
    rememberMetadata(task, created.id)
    return toTask(created)
  },

  async update(id: number, changes: Partial<TaskInput>): Promise<Task> {
    const body: { todo?: string; completed?: boolean } = {}
    if (changes.title !== undefined) body.todo = changes.title
    if (changes.completed !== undefined) body.completed = changes.completed

    const updated = await httpRequest<ApiTodo>(`/todos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    })

    const local = metadata.get(id)
    if (changes.description !== undefined || changes.priority !== undefined || changes.category !== undefined) {
      rememberMetadata({
        title: changes.title ?? '',
        description: changes.description ?? local?.description ?? '',
        priority: changes.priority ?? local?.priority ?? 'medium',
        category: changes.category ?? local?.category ?? 'General',
      }, id)
    }
    return toTask(updated)
  },

  async delete(id: number): Promise<void> {
    await httpRequest<ApiTodo>(`/todos/${id}`, { method: 'DELETE' })
    metadata.delete(id)
  },
}
