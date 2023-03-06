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
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  setDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from './firebase-config';
import getPrimaryNav from './scripts/getPrimaryNav';
import writeTodoBar from './scripts/writeTodoBar';
import TodoModal from './scripts/Modal/TodoModal';
import TodoRenderer from './scripts/TodoRenderer/TodoRenderer';
import Todo from './scripts/Todo';
import KeedoStorage from './scripts/KeedoStorage';
import loadTutorial from './scripts/loadTutorial';
import AboutModal from './scripts/Modal/AboutModal';

const { getTodos, loadTodos, projects } = (() => {
  let todos = [];
  let projects = KeedoStorage.loadProjects();
  
  if (projects === undefined) {
    ({ todos, projects } = KeedoStorage.populate());
    KeedoStorage.projects = projects;
    KeedoStorage.saveProjects();
  }
  KeedoStorage.projects = projects;

  const loadTodosFromLocalStorage = () => {
    todos = KeedoStorage.loadTodos();
  };

  const loadTodos = () => {
    if (!isUserSignedIn()) {
      loadTodosFromLocalStorage();
      return;
    }
  
    if (typeof unsubscribeSnapshot === 'function') {
      unsubscribeSnapshot();
    }
  
    todos = [];
    unsubscribeSnapshot = onSnapshot(collection(getFirestore(), `users/${getUserId()}/todos`), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const todo = change.doc.data();
          todos.push(todo);
          todoRenderer.renderTodo(todo);
        }
      })
    });
  };

  const getTodos = () => todos;

  return {
    loadTodos,
    getTodos,
    projects,
  }
})();

const isUserSignedIn = () => !!getAuth().currentUser;
const getUserId = () => getAuth().currentUser.uid;
let unsubscribeSnapshot = null;

const main = document.querySelector('main');
const primaryNav = getPrimaryNav(projects);
const todoModal = new TodoModal(document.querySelector('.todo-modal'), '', projects);
const todoRenderer = new TodoRenderer(document.querySelector('.todos'), getTodos());
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

document.addEventListener('eraseAllData', () => {
  KeedoStorage.clear();
  todoRenderer.render(getTodos());
  primaryNav.renderProjects(projects);
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

  getTodos().forEach((todo) => {
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

  getTodos().forEach((todo) => {
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

  const project = projects.find((p) => p.name === tabName);
  todoRenderer.renderProject(project, getTodos());
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
  todoModal.title = 'Editing todo';
  todoModal.confirmButton.innerText = 'Save';
  todoModal.show(todo, (editedTodo) => {
    getTodos().splice(getTodos().findIndex((t) => t === todo), 1);
    todoRenderer.removeCard(card);
    getTodos().push(editedTodo);
    todoRenderer.renderTodo(editedTodo);
    KeedoStorage.saveTodos();
  });
});

main.addEventListener('deleteTodo', (e) => {
  const { todo, card } = e.detail;
  const indexToRemove = getTodos().findIndex((t) => t === todo);
  getTodos().splice(indexToRemove, 1);
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

const saveTodoDB = async (todo) => {
  if (!isUserSignedIn()) {
    return;
  }

  try {
    await addDoc(collection(getFirestore(), `users/${getUserId()}/todos`), {
      ...todo,
      timestamp: serverTimestamp(),
      createdByUserId: getUserId(),
    });
  }
  catch(error) {
    throw new Error('Error: Cannot write a new todo to Firebase.', error.message);
  }
};

main.addEventListener('enterWriteTodoInput', (e) => {
  const todo = new Todo({
    title: e.detail,
    project: todoRenderer.currentProject?.name ?? 'default',
  });

  saveTodoDB(todo);
});

main.addEventListener('editWriteTodoInput', (e) => {
  todoModal.title = 'Creating todo';
  todoModal.confirmButton.innerText = 'Create';
  todoModal.show({ title: e.detail, project: todoRenderer.currentProject?.name }, (todo) => {
    getTodos().push(todo);
    todoRenderer.renderTodo(todo);
    KeedoStorage.saveTodos();
  });
});

/** Firebase */
const signInUser = async () => {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(getAuth(), provider);
}

const signOutUser = () => {
  signOut(getAuth());
}

const setUserProfileTab = () => {
  const { name, pic } = primaryNav.userProfileTab;
  const profilePicUrl = getAuth().currentUser.photoURL;
  const userName = getAuth().currentUser.displayName;

  pic.style.backgroundImage = `url(${profilePicUrl})`;
  name.textContent = userName;
  primaryNav.userProfileTab.style.display = '';
};

const unsetUserProfileTab = () => {
  const { name, pic } = primaryNav.userProfileTab;

  name.textContent = '';
  pic.style.backgroundImage = '';
  primaryNav.userProfileTab.style.display = 'none';
};

const authStateObserver = (user) => {
  if (user) {
    primaryNav.signOutTab.removeAttribute('hidden');
    primaryNav.signInTab.setAttribute('hidden', 'true');
    setUserProfileTab();
    loadTodos();
    todoRenderer.render(getTodos());
    return;
  }
  
  primaryNav.signInTab.removeAttribute('hidden');
  primaryNav.signOutTab.setAttribute('hidden', 'true');
  unsetUserProfileTab();
  loadTodos();
  todoRenderer.render(getTodos());
}

initializeApp(firebaseConfig);
onAuthStateChanged(getAuth(), authStateObserver);
loadTodos();
