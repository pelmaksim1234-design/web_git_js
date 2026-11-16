import { initialTasks } from '../data/initialTasks'
import type { Task, TaskInput } from '../types/task'

export type TaskState = {
  tasks: Task[]
  pendingDeleteId: string | null
}

export type TaskAction =
  | { type: 'add'; task: Task }
  | { type: 'toggle'; id: string }
  | { type: 'update'; id: string; changes: TaskInput }
  | { type: 'requestDelete'; id: string }
  | { type: 'confirmDelete'; id: string }
  | { type: 'undoDelete'; id: string }
  | { type: 'reset' }

export function isTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) return false
  const task = value as Record<string, unknown>
  return (
    typeof task.id === 'string' &&
    typeof task.title === 'string' &&
    typeof task.description === 'string' &&
    typeof task.completed === 'boolean' &&
    (task.priority === 'low' || task.priority === 'medium' || task.priority === 'high') &&
    typeof task.category === 'string'
  )
}

export function readInitialTaskState(): TaskState {
  try {
    const stored = localStorage.getItem('study-planner-lab9-tasks')
    if (stored === null) return { tasks: initialTasks, pendingDeleteId: null }

    const parsed: unknown = JSON.parse(stored)
    if (Array.isArray(parsed) && parsed.every(isTask)) {
      return { tasks: parsed, pendingDeleteId: null }
    }

    console.error('Saved Study Planner tasks have an invalid format; using the starter tasks.')
  } catch (error) {
    console.error('Could not read saved Study Planner tasks; using the starter tasks.', error)
  }

  return { tasks: initialTasks, pendingDeleteId: null }
}

export function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'add':
      return { ...state, tasks: [action.task, ...state.tasks] }
    case 'toggle':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.id ? { ...task, completed: !task.completed } : task,
        ),
      }
    case 'update':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.id ? { ...task, ...action.changes } : task,
        ),
      }
    case 'requestDelete':
      if (state.pendingDeleteId !== null || !state.tasks.some((task) => task.id === action.id)) {
        return state
      }
      return { ...state, pendingDeleteId: action.id }
    case 'confirmDelete':
      if (state.pendingDeleteId !== action.id) return state
      return {
        tasks: state.tasks.filter((task) => task.id !== action.id),
        pendingDeleteId: null,
      }
    case 'undoDelete':
      if (state.pendingDeleteId !== action.id) return state
      return { ...state, pendingDeleteId: null }
    case 'reset':
      return { tasks: initialTasks, pendingDeleteId: null }
    default: {
      const exhaustive: never = action
      return exhaustive
    }
  }
}
