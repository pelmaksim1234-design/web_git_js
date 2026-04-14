const tasks = [
    {
        id: 1,
        text: "Зробити лабораторну",
        done: false,
        createdAt: "2026-04-12T10:00:00",
        updatedAt: "2026-04-12T10:00:00"
    },
    {
        id: 2,
        text: "Перевірити код",
        done: true,
        createdAt: "2026-04-13T10:00:00",
        updatedAt: "2026-04-13T12:00:00"
    }
];

let currentSort = "created";
let nextId = 3;

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const emptyTaskText = document.getElementById("emptyTaskText");
const allCount = document.getElementById("allCount");
const doneCount = document.getElementById("doneCount");
const sortButtons = document.getElementById("sortButtons");
const toast = document.getElementById("toast");

// Показуємо коротке повідомлення про дію користувача.
function showToast(text) {
    toast.textContent = text;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

// Повертаємо копію масиву у відсортованому вигляді.
function getSortedTasks() {
    const newTasks = [...tasks];

    if (currentSort === "created") {
        newTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    if (currentSort === "updated") {
        newTasks.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }

    if (currentSort === "done") {
        newTasks.sort((a, b) => Number(a.done) - Number(b.done));
    }

    return newTasks;
}

// Малюємо кнопки сортування.
function drawSortButtons() {
    sortButtons.innerHTML = "";

    const buttons = [
        { text: "За датою додавання", value: "created" },
        { text: "За станом", value: "done" },
        { text: "За датою оновлення", value: "updated" }
    ];

    for (let i = 0; i < buttons.length; i += 1) {
        const btn = document.createElement("button");
        btn.textContent = buttons[i].text;
        if (currentSort === buttons[i].value) {
            btn.classList.add("active");
        }
        btn.addEventListener("click", () => {
            currentSort = buttons[i].value;
            drawSortButtons();
            renderTasks();
        });
        sortButtons.appendChild(btn);
    }
}

// Оновлюємо кількість всіх і виконаних завдань.
function updateCounts() {
    allCount.textContent = tasks.length;
    doneCount.textContent = tasks.filter((task) => task.done).length;
}

// Повністю перемальовуємо список завдань.
function renderTasks() {
    const list = getSortedTasks();
    taskList.innerHTML = "";

    if (list.length === 0) {
        emptyTaskText.style.display = "block";
    } else {
        emptyTaskText.style.display = "none";
    }

    for (let i = 0; i < list.length; i += 1) {
        const task = list[i];
        const item = document.createElement("div");
        item.className = "task-item";
        if (task.done) {
            item.classList.add("done");
        }

        item.innerHTML = `
            <div class="task-view-row">
                <div class="task-top">
                    <p class="task-text">${task.text}</p>
                    <div class="task-buttons">
                        <button class="edit-btn">Редагувати</button>
                        <button class="delete-btn">Видалити</button>
                    </div>
                </div>
                <p>Створено: ${new Date(task.createdAt).toLocaleString("uk-UA")}</p>
                <p>Оновлено: ${new Date(task.updatedAt).toLocaleString("uk-UA")}</p>
                <p>Стан: ${task.done ? "Виконано" : "Не виконано"}</p>
            </div>
            <div class="task-edit-row">
                <input class="edit-input" type="text" minlength="3" maxlength="120" required value="${task.text}">
                <button class="save-btn">Зберегти</button>
                <button class="cancel-btn">Скасувати</button>
            </div>
        `;

        const text = item.querySelector(".task-text");
        const editBtn = item.querySelector(".edit-btn");
        const deleteBtn = item.querySelector(".delete-btn");
        const saveBtn = item.querySelector(".save-btn");
        const cancelBtn = item.querySelector(".cancel-btn");
        const editInput = item.querySelector(".edit-input");

        text.addEventListener("click", () => {
            // По кліку відмічаємо завдання як виконане або невиконане.
            task.done = !task.done;
            task.updatedAt = new Date().toISOString();
            renderTasks();
            updateCounts();
        });

        editBtn.addEventListener("click", () => {
            // Показуємо поле редагування прямо в списку.
            item.classList.add("editing");
        });

        cancelBtn.addEventListener("click", () => {
            item.classList.remove("editing");
        });

        saveBtn.addEventListener("click", () => {
            // Перед збереженням перевіряємо поле.
            if (!editInput.reportValidity()) {
                return;
            }
            task.text = editInput.value.trim();
            task.updatedAt = new Date().toISOString();
            renderTasks();
            showToast("Завдання оновлено");
        });

        deleteBtn.addEventListener("click", () => {
            // Даємо анімації програтись і тільки потім видаляємо.
            item.classList.add("removing");
            setTimeout(() => {
                const index = tasks.findIndex((oneTask) => oneTask.id === task.id);
                if (index !== -1) {
                    tasks.splice(index, 1);
                }
                renderTasks();
                updateCounts();
                showToast("Завдання видалено");
            }, 300);
        });

        taskList.appendChild(item);
    }
}

taskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // Запускаємо стандартну HTML5-валідацію.
    if (!taskForm.reportValidity()) {
        return;
    }

    // Додаємо нове завдання в масив.
    tasks.push({
        id: nextId,
        text: taskInput.value.trim(),
        done: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    });

    nextId += 1;
    taskForm.reset();
    renderTasks();
    updateCounts();
    showToast("Завдання додано");
});

drawSortButtons();
renderTasks();
updateCounts();
