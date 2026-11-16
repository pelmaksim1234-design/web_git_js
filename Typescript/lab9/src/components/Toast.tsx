import { useEffect } from 'react'
import { useTaskContext } from '../hooks/useTaskContext'
import './Toast.scss'

export function Toast() {
  const {
    tasks,
    pendingDeleteId,
    notification,
    undoDelete,
    dismissNotification,
  } = useTaskContext()

  useEffect(() => {
    if (!notification || pendingDeleteId !== null) return
    const timeoutId = window.setTimeout(dismissNotification, 3500)
    return () => window.clearTimeout(timeoutId)
  }, [dismissNotification, notification, pendingDeleteId])

  if (!notification) return null

  const isDeleting = pendingDeleteId !== null
  const pendingTask = tasks.find((task) => task.id === pendingDeleteId)

  return (
    <div
      className={`toast toast--${notification.type}${isDeleting ? ' toast--pending' : ''}`}
      role={notification.type === 'error' ? 'alert' : 'status'}
      aria-live={notification.type === 'error' ? 'assertive' : 'polite'}
    >
      <div className="toast__content">
        <span className="toast__icon" aria-hidden="true">{notification.type === 'error' ? '!' : '✓'}</span>
        <span className="toast__message">
          {isDeleting && pendingTask
            ? `«${pendingTask.title}» буде видалено через 5 секунд.`
            : notification.message}
        </span>
      </div>
      {isDeleting ? (
        <button className="toast__undo" onClick={undoDelete} type="button">Скасувати</button>
      ) : (
        <button
          aria-label="Закрити повідомлення"
          className="toast__close"
          onClick={dismissNotification}
          type="button"
        >
          ×
        </button>
      )}
      {isDeleting && <span className="toast__progress" aria-hidden="true" />}
    </div>
  )
}
