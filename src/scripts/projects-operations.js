import { collection, doc, getDoc, getFirestore, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { getUserId, isUserSignedIn } from "./firebase-utils";
import getPrimaryNav from "./getPrimaryNav";
import KeedoStorage from "./KeedoStorage";
import Project from "./Project";

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
  unsubscribeSnapshot = onSnapshot(collection(getFirestore(), getUserProjectsPath()), (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const project = change.doc.data();
      onProjectsChange(change.type, project);
    });
  });
};

export { getProjects, loadProjects, addProject };