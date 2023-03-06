import { collection, deleteDoc, doc, getDoc, getFirestore, onSnapshot, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore";
import { getUserId, isUserSignedIn } from "./firebase-utils";
import getPrimaryNav from "./getPrimaryNav";
import KeedoStorage from "./KeedoStorage";
import Project from "./Project";
import { getTodos, updateTodo } from './todos-operations';

let projects = KeedoStorage.loadProjects();
let unsubscribeSnapshot = null;

const getProjects = () => projects;
const primaryNav = getPrimaryNav(getProjects);

const getUserProjectsPath = () => `users/${getUserId()}/projects`;
const getProjectDocPath = (name) => doc(getFirestore(), getUserProjectsPath(), name);

if (projects === undefined) {
  ({ projects } = KeedoStorage.populate());
  KeedoStorage.projects = projects;
  KeedoStorage.saveProjects();
}

const onProjectsChange = (type, project) => {
  if (type === 'added') {
    projects.push(project);
    primaryNav.addProject(project);
    return;
  }

  if (type === 'removed') {
    let index = -1;
    projects = projects.filter((p, i) => {
      if (p.name !== project.name) return true;
      index = i;
      return false;
    });
    
    const selectedTab = primaryNav.getProjectListItems()[index];
    if (selectedTab.classList.contains('current')) {
      primaryNav.selectTab(primaryNav.allTab);
    }
    selectedTab.remove();

    getTodos().forEach((todo) => {
      if (todo.project !== project.name) return;
      updateTodo(todo, {
        project: 'default',
      });
    });
  }
};

const initializeProjects = async () => {
  const doc = await getDoc(getProjectDocPath('default'));
  if (doc.data() !== undefined) return;

  setDoc(getProjectDocPath('default'), {
    ...(new Project('default', 0)),
    timestamp: serverTimestamp(),
    createdByUserId: getUserId(),
  });
};

const addProject = (project) => {
  if (!isUserSignedIn()) {
    projects.push(project);
    primaryNav.addProject(project);
    KeedoStorage.saveProjects();
    return;
  }

  setDoc(getProjectDocPath(project.name), {
    ...project,
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
  unsubscribeSnapshot = onSnapshot(query(collection(getFirestore(), getUserProjectsPath()), orderBy('position')), (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const project = change.doc.data();
      onProjectsChange(change.type, project);
    });
  });
};

const updateProject = (project, fields) => {
  if (!isUserSignedIn()) {
    console.error('Updating project using local storage is currently disabled.');
    return;
  }

  console.error('Updating project is currently disabled.');
};

const deleteProject = (project) => {
  if (!isUserSignedIn()) {
    console.error('Deleting project using local storage is currently disabled.');
    return;
  }

  deleteDoc(getProjectDocPath(project.name));
}

export { getProjects, loadProjects, addProject, updateProject, deleteProject };