import { useState, type FormEvent } from 'react'
import type { Priority, Task } from '../types/task'
import './TaskForm.scss'

type TaskFormProps = {
  onAdd: (task: Omit<Task, 'id' | 'completed'>) => void
}

export function TaskForm({ onAdd }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      setError('Вкажіть назву завдання.')
      return
    }

    onAdd({
      title: trimmedTitle,
      description: description.trim(),
      category: category.trim() || 'Без категорії',
      priority,
    })
    setTitle('')
    setDescription('')
    setCategory('')
    setPriority('medium')
    setError('')
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="task-form__heading">
        <div>
          <p className="task-form__eyebrow">Планування</p>
          <h1>Що вивчимо сьогодні?</h1>
        </div>
        <span className="task-form__sparkle" aria-hidden="true">✳</span>
      </div>
      <label className="task-form__field">
        <span>Назва завдання <span className="task-form__required">*</span></span>
        <input
          autoComplete="off"
          maxLength={100}
          onChange={(event) => {
            setTitle(event.target.value)
            if (error) setError('')
          }}
          placeholder="Наприклад, опрацювати React hooks"
          required
          value={title}
        />
      </label>
      <label className="task-form__field">
        <span>Короткий опис</span>
        <textarea
          maxLength={240}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Що саме потрібно зробити?"
          rows={2}
          value={description}
        />
      </label>
      <div className="task-form__row">
        <label className="task-form__field">
          <span>Категорія</span>
          <input
            maxLength={40}
            onChange={(event) => setCategory(event.target.value)}
            placeholder="Наприклад, React"
            value={category}
          />
        </label>
        <label className="task-form__field">
          <span>Пріоритет</span>
          <select onChange={(event) => setPriority(event.target.value as Priority)} value={priority}>
            <option value="low">Низький</option>
            <option value="medium">Середній</option>
            <option value="high">Високий</option>
          </select>
        </label>
      </div>
      <div className="task-form__actions">
        {error && <span className="task-form__error" role="alert">{error}</span>}
        <button className="task-form__submit" type="submit">
          <span aria-hidden="true">+</span> Додати завдання
        </button>
      </div>
    </form>
  )
}
