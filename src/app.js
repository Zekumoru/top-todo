import '@mdi/font/css/materialdesignicons.css'
import './styles/reset.css';
import './styles/styles.css';
import primaryNav from './scripts/primaryNav';
import todoModal from './scripts/todoModal';
import TodoRenderer from './scripts/TodoRenderer';
import Todo from './scripts/Todo';

const todos = [];
const todoRenderer = new TodoRenderer(document.querySelector('.todos'), todos);

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
  todos.push(todo);
  todoRenderer.renderTodo(todo);
});

main.addEventListener('checkedTodo', (e) => {
  const { todo } = e.detail;
  todo.checked = true;
});

main.addEventListener('uncheckedTodo', (e) => {
  const { todo } = e.detail;
  todo.checked = false;
});

main.addEventListener('deleteTodo', (e) => {
  const { todo, card } = e.detail;
  const indexToRemove = todos.findIndex(t => t === todo);
  todos.splice(indexToRemove, 1);
  todoRenderer.removeCard(card);
});

writeTodoInput.addEventListener('keyup', (e) => {
  if (e.key !== 'Enter') return;

  const input = writeTodoInput.value;
  if (!input) return;

  writeTodoInput.value = '';
  todoModal.show(input);
});