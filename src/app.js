import '@mdi/font/css/materialdesignicons.css'
import 'normalize.css/normalize.css'
import './styles/reset.css';
import './styles/styles.css';
import './styles/tutorial.css';
import getPrimaryNav from './scripts/getPrimaryNav';
import writeTodoBar from './scripts/writeTodoBar';
import TodoModal from './scripts/Modal/TodoModal';
import TodoRenderer from './scripts/TodoRenderer/TodoRenderer';
import Todo from './scripts/Todo';
import Project from './scripts/Project';
import KeedoStorage from './scripts/KeedoStorage';
import { add, format } from 'date-fns';

const todos = KeedoStorage.loadTodos() || [
  new Todo({
    title: 'Learn trigonometric functions',
    project: 'Math',
    priority: 'medium',
  }),
  new Todo({
    title: 'Milk',
    project: 'Groceries',
    priority: 'high',
  }),
  new Todo({
    title: 'Cereal',
    project: 'Groceries',
    priority: 'low',
  }),
  new Todo({
    title: 'Implement binary sort',
    project: 'Programming',
    priority: 'low',
  }),
  new Todo({
    title: 'Burger',
    project: 'Groceries',
    priority: 'medium',
    dueDate: format(add(new Date(), {days: 1}), 'yyyy-MM-dd'),
  }),
  new Todo({
    title: 'Learn Big-O notation',
    project: 'Programming',
    priority: 'low',
    dueDate: format(add(new Date(), {days: 1}), 'yyyy-MM-dd'),
  }),
  new Todo({
    title: 'Do some differential equations',
    project: 'Math',
    priority: 'low',
    dueDate: format(add(new Date(), {days: 3}), 'yyyy-MM-dd'),
  }),
];
const projects = KeedoStorage.loadProjects() ?? [
  new Project('default'),
  new Project('Groceries'),
  new Project('Programming'),
  new Project('Math'),
];
KeedoStorage.todos = todos;
KeedoStorage.projects = projects;

const main = document.querySelector('main');
const primaryNav = getPrimaryNav(projects);
const todoModal = new TodoModal(document.querySelector('.todo-modal'), projects);
const todoRenderer = new TodoRenderer(document.querySelector('.todos'), todos);


(() => {
  document.body.style.overflow = 'hidden';
  
  const tutorialPanel = Object.assign(document.createElement('div'), {
    className: 'tutorial-panel flex-vertical-center',
  });
  const content = Object.assign(document.createElement('div'), {
    className: 'tutorial-content',
    innerHTML: `
      <div class="title">Welcome to Keedo!</div>
      <div class="paragraphs">
        <p>Want to accomplish something big but you always procrastinate? Well, you're in the right place!</p>
        <p>Keedo will help you divide your dreams into tasks so that you may achieve them.</p>
        <p>Let us start by clicking the 'Next' button below!</p>
      </div>
    `,
  });
  const nextButton = Object.assign(document.createElement('button'), {
    className: 'tutorial-next-button',
    innerText: 'Next',
  });

  const panelFns = [
    function() {
      tutorialPanel.style.backgroundColor = 'transparent';
      nextButton.style.right = '100px';
    },
  ];
  
  highlightCreateTodoBar();


  let currentPanel = 0;
  nextButton.addEventListener('click', () => {
    panelFns[0]();
  });
  
  //document.body.appendChild(tutorialPanel);

  tutorialPanel.appendChild(content);
  tutorialPanel.appendChild(nextButton);

  function isUsingMobile() {
    return window.innerWidth < 768;
  }

  function highlightMenuIcon() {
    const burgerIcon = writeTodoBar.querySelector('.open.primary-nav-button');
    burgerIcon.style.position = 'relative';
    burgerIcon.classList.add('tutorial-circle');
  }
  
  function highlightCreateTodoBar() {
    writeTodoBar.classList.add('tutorial-highlight');
  }
})();

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

  todos.forEach((todo) => {
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

  todos.forEach((todo) => {
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
  writeTodoBar.enable();
  todoRenderer.emptyMessage.innerHTML = `
    <p>Uh oh! You do not have any todos yet!</p>
    <p>Try adding some by writing one above!</p>
  `;

  if (primaryNav.isOpen()) {
    primaryNav.close();
  }

  if (tab === primaryNav.allTab) {
    todoRenderer.render(todos);
    return;
  }

  if (tab === primaryNav.completedTab) {
    writeTodoBar.disable();
    todoRenderer.emptyMessage.innerHTML = `
      <p>Uh oh! You have not finished any todos yet!</p>
      <p>Try completing some by checking them!</p>
    `;

    todoRenderer.render(todos, {
      filter: (todo) => {
        return todo.checked;
      },
      appendMode: true,
    });
    return;
  }

  if (tab === primaryNav.dueTab) {
    writeTodoBar.disable();
    todoRenderer.emptyMessage.innerHTML = `
      <p>Congratulations! Keep it up!</p>
      <p>You don't have any unfinished todos!</p>
    `;

    const today = format(new Date(), 'yyyy-MM-dd');
    todoRenderer.render(todos, {
      filter: (todo) => {
        return !todo.checked && today > todo.dueDate;
      },
      appendMode: true,
    });
    return;
  }

  const project = projects.find((p) => p.name === tabName);
  todoRenderer.renderProject(project, todos);
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
  todoModal.show(todo, (editedTodo) => {
    todos.splice(todos.findIndex(t => t === todo), 1);
    todoRenderer.removeCard(card);
    todos.push(editedTodo);
    todoRenderer.renderTodo(editedTodo);
    KeedoStorage.saveTodos();
  });
});

main.addEventListener('deleteTodo', (e) => {
  const { todo, card } = e.detail;
  const indexToRemove = todos.findIndex(t => t === todo);
  todos.splice(indexToRemove, 1);
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

main.addEventListener('enterWriteTodoInput', (e) => {
  const todo = new Todo({
    title: e.detail,
    project: todoRenderer.currentProject?.name ?? 'default',
  });
  todos.push(todo);
  todoRenderer.renderTodo(todo);
  KeedoStorage.saveTodos();
});

main.addEventListener('editWriteTodoInput', (e) => {
  todoModal.show({ title: e.detail, project: todoRenderer.currentProject?.name }, (todo) => {
    todos.push(todo); 
    todoRenderer.renderTodo(todo);
    KeedoStorage.saveTodos();
  });
});