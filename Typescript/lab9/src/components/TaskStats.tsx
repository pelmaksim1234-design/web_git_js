import { useTaskContext } from '../hooks/useTaskContext'
import './TaskStats.scss'

export function TaskStats() {
  const { tasks } = useTaskContext()
  const completed = tasks.filter((task) => task.completed).length
  const active = tasks.length - completed

  return (
    <section className="task-stats" aria-label="Статистика завдань">
      <div className="task-stats__item"><span className="task-stats__number">{tasks.length}</span><span className="task-stats__label">Усього</span></div>
      <span className="task-stats__divider" aria-hidden="true" />
      <div className="task-stats__item"><span className="task-stats__number task-stats__number--active">{active}</span><span className="task-stats__label">Активні</span></div>
      <span className="task-stats__divider" aria-hidden="true" />
      <div className="task-stats__item"><span className="task-stats__number task-stats__number--completed">{completed}</span><span className="task-stats__label">Виконані</span></div>
    </section>
  )
}
