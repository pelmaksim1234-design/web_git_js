export type Priority = 'low' | 'medium' | 'high'

export type Task = {
  id: string
  title: string
  description: string
  completed: boolean
  priority: Priority
  category: string
}

export type TaskFilter = 'all' | 'active' | 'completed'
