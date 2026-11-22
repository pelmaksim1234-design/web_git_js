import { useEffect, useRef, useState, type FormEvent } from 'react'
import { HttpError } from './api/httpClient'
import { taskRepository } from './repositories/taskRepository'
import type { Priority, Task } from './types/task'
import './styles/app.scss'

function App() {
  const pageSize = 10
  const detailsController = useRef<AbortController | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)
  const [reload, setReload] = useState(0)
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [selected, setSelected] = useState<Task | null>(null)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [detailsError, setDetailsError] = useState('')
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [mutationLoading, setMutationLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedQuery(query), 350)
    return () => window.clearTimeout(timeoutId)
  }, [query])

  useEffect(() => {
    setPage(0)
  }, [debouncedQuery])

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError('')

    taskRepository.getAll(pageSize, page * pageSize, debouncedQuery, controller.signal)
      .then((result) => {
        setTasks(result.items)
        setTotal(result.total)
      })
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === 'AbortError') return
        setError(requestError instanceof HttpError
          ? requestError.message
          : 'Не вдалося завантажити завдання.')
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [page, debouncedQuery, reload])

  useEffect(() => {
    if (!success) return
    const timeoutId = window.setTimeout(() => setSuccess(''), 3500)
    return () => window.clearTimeout(timeoutId)
  }, [success])

  function openDetails(task: Task) {
    detailsController.current?.abort()
    const controller = new AbortController()
    detailsController.current = controller
    setSelected(task)
    setDetailsLoading(true)
    setDetailsError('')

    taskRepository.getById(task.id, controller.signal)
      .then((actualTask) => setSelected(actualTask))
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === 'AbortError') return
        setDetailsError(requestError instanceof HttpError
          ? requestError.message
          : 'Не вдалося завантажити деталі.')
      })
      .finally(() => {
        if (!controller.signal.aborted) setDetailsLoading(false)
      })
  }

  function closeDetails() {
    detailsController.current?.abort()
    detailsController.current = null
    setSelected(null)
    setDetailsError('')
  }

  function resetForm() {
    setEditingId(null)
    setTitle('')
    setDescription('')
    setCategory('')
    setPriority('medium')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!title.trim()) return
    setMutationLoading(true)
    setError('')
    setSuccess('')

    const input = {
      title: title.trim(),
      description: description.trim(),
      category: category.trim() || 'General',
      priority,
    }

    try {
      if (editingId !== null) {
        const updated = await taskRepository.update(editingId, input)
        setTasks((current) => current.map((task) => task.id === editingId ? updated : task))
        setSuccess('Завдання оновлено.')
      } else {
        const created = await taskRepository.create(input)
        setTasks((current) => [created, ...current].slice(0, pageSize))
        setTotal((current) => current + 1)
        setSuccess('Нове завдання додано.')
      }
      resetForm()
    } catch (requestError) {
      setError(requestError instanceof HttpError ? requestError.message : 'Не вдалося зберегти завдання.')
    } finally {
      setMutationLoading(false)
    }
  }

  function startEdit(task: Task) {
    setEditingId(task.id)
    setTitle(task.title)
    setDescription(task.description)
    setCategory(task.category)
    setPriority(task.priority)
  }

  async function toggleCompleted(task: Task) {
    const previous = task.completed
    setTasks((current) => current.map((item) =>
      item.id === task.id ? { ...item, completed: !previous } : item,
    ))
    try {
      const updated = await taskRepository.update(task.id, { completed: !previous })
      setTasks((current) => current.map((item) => item.id === task.id ? updated : item))
      setSuccess('Статус завдання оновлено.')
    } catch (requestError) {
      setTasks((current) => current.map((item) =>
        item.id === task.id ? { ...item, completed: previous } : item,
      ))
      setError(requestError instanceof HttpError ? requestError.message : 'Не вдалося змінити статус.')
    }
  }

  async function confirmDelete() {
    if (deleteId === null) return
    setMutationLoading(true)
    try {
      await taskRepository.delete(deleteId)
      setTasks((current) => current.filter((task) => task.id !== deleteId))
      setTotal((current) => Math.max(0, current - 1))
      setDeleteId(null)
      setSelected((current) => current?.id === deleteId ? null : current)
      setSuccess('Завдання видалено.')
    } catch (requestError) {
      setError(requestError instanceof HttpError ? requestError.message : 'Не вдалося видалити завдання.')
    } finally {
      setMutationLoading(false)
    }
  }

  const currentPage = page + 1
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return (
    <main className="app">
      <header className="app__header">
        <div>
          <p className="app__eyebrow">Study Planner · REST API</p>
          <h1>Мої навчальні завдання</h1>
        </div>
        <label className="app__search">
          <span>Пошук</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Назва завдання" />
        </label>
      </header>

      {success && <div className="app__success" role="status">{success}</div>}

      <div className="app__layout">
        <section className="app__tasks" aria-label="Список завдань">
          {loading && <div className="app__loading" role="status">Loading...</div>}
          {!loading && error && (
            <div className="app__error" role="alert">
              <span>Помилка завантаження. {error}</span>
              <button type="button" onClick={() => setReload((current) => current + 1)}>Спробувати ще</button>
            </div>
          )}
          {!loading && !error && tasks.length === 0 && (
            <div className="app__empty" role="status">Завдань не знайдено.</div>
          )}
          {!loading && !error && tasks.length > 0 && (
            <ul className="app__list">
              {tasks.map((task) => (
                <li className={`app__task${task.completed ? ' app__task--completed' : ''}`} key={task.id}>
                  <button
                    className="app__check"
                    type="button"
                    aria-pressed={task.completed}
                    aria-label={`Змінити статус «${task.title}»`}
                    onClick={() => toggleCompleted(task)}
                  >
                    {task.completed ? '✓' : ''}
                  </button>
                  <button className="app__task-main" type="button" onClick={() => openDetails(task)}>
                    <strong>{task.title}</strong>
                    <span>{task.category} · {task.priority}</span>
                  </button>
                  <div className="app__task-actions">
                    <button type="button" onClick={() => startEdit(task)}>Редагувати</button>
                    <button type="button" onClick={() => setDeleteId(task.id)}>Видалити</button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <nav className="app__pagination" aria-label="Пагінація">
            <button type="button" disabled={page === 0 || loading} onClick={() => setPage((current) => current - 1)}>Попередня</button>
            <span>Сторінка {currentPage} з {totalPages}</span>
            <button type="button" disabled={(page + 1) * pageSize >= total || loading} onClick={() => setPage((current) => current + 1)}>Наступна</button>
          </nav>
        </section>

        <aside className="app__form-panel">
          <h2>{editingId === null ? 'Нове завдання' : 'Редагування'}</h2>
          <form className="app__form" onSubmit={handleSubmit}>
            <label>Назва *<input required maxLength={100} value={title} onChange={(event) => setTitle(event.target.value)} /></label>
            <label>Опис<textarea rows={3} value={description} onChange={(event) => setDescription(event.target.value)} /></label>
            <label>Категорія<input value={category} onChange={(event) => setCategory(event.target.value)} /></label>
            <label>
              Пріоритет
              <select value={priority} onChange={(event) => setPriority(event.target.value as Priority)}>
                <option value="low">Низький</option>
                <option value="medium">Середній</option>
                <option value="high">Високий</option>
              </select>
            </label>
            <div className="app__form-actions">
              {editingId !== null && <button type="button" onClick={resetForm}>Скасувати</button>}
              <button type="submit" disabled={mutationLoading}>
                {mutationLoading ? 'Збереження...' : editingId === null ? 'Додати завдання' : 'Зберегти'}
              </button>
            </div>
          </form>
        </aside>
      </div>

      {selected && (
        <div className="app__overlay" role="presentation" onMouseDown={closeDetails}>
          <section className="app__details" role="dialog" aria-modal="true" aria-label="Деталі завдання" onMouseDown={(event) => event.stopPropagation()}>
            <button className="app__details-close" type="button" onClick={closeDetails} aria-label="Закрити">×</button>
            {detailsLoading && <div className="app__loading">Loading...</div>}
            {detailsError && (
              <div className="app__error" role="alert">
                <span>{detailsError}</span>
                <button type="button" onClick={() => openDetails(selected)}>Спробувати ще</button>
              </div>
            )}
            {!detailsLoading && (
              <>
                <p className="app__eyebrow">Task #{selected.id}</p>
                <h2>{selected.title}</h2>
                <p>{selected.description || 'Опис не вказано.'}</p>
                <dl>
                  <div><dt>Категорія</dt><dd>{selected.category}</dd></div>
                  <div><dt>Пріоритет</dt><dd>{selected.priority}</dd></div>
                  <div><dt>Статус</dt><dd>{selected.completed ? 'Виконано' : 'Активне'}</dd></div>
                </dl>
              </>
            )}
          </section>
        </div>
      )}

      {deleteId !== null && (
        <div className="app__overlay" role="presentation">
          <section className="app__confirm" role="alertdialog" aria-modal="true" aria-label="Підтвердження видалення">
            <h2>Видалити завдання?</h2>
            <p>Цю дію буде виконано через REST API.</p>
            <div className="app__confirm-actions">
              <button type="button" onClick={() => setDeleteId(null)} disabled={mutationLoading}>Скасувати</button>
              <button type="button" onClick={confirmDelete} disabled={mutationLoading}>
                {mutationLoading ? 'Видалення...' : 'Видалити'}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  )
}

export default App
