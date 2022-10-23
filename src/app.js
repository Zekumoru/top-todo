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
import KeedoStorage from './scripts/KeedoStorage';
import { format } from 'date-fns';

const todos = KeedoStorage.loadTodos() || [];
const projects = KeedoStorage.loadProjects() ?? [
  new Project('default'),
  new Project('project 1'),
  new Project('project 2'),
  new Project('project 3'),
];

KeedoStorage.todos = todos;
KeedoStorage.projects = projects;

const main = document.querySelector('main');
const primaryNav = getPrimaryNav(projects);
const todoModal = new TodoModal(document.querySelector('.todo-modal'), projects);
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
  primaryNav.addProject(project);
  KeedoStorage.saveProjects();
});

document.addEventListener('editProject', (e) => {
  const { project, newName, oldName } = e.detail;
  project.name = newName;

  const index = projects.findIndex((p) => p === project);
  primaryNav.getProjectListItems()[index].innerText = newName;

  todos.forEach((todo) => {
    if (todo.project === oldName) todo.project = newName;
  });
  todoRenderer.replaceCardsContent(newName, oldName);
  KeedoStorage.saveTodos();
  KeedoStorage.saveProjects();
});

document.addEventListener('sortProject', (e) => {
  const { newIndex, oldIndex } = e.detail;
  const project = projects[oldIndex];
  projects.splice(oldIndex, 1);
  projects.splice(newIndex, 0, project);
  primaryNav.renderProjects(projects, todoRenderer.currentProject?.name);
  KeedoStorage.saveProjects();
});

document.addEventListener('deleteProject', (e) => {
  const { project } = e.detail;
  const index = projects.findIndex((p) => p === project);
  
  projects.splice(index, 1);
  const selectedTab = primaryNav.getProjectListItems()[index];
  if (selectedTab.classList.contains('current')) {
    primaryNav.selectTab(primaryNav.allTab);
  }
  selectedTab.remove();

  todos.forEach((todo) => {
    if (todo.project !== project.name) return;
    todo.project = 'default';
  });
  todoRenderer.replaceCardsContent('default', project.name);
  KeedoStorage.saveTodos();
  KeedoStorage.saveProjects();
});

document.addEventListener('openPrimaryNav', () => {
  main.inert = true;
});

document.addEventListener('closePrimaryNav', () => {
  main.inert = false;
});

document.addEventListener('selectPrimaryNavTab', (e) => {
  const { tab, tabName } = e.detail;
  todoRenderer.emptyMessage.innerHTML = `
    <p>Uh oh! You do not have any todos yet!</p>
    <p>Try adding some by writing one above!</p>
  `;

  if (tab === primaryNav.allTab) {
    todoRenderer.render(todos);
    return;
  }

  if (tab === primaryNav.completedTab) {
    todoRenderer.emptyMessage.innerHTML = `
      <p>Uh oh! You have not finished any todos yet!</p>
      <p>Try completing some by checking them!</p>
    `;

    todoRenderer.render(todos, (todo) => {
      return todo.checked;
    });
    return;
  }

  if (tab === primaryNav.dueTab) {
    todoRenderer.emptyMessage.innerHTML = `
      <p>Congratulations! Keep it up!</p>
      <p>You don't have any unfinished todos!</p>
    `;

    const today = format(new Date(), 'yyyy-MM-dd');
    todoRenderer.render(todos, (todo) => {
      return !todo.checked && today > todo.dueDate;
    });
    return;
  }

  const project = projects.find((p) => p.name === tabName);
  todoRenderer.renderProject(project, todos);
});

main.addEventListener('checkedTodo', (e) => {
  const { todo, card } = e.detail;
  todo.checked = true;
  todoRenderer.removeCard(card);
  todoRenderer.renderTodo(todo);
  KeedoStorage.saveTodos();
});

main.addEventListener('uncheckedTodo', (e) => {
  const { todo, card } = e.detail;
  todo.checked = false;
  todoRenderer.removeCard(card);
  todoRenderer.renderTodo(todo);
  KeedoStorage.saveTodos();
});

main.addEventListener('editTodo', (e) => {
  const { todo, card } = e.detail;
  todoModal.show(todo, (editedTodo) => {
    todos.splice(todos.findIndex(t => t === todo), 1);
    todoRenderer.removeCard(card);
    todos.push(editedTodo);
    todoRenderer.renderTodo(editedTodo);
    KeedoStorage.saveTodos();
  });
});

main.addEventListener('deleteTodo', (e) => {
  const { todo, card } = e.detail;
  const indexToRemove = todos.findIndex(t => t === todo);
  todos.splice(indexToRemove, 1);
  todoRenderer.removeCard(card);
  KeedoStorage.saveTodos();
});

main.addEventListener('changeTodoPriority', (e) => {
  const { todo, card, newPriority } = e.detail;
  todo.priority = newPriority;
  todoRenderer.removeCard(card);
  todoRenderer.renderTodo(todo);
  KeedoStorage.saveTodos();
});

main.addEventListener('enterWriteTodoInput', (e) => {
  const todo = new Todo({
    title: e.detail,
    project: todoRenderer.currentProject?.name ?? 'default',
  });
  todos.push(todo);
  todoRenderer.renderTodo(todo);
  KeedoStorage.saveTodos();
});

main.addEventListener('editWriteTodoInput', (e) => {
  todoModal.show({ title: e.detail, project: todoRenderer.currentProject?.name }, (todo) => {
    todos.push(todo); 
    todoRenderer.renderTodo(todo);
    KeedoStorage.saveTodos();
  });
});