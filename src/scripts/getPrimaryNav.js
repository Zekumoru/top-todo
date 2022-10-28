import ProjectModal from './Modal/ProjectModal';

let projectModal = null;
const primaryNav = document.querySelector('.primary-nav');
export default function (projects) {
  projectModal = new ProjectModal(document.querySelector('.project-modal'), projects);
  primaryNav.renderProjects(projects);
  return primaryNav;
}

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

primaryNav.selectTab = selectTab;
primaryNav.open = open;
primaryNav.close = close;

primaryNav.allTab = primaryNav.querySelector('li.all');
primaryNav.completedTab = primaryNav.querySelector('li.completed');
primaryNav.overdueTab = primaryNav.querySelector('li.overdue');
primaryNav.aboutTab = primaryNav.querySelector('li.about');

primaryNav.isOpen = function () {
  return (primaryNav.style.left === '0px');
};

primaryNav.getProjectListItems = function () {
  return projectList.children;
};

primaryNav.addProject = function (project) {
  const projectListItem = createProjectListItem(project);
  projectList.appendChild(projectListItem);
};

primaryNav.renderProjects = function (projects, selectProject) {
  projectList.innerHTML = '';

  projects.forEach((project) => {
    const projectListItem = createProjectListItem(project);
    if (project.name === 'default') {
      projectListItem.classList.add('default');
    }
    if (project.name === selectProject) {
      projectListItem.classList.add('current');
    }

    projectList.appendChild(projectListItem);
  });
};

primaryNav.querySelectorAll('li:not(.section)').forEach((navItem) => {
  navItem.addEventListener('click', () => selectTab(navItem));
  navItem.addEventListener('keyup', (e) => {
    if (!(e.key === 'Enter' || e.key === ' ')) return;
    selectTab(navItem);
  });
});

openButton.addEventListener('click', () => {
  open();
});

closeButton.addEventListener('click', () => {
  close();
});

editProjectListButton.addEventListener('click', () => {
  projectModal.show();
});

function open() {
  primaryNav.style.left = '0px';
  primaryNav.dispatchEvent(openEvent);
}

function close() {
  primaryNav.style.left = '';
  primaryNav.dispatchEvent(closeEvent);
}

function selectTab(tab) {
  const currentSelected = primaryNav.querySelector('li.current');
  const selectTabEvent = new CustomEvent('selectPrimaryNavTab', {
    bubbles: true,
    cancelable: true,
    detail: {
      tabName: tab.innerText,
      tab,
    },
  });

  if (tab.dataset.mode === 'click') {
    tab.dispatchEvent(selectTabEvent);
    return;
  }

  if (tab === currentSelected) return;

  if (currentSelected) currentSelected.classList.remove('current');
  tab.classList.add('current');

  tab.dispatchEvent(selectTabEvent);
}

function createProjectListItem(project) {
  const projectListItem = document.createElement('li');
  projectListItem.tabIndex = '0';
  projectListItem.innerText = project.name;

  projectListItem.addEventListener('click', () => selectTab(projectListItem));
  projectListItem.addEventListener('keyup', (e) => {
    if (!(e.key === 'Enter' || e.key === ' ')) return;
    selectTab(projectListItem);
  });

  return projectListItem;
}
