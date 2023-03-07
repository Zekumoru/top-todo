import { collection, deleteDoc, doc, getDoc, getFirestore, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { getUserId, isUserSignedIn } from "./firebase-utils";
import getPrimaryNav from "./getPrimaryNav";
import KeedoStorage from "./KeedoStorage";
import Project from "./Project";
import { getTodos, todoRenderer, updateTodo } from './todos-operations';

let projects = KeedoStorage.loadProjects();
let unsubscribeSnapshot = null;

if (projects === undefined) {
  ({ projects } = KeedoStorage.populate());
  KeedoStorage.projects = projects;
  KeedoStorage.saveProjects();
}

const getProjects = () => projects;
const primaryNav = getPrimaryNav(getProjects);

const getUserProjectsPath = () => `users/${getUserId()}/projects`;
const getProjectDocPath = (name) => doc(getFirestore(), getUserProjectsPath(), name);

const createProjectDoc = (project) => {
  setDoc(getProjectDocPath(project.name), {
    ...project,
    timestamp: serverTimestamp(),
    createdByUserId: getUserId(),
  });
};

const onProjectsChange = (type, project) => {
  if (type === 'added') {
    projects.push(project);
    primaryNav.addProject(project);
    return;
  }

  if (type === 'removed') {
    projects = projects.filter((p) => p.name !== project.name);
    primaryNav.removeProject(project);
    
  }
};

const initializeProjects = async () => {
  const doc = await getDoc(getProjectDocPath('default'));
  if (doc.data() !== undefined) return;

  createProjectDoc(new Project('default', 0))
};

const addProject = (project) => {
  if (!isUserSignedIn()) {
    onProjectsChange('added', project);
    KeedoStorage.projects = projects;
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

const renameProject = (project, newName) => {
  if (!isUserSignedIn()) {
    console.error('Renaming project using local storage is currently disabled.');
    
  }
};

const swapProjects = (p1, p2) => {
  if (!isUserSignedIn()) {
    console.error('Swapping projects using local storage is currently disabled.');
    
  }
}

const deleteProject = (project) => {
  if (!isUserSignedIn()) {
    onProjectsChange('removed', project);
    KeedoStorage.projects = projects;
    KeedoStorage.saveProjects();
    return;
  }

  deleteDoc(getProjectDocPath(project.name));
}

export { getProjects, loadProjects, addProject, renameProject, swapProjects, deleteProject };