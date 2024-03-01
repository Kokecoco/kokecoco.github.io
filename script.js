const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');

// Function to get tasks from local storage
function getTasks() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

// Function to save tasks to local storage
function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to render tasks
function renderTasks() {
    taskList.innerHTML = '';
    const tasks = getTasks();
    tasks.forEach((task, index) => {
        const listItem = document.createElement('li');
        listItem.classList.add('task');
        if (task.completed) {
            listItem.classList.add('completed');
        }
        listItem.innerHTML = `
            <strong>${task.title}</strong>
            <p>${task.content}</p>
            <p>Deadline: ${task.deadline}</p>
            <p>Priority: ${task.priority}</p>
            <button onclick="toggleTaskCompletion(${index})">${task.completed ? 'Undo' : 'Complete'}</button>
            <button onclick="editTask(${index})">Edit</button>
            <button onclick="deleteTask(${index})">Delete</button>
        `;
        taskList.appendChild(listItem);
    });
}

// Function to delete a task
function deleteTask(index) {
    const tasks = getTasks();
    tasks.splice(index, 1);
    saveTasks(tasks);
    renderTasks();
}

// Function to toggle task completion
function toggleTaskCompletion(index) {
    const tasks = getTasks();
    tasks[index].completed = !tasks[index].completed;
    saveTasks(tasks);
    renderTasks();
}

// Function to edit a task
function editTask(index) {
    const tasks = getTasks();
    const editedTask = tasks[index];
    const newTitle = prompt('Enter new title', editedTask.title);
    if (newTitle) {
        editedTask.title = newTitle;
        saveTasks(tasks);
        renderTasks();
    }
}

// Event listener for form submission
taskForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const title = document.getElementById('titleInput').value;
    const content = document.getElementById('contentInput').value;
    const deadline = document.getElementById('deadlineInput').value;
    const priority = document.getElementById('priorityInput').value;
    addTask(title, content, deadline, priority);
    taskForm.reset();
});

// Initial rendering of tasks
renderTasks();

// Function to request notification permission
function requestNotificationPermission() {
    Notification.requestPermission(function(result) {
        if (result === 'granted') {
            console.log('Notification permission granted');
        }
    });
}

// Function to display a notification
function displayNotification(title, options) {
    if (Notification.permission === 'granted') {
        navigator.serviceWorker.getRegistration().then(function(reg) {
            reg.showNotification(title, options);
        });
    }
}

// Function to add a new task
function addTask(title, content, deadline, priority) {
    const tasks = getTasks();
    tasks.push({ title, content, deadline, priority, completed: false });
    saveTasks(tasks);
    renderTasks();

    // Display a notification for the new task
    displayNotification('New Task Added', { body: title });
}
