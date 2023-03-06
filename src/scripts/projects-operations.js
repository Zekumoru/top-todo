import { collection, deleteDoc, doc, getDoc, getFirestore, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { getUserId, isUserSignedIn } from "./firebase-utils";
import getPrimaryNav from "./getPrimaryNav";
import KeedoStorage from "./KeedoStorage";
import Project from "./Project";
import { getTodos, todoRenderer, updateTodo } from './todos-operations';

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

const createProjectDoc = (project) => {
  setDoc(getProjectDocPath(project.name), {
    ...project,
    timestamp: serverTimestamp(),
    createdByUserId: getUserId(),
  });
};

const onProjectsChange = (type, project) => {
  if (type === 'removed') {
    let index = -1;
    projects = projects.filter((p, i) => {
      if (p.name !== project.name) return true;
      index = i;
      return false;
    });

    // it will be -1 when a rename operation is done
    // and obviously not a delete
    if (index === -1) return;
    
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

  if (type !== 'added') return;
  
  const index = projects.findIndex((p) => p.position === project.position && p.name !== project.name);
  if (index === -1) { // this means that it's a new project and not a rename
    projects.push(project);
    primaryNav.addProject(project);
    return;
  }
  console.warn('rename operation underway');
  // when a project has been renamed
  const oldProject = projects[index];
  const navTab = primaryNav.getProjectListItems()[index];

  projects[index] = project;
  navTab.textContent = project.name

  getTodos().forEach((todo) => {
    if (todo.project !== oldProject.name) return;
    updateTodo(todo, {
      project: project.name,
    });
  });

  if (navTab === primaryNav.getCurrentTab()) {
    todoRenderer.renderProject(project, getTodos());
  }
};

const initializeProjects = async () => {
  const doc = await getDoc(getProjectDocPath('default'));
  if (doc.data() !== undefined) return;

  createProjectDoc(new Project('default', 0))
};

const addProject = (project) => {
  if (!isUserSignedIn()) {
    projects.push(project);
    primaryNav.addProject(project);
    KeedoStorage.saveProjects();
    return;
  }

  createProjectDoc(project);
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

  // Rename operation
  if (fields.name && fields.name !== project.name) {
    createProjectDoc({
      ...project,
      ...fields,
    });
    deleteDoc(getProjectDocPath(project.name));
    return;
  }

  updateDoc(getProjectDocPath(project.name), {
    ...fields,
  });
};

const deleteProject = (project) => {
  if (!isUserSignedIn()) {
    console.error('Deleting project using local storage is currently disabled.');
    return;
  }

  deleteDoc(getProjectDocPath(project.name));
}

export { getProjects, loadProjects, addProject, updateProject, deleteProject };