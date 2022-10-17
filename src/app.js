import '@mdi/font/css/materialdesignicons.css'
import './styles/reset.css';
import './styles/styles.css';
import primaryNav from './scripts/primaryNav';
import todoModal from './scripts/todoModal';
import TodoRenderer from './scripts/TodoRenderer';

const todos = [];
const todoRenderer = new TodoRenderer(document.querySelector('.todos'));

const main = document.querySelector('main');
const writeTodoInput = document.querySelector('.write-todo-bar input[type=text]');

primaryNav.addEventListener('openPrimaryNav', (e) => {
  main.inert = true;
});

primaryNav.addEventListener('closePrimaryNav', (e) => {
  main.inert = false;
});

todoModal.addEventListener('backTodoModal', (e) => {
  main.inert = false;
  primaryNav.inert = false;
});

todoModal.addEventListener('showTodoModal', (e) => {
  main.inert = true;
  primaryNav.inert = true;
});

todoModal.addEventListener('confirmTodoModal', (e) => {
  const todo = e.detail;
  todos.add(todo);
  TodoRenderer.renderTodo(todo);
});

writeTodoInput.addEventListener('keyup', (e) => {
  if (e.key !== 'Enter') return;

  const input = writeTodoInput.value;
  if (!input) return;

  writeTodoInput.value = '';
  todoModal.show(input);
});