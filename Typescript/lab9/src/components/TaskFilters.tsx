import { useTaskContext } from '../hooks/useTaskContext'
import type { TaskFilter } from '../types/task'
import './TaskFilters.scss'

const filters: { value: TaskFilter; label: string }[] = [
  { value: 'all', label: 'Усі' },
  { value: 'active', label: 'Активні' },
  { value: 'completed', label: 'Виконані' },
]

export function TaskFilters() {
  const { filter: activeFilter, setFilter } = useTaskContext()

  return (
    <nav className="task-filters" aria-label="Фільтр завдань">
      {filters.map((filter) => (
        <button
          aria-pressed={activeFilter === filter.value}
          className={`task-filters__button${activeFilter === filter.value ? ' task-filters__button--active' : ''}`}
          key={filter.value}
          onClick={() => setFilter(filter.value)}
          type="button"
        >
          {filter.label}
        </button>
      ))}
    </nav>
  )
}
