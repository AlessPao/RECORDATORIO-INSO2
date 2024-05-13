let tasks = [];

// Cargar tareas desde el Local Storage al cargar la página
document.addEventListener('DOMContentLoaded', loadTasksFromLocalStorage);

const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');

taskForm.addEventListener('submit', addTask);

function addTask(e) {
    e.preventDefault();

    const taskTitle = document.getElementById('taskTitle').value;
    const taskDescription = document.getElementById('taskDescription').value;
    const taskDate = document.getElementById('taskDate').value;
    const taskEmail = document.getElementById('taskEmail').value;

    const task = {
        title: taskTitle,
        description: taskDescription,
        date: formatDate(taskDate),
        email: taskEmail,
        completed: false
    };

    tasks.push(task);

    displayTask(task);
    sendEmailNotification(task);

    saveTasks();

    taskForm.reset();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function displayTask(task) {
    const li = document.createElement('li');
    const taskInfo = document.createElement('div');
    const actions = document.createElement('div');

    taskInfo.innerHTML = `
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <p>Fecha de la tarea: ${task.date}</p>
        <p>Estado: ${task.completed ? 'Completada' : 'Pendiente'}</p>
    `;

    actions.innerHTML = `
        <button class="complete-btn" onclick="completeTask(this)">
            <i class="fas fa-check"></i>
        </button>
        <button class="edit-btn" onclick="editTask(this)">
            <i class="fas fa-pencil-alt"></i>
        </button>
        <button class="delete-btn" onclick="deleteTask(this)">
            <i class="fas fa-trash"></i>
        </button>
    `;

    li.appendChild(taskInfo);
    li.appendChild(actions);
    taskList.appendChild(li);

    if (task.completed) {
        li.classList.add('completed');
    }
}

function completeTask(button) {
    const li = button.parentElement.parentElement;
    const taskIndex = Array.from(taskList.children).indexOf(li);

    tasks[taskIndex].completed = !tasks[taskIndex].completed;
    li.classList.toggle('completed');

    saveTasks();
}

function editTask(button) {
    const li = button.parentElement.parentElement;
    const taskIndex = Array.from(taskList.children).indexOf(li);

    const task = tasks[taskIndex];

    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskDescription').value = task.description;
    document.getElementById('taskDate').value = formatDate(task.date, true);

    tasks.splice(taskIndex, 1);
    taskList.removeChild(li);

    saveTasks();
}

function deleteTask(button) {
    const li = button.parentElement.parentElement;
    const taskIndex = Array.from(taskList.children).indexOf(li);

    tasks.splice(taskIndex, 1);
    taskList.removeChild(li);

    saveTasks();
}

function sendEmailNotification(task) {
    const templateParams = {
        to_name: task.email.split('@')[0],
        task_title: task.title,
        task_description: task.description,
        task_date: task.date,
        to_email: task.email
    };

    emailjs.send("service_zxj882s", "template_ceeg5st", templateParams)
        .then(function(response) {
            console.log('Notificación por correo electrónico enviada', response.status, response.text);
        }, function(error) {
            console.error('Error al enviar la notificación por correo electrónico', error);
        });
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        tasks.forEach(function(task) {
            displayTask(task);
        });
    }
}