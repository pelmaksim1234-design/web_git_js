import { useContext } from 'react'
import { TaskContext } from '../context/taskContextDef'

export function useTaskContext() {
  const context = useContext(TaskContext)
  if (context === null) {
    throw new Error('useTaskContext must be used within a TaskProvider.')
  }
  return context
}
