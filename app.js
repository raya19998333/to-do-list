const input = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const listEl = document.getElementById('todoList');
const countEl = document.getElementById('count');
const filterBtns = document.querySelectorAll('.filter-btn');

let todos = JSON.parse(localStorage.getItem('raya_todos') || '[]');
let filter = 'all';

function save() {
  localStorage.setItem('raya_todos', JSON.stringify(todos));
}

function render() {
  listEl.innerHTML = '';

  const filtered = todos.filter((t) => {
    if (filter === 'all') return true;
    if (filter === 'active') return !t.done;
    return t.done;
  });

  filtered.forEach((todo) => {
    const li = document.createElement('li');
    li.className = 'item';
    li.dataset.id = todo.id;

    li.innerHTML = `
      <div>
        <input type="checkbox" ${todo.done ? 'checked' : ''}>
        <span class="task ${todo.done ? 'completed' : ''}">${todo.text}</span>
      </div>
      <div>
        <button class="icon-btn edit">✎</button>
        <button class="icon-btn del">🗑</button>
      </div>
    `;

    li.querySelector('input').addEventListener('change', () => {
      toggleDone(todo.id);
    });

    li.querySelector('.del').addEventListener('click', () => {
      deleteTodo(todo.id);
    });

    li.querySelector('.edit').addEventListener('click', () => {
      const newText = prompt('تعديل المهمة:', todo.text);
      if (newText) updateText(todo.id, newText);
    });

    listEl.appendChild(li);
  });

  countEl.textContent = `${todos.filter((t) => !t.done).length} مهام نشطة`;
}

function addTodo(text) {
  todos.unshift({ id: Date.now() + '', text, done: false });
  save();
  render();
}

function toggleDone(id) {
  todos = todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
  save();
  render();
}

function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  save();
  render();
}

function updateText(id, newText) {
  todos = todos.map((t) => (t.id === id ? { ...t, text: newText } : t));
  save();
  render();
}

addBtn.addEventListener('click', () => {
  const v = input.value.trim();
  if (!v) return;
  addTodo(v);
  input.value = '';
});

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addBtn.click();
});

filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    filter = btn.dataset.filter;
    render();
  });
});

render();
