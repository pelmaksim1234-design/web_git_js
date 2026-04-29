'use strict';

const startTasks = [
    {
        id: 1,
        text: 'Зробити лабораторну роботу',
        done: false,
        createdAt: '2026-04-12T10:00:00',
        updatedAt: '2026-04-12T10:00:00'
    },
    {
        id: 2,
        text: 'Перевірити код',
        done: true,
        createdAt: '2026-04-13T11:00:00',
        updatedAt: '2026-04-13T12:30:00'
    }
];

let tasks = [...startTasks];
let currentSort = 'created';
let nextId = 3;
let toastTimer = null;

const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const emptyText = document.getElementById('emptyText');
const sortButtons = document.getElementById('sortButtons');
const allCount = document.getElementById('allCount');
const doneCount = document.getElementById('doneCount');
const toast = document.getElementById('toast');

const addTask = (items, task) => [...items, task];

const deleteTask = (items, id) => items.filter((task) => task.id !== id);

const toggleTask = (items, id, updatedAt) => items.map((task) => (
    task.id === id
        ? { ...task, done: !task.done, updatedAt }
        : task
));

const editTask = (items, id, text, updatedAt) => items.map((task) => (
    task.id === id
        ? { ...task, text, updatedAt }
        : task
));

const sortTasks = (items, sortType) => {
    const sortedTasks = [...items];

    if (sortType === 'created') {
        return sortedTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    if (sortType === 'done') {
        return sortedTasks.sort((a, b) => Number(a.done) - Number(b.done));
    }

    if (sortType === 'updated') {
        return sortedTasks.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }

    return sortedTasks;
};

const getDoneCount = (items) => items.filter((task) => task.done).length;

const formatDate = (date) => new Date(date).toLocaleString('uk-UA');

const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
};

const createButton = (text, className, active, onClick) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = text;
    button.className = className;

    if (active) {
        button.classList.add('active');
    }

    button.addEventListener('click', onClick);
    return button;
};

const renderSortButtons = () => {
    const buttons = [
        createButton('За датою додавання', 'light-btn', currentSort === 'created', () => {
            currentSort = 'created';
            render();
        }),
        createButton('За станом виконання', 'light-btn', currentSort === 'done', () => {
            currentSort = 'done';
            render();
        }),
        createButton('За датою оновлення', 'light-btn', currentSort === 'updated', () => {
            currentSort = 'updated';
            render();
        })
    ];

    sortButtons.replaceChildren(...buttons);
};

const createInfoText = (text) => {
    const element = document.createElement('p');
    element.className = 'small-text';
    element.textContent = text;
    return element;
};

const createTaskItem = (task) => {
    const item = document.createElement('li');
    item.className = 'task-item add-animation';

    if (task.done) {
        item.classList.add('done');
    }

    const viewBlock = document.createElement('div');
    viewBlock.className = 'task-view';

    const taskText = document.createElement('p');
    taskText.className = 'task-text';
    taskText.textContent = task.text;
    taskText.title = 'Натисніть, щоб змінити стан виконання';

    const status = document.createElement('span');
    status.className = 'status';
    status.textContent = task.done ? 'Виконано' : 'Не виконано';

    const info = document.createElement('div');
    info.className = 'task-info';
    info.append(
        createInfoText(`Створено: ${formatDate(task.createdAt)}`),
        createInfoText(`Оновлено: ${formatDate(task.updatedAt)}`)
    );

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const editButton = createButton('Редагувати', 'edit-btn', false, () => {
        item.classList.add('editing');
        editInput.focus();
    });

    const deleteButton = createButton('Видалити', 'delete-btn', false, () => {
        item.classList.add('delete-animation');

        setTimeout(() => {
            tasks = deleteTask(tasks, task.id);
            render();
            showToast('Завдання видалено.');
        }, 300);
    });

    const editForm = document.createElement('form');
    editForm.className = 'edit-form';

    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.minLength = 3;
    editInput.maxLength = 100;
    editInput.required = true;
    editInput.value = task.text;

    const saveButton = document.createElement('button');
    saveButton.className = 'main-btn';
    saveButton.type = 'submit';
    saveButton.textContent = 'Зберегти';

    const cancelButton = createButton('Скасувати', 'light-btn', false, () => {
        item.classList.remove('editing');
    });

    taskText.addEventListener('click', () => {
        tasks = toggleTask(tasks, task.id, new Date().toISOString());
        render();
    });

    editForm.addEventListener('submit', (event) => {
        event.preventDefault();

        if (!editForm.reportValidity()) {
            return;
        }

        tasks = editTask(tasks, task.id, editInput.value.trim(), new Date().toISOString());
        render();
        showToast('Завдання оновлено.');
    });

    actions.append(editButton, deleteButton);
    viewBlock.append(taskText, status, info, actions);
    editForm.append(editInput, saveButton, cancelButton);
    item.append(viewBlock, editForm);

    return item;
};

const renderTasks = () => {
    const visibleTasks = sortTasks(tasks, currentSort);
    const taskItems = visibleTasks.map(createTaskItem);

    taskList.replaceChildren(...taskItems);
    emptyText.hidden = tasks.length !== 0;
};

const renderStats = () => {
    allCount.textContent = tasks.length;
    doneCount.textContent = getDoneCount(tasks);
};

const render = () => {
    renderSortButtons();
    renderTasks();
    renderStats();
};

taskForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!taskForm.reportValidity()) {
        return;
    }

    const newTask = {
        id: nextId,
        text: taskInput.value.trim(),
        done: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    tasks = addTask(tasks, newTask);
    nextId += 1;
    taskForm.reset();
    render();
    showToast('Завдання додано.');
});

render();
