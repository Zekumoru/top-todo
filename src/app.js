import '@mdi/font/css/materialdesignicons.css'
import 'normalize.css/normalize.css'
import './styles/reset.css';
import './styles/styles.css';
import primaryNav from './scripts/primaryNav';
import writeTodoBar from './scripts/writeTodoBar';
import todoModal from './scripts/todoModal';
import TodoRenderer from './scripts/TodoRenderer/TodoRenderer';
import Todo from './scripts/Todo';

const projectModal = document.querySelector('.project-modal');
projectModal.querySelector('button.back').addEventListener('click', (e) => {
  projectModal.style.display = 'none';
});

const todos = [];
const todoRenderer = new TodoRenderer(document.querySelector('.todos'), todos);

const main = document.querySelector('main');

document.addEventListener('click', (e) => {
  const popup = main.querySelector('.pop-up');
  if (!popup) return;

  let parent = e.target.parentElement;
  while (parent) {
    if (parent === popup) return;
    parent = parent.parentElement;
  }
  
  popup.close(e.target);
}, true);

window.addEventListener('resize', (e) => {
  if (primaryNav.inert) return;
  if (!primaryNav.style.left) return; // if primary nav is hidden on mobile
  if (window.innerWidth > 768) {
    main.inert = false;
    return;
  }

  main.inert = true;
});

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

main.addEventListener('editTodo', (e) => {
  const { todo, card } = e.detail;
  todoModal.show(todo, (editedTodo) => {
    todos.splice(todos.findIndex(t => t === todo), 1);
    todoRenderer.removeCard(card);
    todos.push(editedTodo);
    todoRenderer.renderTodo(editedTodo);
  });
});

main.addEventListener('deleteTodo', (e) => {
  const { todo, card } = e.detail;
  const indexToRemove = todos.findIndex(t => t === todo);
  todos.splice(indexToRemove, 1);
  todoRenderer.removeCard(card);
});

main.addEventListener('changeTodoPriority', (e) => {
  const { todo, card, newPriority } = e.detail;
  todo.priority = newPriority;
  todoRenderer.removeCard(card);
  todoRenderer.renderTodo(todo);
});

main.addEventListener('enterWriteTodoInput', (e) => {
  const todo = new Todo({
    title: e.detail,
    project: 'default',
  });
  todos.push(todo);
  todoRenderer.renderTodo(todo);
});

main.addEventListener('editWriteTodoInput', (e) => {
  todoModal.show({ title: e.detail }, (todo) => {
    todos.push(todo); 
    todoRenderer.renderTodo(todo);
  });
});