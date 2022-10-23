import ProjectModal from "./Modal/ProjectModal";

let projectModal = null;
const primaryNav = document.querySelector('.primary-nav');
export default function(projects) {
  projectModal = new ProjectModal(document.querySelector('.project-modal'), projects);
  primaryNav.renderProjects(projects);
  return primaryNav;
};

const openButton = document.querySelector('.open.primary-nav-button');
const closeButton = document.querySelector('.close.primary-nav-button');
const editProjectListButton = primaryNav.querySelector('button.edit-projects');
const projectList = primaryNav.querySelector('.project-list');

const openEvent = new Event('openPrimaryNav', {
  bubbles: true,
  cancelable: true,
});

const closeEvent = new Event('closePrimaryNav', {
  bubbles: true,
  cancelable: true,
});

primaryNav.getProjectListItems = function() {
  return projectList.children;
};

primaryNav.addProject = function(project) {
  const projectListItem = createProjectListItem(project);
  projectList.appendChild(projectListItem);
};

primaryNav.renderProjects = function(projects) {
  projectList.innerHTML = '';

  projects.forEach((project) => {
    const projectListItem = createProjectListItem(project);
    if (project.name === 'default') {
      projectListItem.classList.add('default');
    }

    projectList.appendChild(projectListItem);
  });
};

function createProjectListItem(project) {
  const projectListItem = document.createElement('li');
  projectListItem.tabIndex = '0';
  projectListItem.innerText = project.name;

  projectListItem.addEventListener('click', (e) => selectTab(projectListItem));
  projectListItem.addEventListener('keyup', (e) => {
    if (!(e.key === 'Enter' || e.key === ' ')) return;
    selectTab(projectListItem);
  });

  return projectListItem;
}

primaryNav.querySelectorAll('li:not(.section)').forEach((navItem) => {
  navItem.addEventListener('click', (e) => selectTab(navItem));
  navItem.addEventListener('keyup', (e) => {
    if (!(e.key === 'Enter' || e.key === ' ')) return;
    selectTab(navItem);
  });
});

function selectTab(tab) {
  const currentSelected = primaryNav.querySelector('li.current');
  if (tab === currentSelected) return;

  currentSelected.classList.remove('current');
  tab.classList.add('current');
}

openButton.addEventListener('click', (e) => {
  primaryNav.style.left = '0px';
  primaryNav.dispatchEvent(openEvent);
});

closeButton.addEventListener('click', (e) => {
  primaryNav.style.left = '';
  primaryNav.dispatchEvent(closeEvent);
});

editProjectListButton.addEventListener('click', () => {
  projectModal.show();
});