import { collection, deleteDoc, doc, getDoc, getDocs, getFirestore, limit, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc, where, writeBatch } from "firebase/firestore";
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
const getProjectDocPath = (id) => doc(getFirestore(), getUserProjectsPath(), id);

const createProjectDoc = (project) => {
  setDoc(getProjectDocPath(project.id), {
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
    return;
  }

  const renamedIndex = projects.findIndex((p) => p.id === project.id && p.name !== project.name);
  if (renamedIndex !== -1) {
    const oldProjectName = projects[renamedIndex].name;
    projects[renamedIndex] = project;
    primaryNav.getProject(project).textContent = project.name;

    getTodos().forEach((todo) => {
      if (todo.project !== oldProjectName) return;
      updateTodo(todo, {
        project: project.name,
      });
    })
  }
};

const initializeProjects = async () => {
  const querySnapshot = await getDocs(query(collection(getFirestore(), getUserProjectsPath()), where('name', '==', 'default'), limit(1)));
  if (querySnapshot.size > 0) return;

  createProjectDoc(new Project('default', 0));
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

const loadProjects = async () => {
  if (!isUserSignedIn()) {
    projects = KeedoStorage.loadProjects();
    KeedoStorage.projects = projects;
    return;
  }

  if (typeof unsubscribeSnapshot === 'function') {
    unsubscribeSnapshot();
  }

  projects = [];
  await initializeProjects();
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
    return;
  }

  updateDoc(getProjectDocPath(project.id), {
    name: newName,
  });
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

  deleteDoc(getProjectDocPath(project.id));
}

export { getProjects, loadProjects, addProject, renameProject, swapProjects, deleteProject };