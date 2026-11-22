export type Priority = 'low' | 'medium' | 'high'

export type Task = {
  id: number
  title: string
  description: string
  completed: boolean
  priority: Priority
  category: string
}

export type TaskFilter = 'all' | 'active' | 'completed'
export type TaskInput = {
  title: string
  description: string
  priority: Priority
  category: string
  completed?: boolean
}

export type TaskPage = {
  items: Task[]
  total: number
  skip: number
  limit: number
}
