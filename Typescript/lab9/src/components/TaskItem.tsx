import { useTaskContext } from '../hooks/useTaskContext'
import type { Task } from '../types/task'
import './TaskItem.scss'

type TaskItemProps = {
  task: Task
  onEdit: (task: Task) => void
}

const priorityLabels = { low: 'Низький', medium: 'Середній', high: 'Високий' }

export function TaskItem({ task, onEdit }: TaskItemProps) {
  const { pendingDeleteId, toggleTask, requestDelete } = useTaskContext()
  const isPendingDelete = pendingDeleteId === task.id
  const deleteInProgress = pendingDeleteId !== null

  return (
    <li className={`task-item${task.completed ? ' task-item--completed' : ''}${isPendingDelete ? ' task-item--pending' : ''}`}>
      <button
        aria-label={task.completed ? `Повернути «${task.title}» до активних` : `Позначити «${task.title}» виконаним`}
        aria-pressed={task.completed}
        className="task-item__check"
        disabled={isPendingDelete}
        onClick={() => toggleTask(task.id)}
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
        <div className="task-item__meta">
          <span className="task-item__category">{task.category}</span>
          {isPendingDelete && <span className="task-item__pending-label">Буде видалено</span>}
        </div>
      </div>
      {!isPendingDelete && (
        <div className="task-item__actions">
          <button
            aria-label={`Редагувати «${task.title}»`}
            className="task-item__edit"
            disabled={deleteInProgress}
            onClick={() => onEdit(task)}
            type="button"
          >
            Редагувати
          </button>
          <button
            aria-label={`Видалити «${task.title}»`}
            className="task-item__delete"
            disabled={deleteInProgress}
            onClick={() => requestDelete(task.id)}
            type="button"
          >
            Видалити
          </button>
        </div>
      )}
    </li>
  )
}
