import { createContext } from 'react'
import type { Task, TaskFilter, TaskInput } from '../types/task'

export type Notification = {
  message: string
  type: 'success' | 'error' | 'info'
}

export type TaskContextValue = {
  tasks: Task[]
  filter: TaskFilter
  pendingDeleteId: string | null
  notification: Notification | null
  setFilter: (filter: TaskFilter) => void
  addTask: (task: TaskInput) => void
  updateTask: (id: string, changes: TaskInput) => void
  toggleTask: (id: string) => void
  requestDelete: (id: string) => void
  undoDelete: () => void
  resetTasks: () => void
  dismissNotification: () => void
}

export const TaskContext = createContext<TaskContextValue | null>(null)
