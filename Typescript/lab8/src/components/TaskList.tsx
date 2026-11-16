import type { Task } from '../types/task'
import { TaskItem } from './TaskItem'
import './TaskList.scss'

type TaskListProps = {
  tasks: Task[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function TaskList({ tasks, onToggle, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="task-list__empty" role="status">
        <span className="task-list__empty-icon" aria-hidden="true">✦</span>
        <strong>За цим фільтром завдань немає</strong>
        <span>Спробуйте інший фільтр або додайте нове завдання.</span>
      </div>
    )
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem key={task.id} onDelete={onDelete} onToggle={onToggle} task={task} />
      ))}
    </ul>
  )
}
