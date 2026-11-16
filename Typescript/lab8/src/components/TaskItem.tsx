import type { Task } from '../types/task'
import './TaskItem.scss'

type TaskItemProps = {
  task: Task
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

const priorityLabels = {
  low: 'Низький',
  medium: 'Середній',
  high: 'Високий',
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <li className={`task-item${task.completed ? ' task-item--completed' : ''}`}>
      <button
        aria-label={task.completed ? `Повернути «${task.title}» до активних` : `Позначити «${task.title}» виконаним`}
        aria-pressed={task.completed}
        className="task-item__check"
        onClick={() => onToggle(task.id)}
        type="button"
      >
        {task.completed && <span aria-hidden="true">✓</span>}
      </button>
      <div className="task-item__body">
        <div className="task-item__title-row">
          <h3 className="task-item__title">{task.title}</h3>
          <span className={`task-item__priority task-item__priority--${task.priority}`}>
            {priorityLabels[task.priority]}
          </span>
        </div>
        {task.description && <p className="task-item__description">{task.description}</p>}
        <span className="task-item__category">{task.category}</span>
      </div>
      <button
        aria-label={`Видалити «${task.title}»`}
        className="task-item__delete"
        onClick={() => onDelete(task.id)}
        type="button"
      >
        Видалити
      </button>
    </li>
  )
}
