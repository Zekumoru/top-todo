import '@mdi/font/css/materialdesignicons.css';
import 'normalize.css/normalize.css';
import './styles/reset.css';
import './styles/styles.css';
import './styles/tutorial.css';
import { format } from 'date-fns';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
} from 'firebase/auth';
import firebaseConfig from './firebase-config';
import getPrimaryNav from './scripts/getPrimaryNav';
import writeTodoBar from './scripts/writeTodoBar';
import TodoModal from './scripts/Modal/TodoModal';
import Todo from './scripts/Todo';
import KeedoStorage from './scripts/KeedoStorage';
import loadTutorial from './scripts/loadTutorial';
import AboutModal from './scripts/Modal/AboutModal';
import { addTodo, deleteTodo, getTodos, loadTodos, todoRenderer, updateTodo } from './scripts/todos-operations';
import { signInUser, signOutUser } from './scripts/firebase-utils';
import { addProject, deleteProject, getProjects, loadProjects } from './scripts/projects-operations';
import authStateObserver from './scripts/authStateObserver';

const main = document.querySelector('main');
const primaryNav = getPrimaryNav(getProjects);
const todoModal = new TodoModal(document.querySelector('.todo-modal'), '', getProjects);
const aboutModal = new AboutModal(document.querySelector('.about-modal'));

if (!KeedoStorage.tutorialShown) {
  loadTutorial(() => {
    KeedoStorage.tutorialShown = true;
  });
}

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

document.addEventListener('eraseAllData', () => { // TODO: TO IMPLEMENT FOR FIREBASE!!
  KeedoStorage.clear();
  todoRenderer.render(getTodos());
  primaryNav.renderProjects(getProjects());
});

document.addEventListener('createProject', (e) => {
  const { project } = e.detail;
  addProject(project);
});

document.addEventListener('editProject', (e) => {
  const { project, newName, oldName } = e.detail;
  project.name = newName;

  const index = getProjects().findIndex((p) => p === project);
  primaryNav.getProjectListItems()[index].innerText = newName;

  getTodos().forEach((todo) => {
    if (todo.project === oldName) todo.project = newName;
  });
  todoRenderer.replaceCardsContent(newName, oldName);
  KeedoStorage.saveTodos();
  KeedoStorage.saveProjects();
});

document.addEventListener('sortProject', (e) => {
  const { newIndex, oldIndex } = e.detail;
  const project = getProjects()[oldIndex];
  getProjects().splice(oldIndex, 1);
  getProjects().splice(newIndex, 0, project);
  primaryNav.renderProjects(getProjects(), todoRenderer.currentProject?.name);
  KeedoStorage.saveProjects();
});

document.addEventListener('deleteProject', (e) => {
  const { project } = e.detail;
  deleteProject(project);
});

document.addEventListener('openPrimaryNav', () => {
  main.inert = true;
});

document.addEventListener('closePrimaryNav', () => {
  main.inert = false;
});

document.addEventListener('selectPrimaryNavTab', (e) => {
  const { tab, tabName } = e.detail;

  if (tab === primaryNav.aboutTab) {
    aboutModal.show();
    return;
  }

  if (tab === primaryNav.signInTab) {
    signInUser();
    return;
  }

  if (tab === primaryNav.signOutTab) {
    signOutUser();
    return;
  }

  writeTodoBar.enable();
  todoRenderer.emptyMessage.innerHTML = `
    <p>Uh oh! You do not have any todos yet!</p>
    <p>Try adding some by writing one above!</p>
  `;

  if (primaryNav.isOpen()) {
    primaryNav.close();
  }

  if (tab === primaryNav.allTab) {
    todoRenderer.render(getTodos());
    return;
  }

  if (tab === primaryNav.completedTab) {
    writeTodoBar.disable();
    todoRenderer.emptyMessage.innerHTML = `
      <p>Uh oh! You have not finished any todos yet!</p>
      <p>Try completing some by checking them!</p>
    `;

    todoRenderer.render(getTodos(), {
      filter: (todo) => todo.checked,
      appendMode: true,
    });
    return;
  }

  if (tab === primaryNav.overdueTab) {
    writeTodoBar.disable();
    todoRenderer.emptyMessage.innerHTML = `
      <p>Congratulations! Keep it up!</p>
      <p>You don't have any unfinished todos!</p>
    `;

    const today = format(new Date(), 'yyyy-MM-dd');
    todoRenderer.render(getTodos(), {
      filter: (todo) => !todo.checked && today > todo.dueDate,
      appendMode: true,
    });
    return;
  }

  const project = getProjects().find((p) => p.name === tabName);
  todoRenderer.renderProject(project, getTodos());
});

main.addEventListener('checkedTodo', (e) => {
  const { todo } = e.detail;
  updateTodo(todo, {
    checked: true,
  });
});

main.addEventListener('uncheckedTodo', (e) => {
  const { todo } = e.detail;
  updateTodo(todo, {
    checked: false,
  });
});

main.addEventListener('editTodo', (e) => {
  const { todo } = e.detail;
  todoModal.title = 'Editing todo';
  todoModal.confirmButton.innerText = 'Save';
  todoModal.show(todo, (editedTodo) => {
    updateTodo(todo, {
      ...editedTodo,
      id: todo.id, // stay consistent with id since editedTodo is a modified COPY of the original todo AND it makes sure to remove the old unedited one
    });
  });
});

main.addEventListener('deleteTodo', (e) => {
  const { todo } = e.detail;
  deleteTodo(todo);
});

main.addEventListener('changeTodoPriority', (e) => {
  const { todo, newPriority } = e.detail;
  updateTodo(todo, {
    priority: newPriority,
  });
});

main.addEventListener('enterWriteTodoInput', (e) => {
  const todo = new Todo({
    title: e.detail,
    project: todoRenderer.currentProject?.name ?? 'default',
  });

  addTodo(todo);
});

main.addEventListener('editWriteTodoInput', (e) => {
  todoModal.title = 'Creating todo';
  todoModal.confirmButton.innerText = 'Create';
  todoModal.show({ title: e.detail, project: todoRenderer.currentProject?.name }, (todo) => {
    addTodo(todo);
  });
});

initializeApp(firebaseConfig);
onAuthStateChanged(getAuth(), authStateObserver);
loadTodos();
loadProjects();
