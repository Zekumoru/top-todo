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
  onSnapshot,
  setDoc,
  updateDoc,
  doc,
  serverTimestamp,
  deleteDoc,
  getDoc,
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
import Project from './scripts/Project';

const { addTodo, getTodos, loadTodos, updateTodo, deleteTodo } = (() => {
  let todos = KeedoStorage.loadTodos();
  let unsubscribeSnapshot = null;
  
  if (todos === undefined) {
    ({ todos } = KeedoStorage.populate());
    KeedoStorage.todos = todos;
    KeedoStorage.saveTodos();
  }

  const onTodosChange = (type, todo) => {
    if (type === 'added') {
      todos.push(todo);
    }
    
    todoRenderer.removeCardById(todo.id);
    
    if (type === 'removed') {
      todos = todos.filter((t) => t.id !== todo.id);
      return;
    }

    const modifiedTodoIndex = todos.findIndex((t) => t.id === todo.id);
    todos[modifiedTodoIndex] = todo;
    todoRenderer.renderTodo(todo);
  };

  const addTodo = (todo) => {
    if (!isUserSignedIn()) {
      onTodosChange('added', todo);
      KeedoStorage.saveTodos();
      return;
    }
    
    setDoc(getTodoDocPath(todo.id), {
      ...todo,
      timestamp: serverTimestamp(),
      createdByUserId: getUserId(),
    });
  };

  const loadTodos = () => {
    if (!isUserSignedIn()) {
      todos = KeedoStorage.loadTodos();
      KeedoStorage.todos = todos;
      return;
    }
  
    if (typeof unsubscribeSnapshot === 'function') {
      unsubscribeSnapshot();
    }
  
    todos = [];
    unsubscribeSnapshot = onSnapshot(collection(getFirestore(), getUserTodosPath()), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const todo = change.doc.data();
        onTodosChange(change.type, todo);
      })
    });
  };

  const updateTodo = (todo, fields) => {
    if (!isUserSignedIn()) {
      const updatedTodo = {
        ...todo,
        ...fields,
      };
      onTodosChange('modified', updatedTodo);
      KeedoStorage.saveTodos();
      return;
    }
    
    updateDoc(getTodoDocPath(todo.id), fields);
  }
  
  const deleteTodo = (todo) => {
    if (!isUserSignedIn()) {
      onTodosChange('removed', todo);
      KeedoStorage.todos = todos; // needed otherwise saveTodos below will save the old array
      KeedoStorage.saveTodos();
      return;
    }

    deleteDoc(getTodoDocPath(todo.id));
  };

  const getTodos = () => todos;

  return {
    loadTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    getTodos,
  };
})();

const { getProjects, loadProjects } = (() => {
  let projects = KeedoStorage.loadProjects();
  let unsubscribeSnapshot = null;

  if (projects === undefined) {
    ({ projects } = KeedoStorage.populate());
    KeedoStorage.projects = projects;
    KeedoStorage.saveProjects();
  }

  const onProjectsChange = (type, project) => {
    if (type === 'added') {
      projects.push(project);
    }
  };

  const initializeProjects = async () => {
    const doc = await getDoc(getProjectDocPath('default'));
    if (doc.data() !== 'undefined') return;

    setDoc(getProjectDocPath('default'), {
      ...(new Project('default')),
      timestamp: serverTimestamp(),
      createdByUserId: getUserId(),
    });
  };

  const loadProjects = () => {
    if (!isUserSignedIn()) {
      projects = KeedoStorage.loadProjects();
      KeedoStorage.projects = projects;
      return;
    }

    if (typeof unsubscribeSnapshot === 'function') {
      unsubscribeSnapshot();
    }

    projects = [];
    initializeProjects();
    unsubscribeSnapshot = onSnapshot(collection(getFirestore(), getUserProjectsPath()), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const project = change.doc.data();
        onProjectsChange(change.type, project);
      });
    });
  };

  const getProjects = () => projects;
  
  return {
    loadProjects,
    getProjects,
  }
})();

const isUserSignedIn = () => !!getAuth().currentUser;
const getUserId = () => getAuth().currentUser.uid;
const getUserTodosPath = () => `users/${getUserId()}/todos`;
const getUserProjectsPath = () => `users/${getUserId()}/projects`;
const getTodoDocPath = (id) => doc(getFirestore(), getUserTodosPath(), id);
const getProjectDocPath = (name) => doc(getFirestore(), getUserProjectsPath(), name);

const main = document.querySelector('main');
const primaryNav = getPrimaryNav(getProjects());
const todoModal = new TodoModal(document.querySelector('.todo-modal'), '', getProjects());
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
  primaryNav.renderProjects(getProjects());
});

document.addEventListener('createProject', (e) => {
  const { project } = e.detail;
  getProjects().push(project);
  primaryNav.addProject(project);
  KeedoStorage.saveProjects();
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
  const index = getProjects().findIndex((p) => p === project);

  getProjects().splice(index, 1);
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
    loadProjects();
    todoRenderer.render(getTodos());
    return;
  }
  
  primaryNav.signInTab.removeAttribute('hidden');
  primaryNav.signOutTab.setAttribute('hidden', 'true');
  unsetUserProfileTab();
  loadTodos();
  loadProjects();
  todoRenderer.render(getTodos());
}

initializeApp(firebaseConfig);
onAuthStateChanged(getAuth(), authStateObserver);
loadTodos();
loadProjects();
