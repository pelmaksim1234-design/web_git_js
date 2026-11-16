import { useMemo, useState } from 'react'
import { Header } from './components/Header'
import { TaskFilters } from './components/TaskFilters'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'
import { TaskStats } from './components/TaskStats'
import { Toast } from './components/Toast'
import { useTaskContext } from './hooks/useTaskContext'
import type { Task } from './types/task'
import './styles/app.scss'

function App() {
  const { tasks, filter, resetTasks } = useTaskContext()
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null)
  const visibleTasks = useMemo(() => {
    if (filter === 'active') return tasks.filter((task) => !task.completed)
    if (filter === 'completed') return tasks.filter((task) => task.completed)
    return tasks
  }, [filter, tasks])

  return (
    <main className="app">
      <Header />
      <div className="app__content">
        <section className="app__primary" aria-label="Навчальні завдання">
          <div className="app__toolbar">
            <span className="app__toolbar-label">{visibleTasks.length} {visibleTasks.length === 1 ? 'завдання' : 'завдань'}</span>
            <button className="app__reset" onClick={resetTasks} type="button">Скинути дані</button>
          </div>
          <TaskForm taskToEdit={taskToEdit} onCancelEdit={() => setTaskToEdit(null)} />
          <TaskStats />
          <TaskFilters />
          <TaskList onEdit={setTaskToEdit} />
        </section>
        <aside className="app__aside">
          <p className="app__eyebrow">Ваш фокус</p>
          <h2>Маленький крок щодня — великий результат.</h2>
          <p>Додавайте навчальні цілі, визначайте пріоритети та відстежуйте свій прогрес.</p>
          <div className="app__aside-mark" aria-hidden="true">✦</div>
        </aside>
      </div>
      <footer className="app__footer">Study Planner · Лабораторна робота №9</footer>
      <Toast />
    </main>
  )
}

export default App
