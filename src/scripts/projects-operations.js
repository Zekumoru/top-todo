import { collection, doc, getDoc, getFirestore, onSnapshot, serverTimestamp, updateDoc, writeBatch } from "firebase/firestore";
import { getUserId, isUserSignedIn } from "./firebase-utils";
import getPrimaryNav from "./getPrimaryNav";
import KeedoStorage from "./KeedoStorage";
import Project from "./Project";
import createProjectPosition from "./createProjectPosition";
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
const getProjectsDocRef = () => doc(getFirestore(), getUserProjectsPath(), 'projects');

const getMetadata = () => ({
  timestamp: serverTimestamp(),
  createdByUserId: getUserId(),
});

const performBatch = (callback) => {
  if (typeof callback !== 'function') return;

  const batch = writeBatch(getFirestore());
  callback(batch);
  batch.commit();
};

const handleProjectsChange = (type, newProjects) => {
  if (type !== 'modified') return;
  if (newProjects.length !== projects.length) return;

  const sorted = projects.reduce((sorted, project, index) => {
    if (sorted) return true;
    return project.id !== newProjects[index].id;
  }, false);

  if (!sorted) return;

  projects = newProjects;
  primaryNav.renderProjects(projects);
};

const handleProjectChange = (type, project) => {
  if (type === 'added') {
    projects.push(createProjectPosition(project));
    primaryNav.addProject(project);
    return;
  }

  if (type === 'removed') {
    projects = projects.filter((p) => p.name !== project.name);
    primaryNav.removeProject(project);
    return;
  }

  const renamedIndex = projects.findIndex((p) => p.id === project.id && p.name !== project.name);
  if (renamedIndex === -1) return;

  const oldProjectName = projects[renamedIndex].name;
  projects[renamedIndex] = project;
  getTodos().forEach((todo) => {
    if (todo.project !== oldProjectName) return;
    updateTodo(todo, {
      project: project.name,
    });
  });
  
  const projectListItem = primaryNav.getProject(project);
  projectListItem.textContent = project.name;
  if (projectListItem.classList.contains('current')) {
    todoRenderer.renderProject(project, getTodos());
  }
};

const handleChange = (type, projectOrProjects) => {
  if ('projects' in projectOrProjects) {
    handleProjectsChange(type, projectOrProjects.projects);
    return;
  }
  
  handleProjectChange(type, projectOrProjects);
};

const initializeProjects = async () => {
  const projectsDoc = await getDoc(getProjectsDocRef());
  if (projectsDoc.exists()) return;

  const defaultProject = new Project('default');

  performBatch((batch) => {
    batch.set(getProjectDocPath(defaultProject.id), {
      ...getMetadata(),
      ...defaultProject,
    });
  
    batch.set(getProjectsDocRef(), {
      ...getMetadata(),
      projects: [ createProjectPosition(defaultProject) ],
    });
  });
};

const addProject = (project) => {
  if (!isUserSignedIn()) {
    handleChange('added', project);
    KeedoStorage.projects = projects;
    KeedoStorage.saveProjects();
    return;
  }

  performBatch((batch) => {
    batch.set(getProjectDocPath(project.id), {
      ...getMetadata(),
      ...project,
    });
  
    batch.update(getProjectsDocRef(), {
      projects: [
        ...projects,
        createProjectPosition(project),
      ],
    });
  });
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
  unsubscribeSnapshot = onSnapshot(collection(getFirestore(), getUserProjectsPath()), (snapshot) => {
    let overrideProjects = () => {};
    snapshot.docChanges().forEach((change) => {
      const data = change.doc.data();
      if (change.type === 'added' && 'projects' in data) {
        overrideProjects = () => {
          projects = data.projects;
          primaryNav.renderProjects(projects);
        };
      }
      handleChange(change.type, data);
    });
    overrideProjects();
  });
};

const renameProject = (project, newName) => {
  if (!isUserSignedIn()) {
    handleChange('modified', {
      ...project,
      name: newName,
    });
    KeedoStorage.projects = projects;
    KeedoStorage.saveProjects();
    return;
  }

  performBatch((batch) => {
    batch.update(getProjectDocPath(project.id), {
      name: newName,
    });

    batch.update(getProjectsDocRef(), {
      projects: projects.map((p) => {
        if (p.id === project.id) {
          return {
            ...p,
            name: newName,
          };
        }
        return p;
      }),
    });
  });
};

const sortProjects = (newIndex, oldIndex) => {
  if (!isUserSignedIn()) {
    console.warn('Sorting currently disabled for local storage');
    return;
  }

  const project = projects[oldIndex];
  const filteredOut = projects.filter((p, i) => i !== oldIndex);
  updateDoc(getProjectsDocRef(), {
    projects: [
      ...filteredOut.slice(0, newIndex),
      project,
      ...filteredOut.slice(newIndex),
    ],
  });
}

const deleteProject = (project) => {
  if (!isUserSignedIn()) {
    handleChange('removed', project);
    KeedoStorage.projects = projects;
    KeedoStorage.saveProjects();
    return;
  }

  performBatch((batch) => {
    batch.delete(getProjectDocPath(project.id));
    batch.update(getProjectsDocRef(), {
      projects: projects.filter((p) => p.id !== project.id),
    });
  });
}

export { getProjects, loadProjects, addProject, renameProject, sortProjects, deleteProject };