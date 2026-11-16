import type { Task } from '../types/task'

export const initialTasks: Task[] = [
  {
    id: 'task-react-components',
    title: 'Опрацювати компоненти React',
    description: 'Розібратися з JSX, props та композицією компонентів.',
    completed: false,
    priority: 'high',
    category: 'React',
  },
  {
    id: 'task-typescript-exercises',
    title: 'Виконати вправи з TypeScript',
    description: 'Практика типів, union та роботи з масивами.',
    completed: true,
    priority: 'medium',
    category: 'TypeScript',
  },
  {
    id: 'task-review-hooks',
    title: 'Повторити useState',
    description: 'Створити невеликий компонент зі станом і подіями.',
    completed: false,
    priority: 'low',
    category: 'React',
  },
]
