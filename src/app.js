import '@mdi/font/css/materialdesignicons.css'
import 'normalize.css/normalize.css'
import './styles/reset.css';
import './styles/styles.css';
import getPrimaryNav from './scripts/getPrimaryNav';
import writeTodoBar from './scripts/writeTodoBar';
import TodoModal from './scripts/Modal/TodoModal';
import TodoRenderer from './scripts/TodoRenderer/TodoRenderer';
import Todo from './scripts/Todo';
import Project from './scripts/Project';

const todos = [];
const projects = [
  new Project('default'),
  new Project('project 1'),
  new Project('project 2'),
  new Project('project 3'),
];

const main = document.querySelector('main');
const primaryNav = getPrimaryNav(projects);
const todoModal = new TodoModal(document.querySelector('.todo-modal'));
const todoRenderer = new TodoRenderer(document.querySelector('.todos'), todos);

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

window.addEventListener('resize', () => {
  if (primaryNav.inert) return;
  if (!primaryNav.style.left) return; // if primary nav is hidden on mobile
  if (window.innerWidth > 768) {
    main.inert = false;
    return;
  }

  main.inert = true;
});

document.addEventListener('showModal', () => {
  main.inert = true;
  primaryNav.inert = true;
});

document.addEventListener('hideModal', () => {
  main.inert = false;
  primaryNav.inert = false;
});

document.addEventListener('createProject', (e) => {
  const { project } = e.detail;
  projects.push(project);
});

document.addEventListener('editProject', (e) => {
  const { project, newName } = e.detail;
  project.name = newName;
});

document.addEventListener('sortProject', (e) => {
  const { newIndex, oldIndex } = e.detail;
  const project = projects[oldIndex];
  projects.splice(oldIndex, 1);
  projects.splice(newIndex, 0, project);
});

document.addEventListener('deleteProject', (e) => {
  const { project } = e.detail;
  const index = projects.findIndex((p) => p === project);
  projects.splice(index, 1);
});

primaryNav.addEventListener('openPrimaryNav', () => {
  main.inert = true;
});

primaryNav.addEventListener('closePrimaryNav', () => {
  main.inert = false;
});

primaryNav.addEventListener('checkedTodo', (e) => {
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