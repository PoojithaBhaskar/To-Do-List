document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("new-task");
    const dueDateInput = document.getElementById("due-date");
    const categorySelect = document.getElementById("category");
    const addTaskButton = document.getElementById("add-task-button");
    const apiUrl = "https://jsonplaceholder.typicode.com/todos";
    const taskList = document.getElementById("task-list");

    addTaskButton.addEventListener("click", function() {
        let taskText = taskInput.value.trim();
        let dueDate = dueDateInput.value;
        let category = categorySelect.value;

        if (taskText !== "") {
            addTask(taskText, dueDate, category);
            taskInput.value = "";
            dueDateInput.value = "";
        }
    });

    function addTask(taskText, dueDate, category) {
        const newTask = { title: taskText, completed: false, dueDate, category };
        fetch(apiUrl, {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(newTask),
        })
        .then((response) => response.json())
        .then((task) => {
            console.log(task);
            displayTask(task.title, task.id, task.dueDate, task.category, task.completed);
        })
        .catch((error) => console.error("Failed to add task", error));
    }

    function displayTask(title, id, dueDate, category, completed) {
        const li = document.createElement("li");
        li.setAttribute("data-id", id);
        li.setAttribute("data-category", category);
        li.style.backgroundColor = getPriorityColor(category);
        if (completed) {
            li.classList.add("done");
        }

        const span = document.createElement("span");
        span.textContent = `${title} (Due: ${dueDate})`;

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.className = "edit-btn";
        editBtn.addEventListener("click", () => editTask(span, id));

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";
        deleteBtn.addEventListener("click", () => deleteTask(id, li));

        const doneBtn = document.createElement("button");
        doneBtn.textContent = "Done";
        doneBtn.className = "done-btn";
        doneBtn.addEventListener("click", () => markAsDone(id, li));

        li.appendChild(span);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        li.appendChild(doneBtn);

        taskList.appendChild(li);
    }

    function markAsDone(id, li) {
        const completed = !li.classList.contains("done");
        const updateTask = { completed };

        fetch(`${apiUrl}/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updateTask),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to update task status");
            }
            return response.json();
        })
        .then(() => {
            if (completed) {
                li.classList.add("done");
            } else {
                li.classList.remove("done");
            }
        })
        .catch(error => console.error("Error in updating task status", error));
    }

    function editTask(span, id) {
        const newText = prompt("Edit Task", span.textContent);
        if (newText !== null && newText.trim() !== "") {
            const updateTask = { title: newText, completed: false };
            fetch(`${apiUrl}/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updateTask),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to edit task");
                }
                return response.json();
            })
            .then(() => {
                span.textContent = newText;
            })
            .catch(error => console.error("Error in editing task", error));
        }
    }

    function deleteTask(id, li) {
        fetch(`${apiUrl}/${id}`, {
            method: "DELETE"
        })
        .then(response => {
            if (response.ok) {
                taskList.removeChild(li);
            } else {
                throw new Error("Failed to delete task");
            }
        })
        .catch(error => console.error("Error in deleting task", error));
    }

    function getPriorityColor(category) {
        switch (category) {
            case 'Work':
                return '#FFDDC1'; // Light pink
            case 'Personal':
                return '#D1FAE5'; // Light green
            default:
                return '#FFFFFF'; // White
        }
    }
});
