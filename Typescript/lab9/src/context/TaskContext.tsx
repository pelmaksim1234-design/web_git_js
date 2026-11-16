import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from 'react'
import { TaskContext, type Notification, type TaskContextValue } from './taskContextDef'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { taskReducer, readInitialTaskState } from '../reducers/taskReducer'
import type { TaskFilter, TaskInput } from '../types/task'

type TaskProviderProps = {
  children: ReactNode
}

const isTaskFilter = (value: unknown): value is TaskFilter =>
  value === 'all' || value === 'active' || value === 'completed'

export function TaskProvider({ children }: TaskProviderProps) {
  const [state, dispatch] = useReducer(taskReducer, undefined, readInitialTaskState)
  const [filter, setFilter] = useLocalStorage<TaskFilter>(
    'study-planner-lab9-filter',
    'all',
    isTaskFilter,
  )
  const [notification, setNotification] = useState<Notification | null>(null)

  const showNotification = useCallback((message: string, type: Notification['type'] = 'success') => {
    setNotification({ message, type })
  }, [])

  const addTask = useCallback((task: TaskInput) => {
    dispatch({
      type: 'add',
      task: { ...task, id: crypto.randomUUID(), completed: false },
    })
    showNotification('Нове завдання додано.')
  }, [showNotification])

  const updateTask = useCallback((id: string, changes: TaskInput) => {
    dispatch({ type: 'update', id, changes })
    showNotification('Зміни збережено.')
  }, [showNotification])

  const toggleTask = useCallback((id: string) => {
    dispatch({ type: 'toggle', id })
  }, [])

  const requestDelete = useCallback((id: string) => {
    if (state.pendingDeleteId !== null) {
      showNotification('Спочатку скасуйте або дочекайтеся поточного видалення.', 'error')
      return
    }

    const task = state.tasks.find((item) => item.id === id)
    if (!task) {
      showNotification('Не вдалося знайти це завдання.', 'error')
      return
    }

    dispatch({ type: 'requestDelete', id })
    showNotification(`«${task.title}» буде видалено через 5 секунд.`, 'info')
  }, [showNotification, state.pendingDeleteId, state.tasks])

  const undoDelete = useCallback(() => {
    if (state.pendingDeleteId === null) return
    dispatch({ type: 'undoDelete', id: state.pendingDeleteId })
    showNotification('Видалення скасовано.', 'success')
  }, [showNotification, state.pendingDeleteId])

  const resetTasks = useCallback(() => {
    dispatch({ type: 'reset' })
    setFilter('all')
    showNotification('Початковий список відновлено.')
  }, [setFilter, showNotification])

  const dismissNotification = useCallback(() => setNotification(null), [])

  useEffect(() => {
    try {
      localStorage.setItem('study-planner-lab9-tasks', JSON.stringify(state.tasks))
    } catch (error) {
      console.error('Could not save Study Planner tasks to localStorage.', error)
      showNotification('Не вдалося зберегти завдання у браузері.', 'error')
    }
  }, [showNotification, state.tasks])

  useEffect(() => {
    const activeCount = state.tasks.filter((task) => !task.completed).length
    document.title = `Study Planner — ${activeCount} active ${activeCount === 1 ? 'task' : 'tasks'}`
  }, [state.tasks])

  useEffect(() => {
    const pendingId = state.pendingDeleteId
    if (pendingId === null) return

    const timeoutId = window.setTimeout(() => {
      dispatch({ type: 'confirmDelete', id: pendingId })
      showNotification('Завдання остаточно видалено.', 'success')
    }, 5000)

    return () => window.clearTimeout(timeoutId)
  }, [showNotification, state.pendingDeleteId])

  useEffect(() => {
    if (state.pendingDeleteId === null) return
    const pendingTask = state.tasks.find((task) => task.id === state.pendingDeleteId)
    if (!pendingTask) {
      dispatch({ type: 'undoDelete', id: state.pendingDeleteId })
    }
  }, [state.pendingDeleteId, state.tasks])

  const value = useMemo<TaskContextValue>(() => ({
    tasks: state.tasks,
    filter,
    pendingDeleteId: state.pendingDeleteId,
    notification,
    setFilter,
    addTask,
    updateTask,
    toggleTask,
    requestDelete,
    undoDelete,
    resetTasks,
    dismissNotification,
  }), [
    addTask,
    dismissNotification,
    filter,
    notification,
    requestDelete,
    resetTasks,
    setFilter,
    state.pendingDeleteId,
    state.tasks,
    toggleTask,
    undoDelete,
    updateTask,
  ])

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}
