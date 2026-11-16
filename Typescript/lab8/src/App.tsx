import { useMemo, useState } from 'react'
import { Header } from './components/Header'
import { TaskFilters } from './components/TaskFilters'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'
import { TaskStats } from './components/TaskStats'
import { initialTasks } from './data/initialTasks'
import type { Task, TaskFilter } from './types/task'
import './styles/app.scss'

function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [filter, setFilter] = useState<TaskFilter>('all')

  const visibleTasks = useMemo(() => {
    if (filter === 'active') return tasks.filter((task) => !task.completed)
    if (filter === 'completed') return tasks.filter((task) => task.completed)
    return tasks
  }, [filter, tasks])

  function addTask(taskData: Omit<Task, 'id' | 'completed'>) {
    setTasks((currentTasks) => [
      { ...taskData, id: crypto.randomUUID(), completed: false },
      ...currentTasks,
    ])
  }

  function toggleTask(id: string) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    )
  }

  function deleteTask(id: string) {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id))
  }

  return (
    <main className="app">
      <Header />
      <div className="app__content">
        <section className="app__primary" aria-label="Навчальні завдання">
          <TaskForm onAdd={addTask} />
          <TaskStats tasks={tasks} />
          <TaskFilters activeFilter={filter} onChange={setFilter} />
          <TaskList tasks={visibleTasks} onToggle={toggleTask} onDelete={deleteTask} />
        </section>
        <aside className="app__aside">
          <p className="app__eyebrow">Ваш фокус</p>
          <h2>Маленький крок щодня — великий результат.</h2>
          <p>Додавайте навчальні цілі, визначайте пріоритети та відстежуйте свій прогрес.</p>
          <div className="app__aside-mark" aria-hidden="true">✦</div>
        </aside>
      </div>
      <footer className="app__footer">Study Planner · Лабораторна робота №8</footer>
    </main>
  )
}

export default App
