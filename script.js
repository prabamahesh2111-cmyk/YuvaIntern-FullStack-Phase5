
const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");
const message = document.getElementById("message");

let tasks = [];

try {
    const savedTasks = JSON.parse(
        localStorage.getItem("prabaTasks") || "[]"
    );

    if (Array.isArray(savedTasks)) {
        tasks = savedTasks.filter(
            task =>
                task &&
                typeof task.text === "string" &&
                typeof task.completed === "boolean"
        );
    }
} catch (error) {
    tasks = [];
}

function saveTasks() {
    try {
        localStorage.setItem("prabaTasks", JSON.stringify(tasks));
    } catch (error) {
        message.textContent = "Unable to save tasks in this browser.";
    }
}

function renderTasks() {
    taskList.replaceChildren();

    emptyMessage.hidden = tasks.length > 0;

    tasks.forEach((task, index) => {
        const item = document.createElement("li");
        item.className = "task-item";

        if (task.completed) {
            item.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute(
            "aria-label",
            "Mark task as completed"
        );

        checkbox.addEventListener("change", () => {
            tasks[index].completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        const text = document.createElement("span");
        text.className = "task-text";
        text.textContent = task.text;

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
            message.textContent = "Task deleted.";
        });

        item.append(checkbox, text, deleteButton);
        taskList.appendChild(item);
    });
}

function addTask() {
    const text = taskInput.value.trim();

    if (text === "") {
        message.textContent = "Please enter a task first.";
        taskInput.focus();
        return;
    }

    tasks.push({
        text: text,
        completed: false
    });

    saveTasks();
    renderTasks();

    taskInput.value = "";
    message.textContent = "Task added successfully!";
    taskInput.focus();
}

addButton.addEventListener("click", addTask);

taskInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        addTask();
    }
});

renderTasks();
