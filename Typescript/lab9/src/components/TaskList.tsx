import { useMemo } from 'react'
import { useTaskContext } from '../hooks/useTaskContext'
import type { Task } from '../types/task'
import { TaskItem } from './TaskItem'
import './TaskList.scss'

type TaskListProps = {
  onEdit: (task: Task) => void
}

export function TaskList({ onEdit }: TaskListProps) {
  const { tasks, filter } = useTaskContext()

  const visibleTasks = useMemo(() => {
    if (filter === 'active') return tasks.filter((task) => !task.completed)
    if (filter === 'completed') return tasks.filter((task) => task.completed)
    return tasks
  }, [filter, tasks])

  if (visibleTasks.length === 0) {
    const noTasks = tasks.length === 0
    return (
      <div className="task-list__empty" role="status">
        <span className="task-list__empty-icon" aria-hidden="true">✦</span>
        <strong>{noTasks ? 'Завдань поки немає' : 'За цим фільтром завдань немає'}</strong>
        <span>{noTasks ? 'Додайте перше навчальне завдання.' : 'Спробуйте інший фільтр або додайте завдання.'}</span>
      </div>
    )
  }

  return (
    <ul className="task-list">
      {visibleTasks.map((task) => (
        <TaskItem key={task.id} onEdit={onEdit} task={task} />
      ))}
    </ul>
  )
}
