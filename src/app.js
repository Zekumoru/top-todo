import '@mdi/font/css/materialdesignicons.css'
import './styles/reset.css';
import './styles/styles.css';
import primaryNav from './scripts/primaryNav';
import writeTodoBar from './scripts/writeTodoBar';
import todoModal from './scripts/todoModal';
import TodoRenderer from './scripts/TodoRenderer';

const todos = [];
const todoRenderer = new TodoRenderer(document.querySelector('.todos'), todos);

const main = document.querySelector('main');

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
  const { todo, card } = e.detail;
  todo.checked = true;
  todoRenderer.removeCard(card);
  todoRenderer.renderTodo(todo);
});

main.addEventListener('uncheckedTodo', (e) => {
  const { todo, card } = e.detail;
  todo.checked = false;
  todoRenderer.removeCard(card);
  todoRenderer.renderTodo(todo);
});

main.addEventListener('deleteTodo', (e) => {
  const { todo, card } = e.detail;
  const indexToRemove = todos.findIndex(t => t === todo);
  todos.splice(indexToRemove, 1);
  todoRenderer.removeCard(card);
});

main.addEventListener('enterWriteTodoInput', (e) => {
  todoModal.show(e.detail);
});