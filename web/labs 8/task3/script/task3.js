const initialTasks = [
  {
    id: 'task-1',
    title: 'Підготувати структуру',
    text: 'Створити окремі папки для HTML, CSS та JavaScript.',
    tag: 'layout',
    column: 'todo',
  },
  {
    id: 'task-2',
    title: 'Реалізувати DOM',
    text: 'Вивести картки завдань через JavaScript.',
    tag: 'dom',
    column: 'todo',
  },
  {
    id: 'task-3',
    title: 'Drag and Drop',
    text: 'Додати події dragstart, dragover, drop та dragend.',
    tag: 'events',
    column: 'progress',
  },
  {
    id: 'task-4',
    title: 'Адаптивність',
    text: 'Перевірити вигляд дошки на вузькому екрані.',
    tag: 'css',
    column: 'review',
  },
  {
    id: 'task-5',
    title: 'Фінальна перевірка',
    text: 'Переконатися, що задачі переміщуються між колонками.',
    tag: 'qa',
    column: 'done',
  },
];

let tasks = [...initialTasks];
let draggedTaskId = null;

const board = document.querySelector('#kanbanBoard');
const resetButton = document.querySelector('#resetBoard');

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (symbol) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }[symbol]));
}

function renderTask(task) {
  return `
    <article class="task" draggable="true" data-task-id="${task.id}">
      <h3>${escapeHtml(task.title)}</h3>
      <p>${escapeHtml(task.text)}</p>
      <span class="tag">${escapeHtml(task.tag)}</span>
    </article>
  `;
}

function renderBoard() {
  document.querySelectorAll('.task-list').forEach((list) => {
    const column = list.dataset.list;
    list.innerHTML = tasks
      .filter((task) => task.column === column)
      .map(renderTask)
      .join('');
  });
}

function moveTask(taskId, column) {
  tasks = tasks.map((task) => (
    task.id === taskId ? { ...task, column } : task
  ));
  renderBoard();
}

board.addEventListener('dragstart', (event) => {
  const task = event.target.closest('.task');

  if (!task) {
    return;
  }

  draggedTaskId = task.dataset.taskId;
  task.classList.add('dragging');
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', draggedTaskId);
});

board.addEventListener('dragend', (event) => {
  event.target.closest('.task')?.classList.remove('dragging');
  document.querySelectorAll('.task-list').forEach((list) => list.classList.remove('over'));
  draggedTaskId = null;
});

board.addEventListener('dragover', (event) => {
  const list = event.target.closest('.task-list');

  if (!list) {
    return;
  }

  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
  document.querySelectorAll('.task-list').forEach((item) => item.classList.remove('over'));
  list.classList.add('over');
});

board.addEventListener('dragleave', (event) => {
  const list = event.target.closest('.task-list');

  if (list && !list.contains(event.relatedTarget)) {
    list.classList.remove('over');
  }
});

board.addEventListener('drop', (event) => {
  const list = event.target.closest('.task-list');

  if (!list) {
    return;
  }

  event.preventDefault();
  const taskId = event.dataTransfer.getData('text/plain') || draggedTaskId;
  list.classList.remove('over');

  if (taskId) {
    moveTask(taskId, list.dataset.list);
  }
});

resetButton.addEventListener('click', () => {
  tasks = [...initialTasks];
  renderBoard();
});

renderBoard();
