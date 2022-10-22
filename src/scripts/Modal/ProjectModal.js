import Sortable from 'sortablejs';
import Modal from './Modal';

export default class extends Modal {
  #projects;
  #createInput;
  #createButton;
  #enterButton;
  #list;

  constructor(element, projects) {
    super(element);
    this.#projects = projects;
    this.#createInput = element.querySelector('.create-input');
    this.#createButton = element.querySelector('button.create');
    this.#enterButton = element.querySelector('button.enter');
    this.#list = this.element.querySelector('.project-modal-list');
    this.#populateList(projects);
    this.#setListSortability();
    this.#setCreateInputEvents();
    this.#setCreateButtonEvents();
  }

  #populateList(projects) {
    projects.forEach((project) => {
      if (project === 'default') return;
      this.#addProjectItem(project);
    });
  }

  #addProjectItem(item) {
    const projectItem = this.#createProjectItem();
    const input = projectItem.querySelector('input[type=text]');
    input.value = item;
    this.#list.appendChild(projectItem);
  }

  #createProjectItem() {
    const projectItem = document.createElement('li');
    projectItem.innerHTML = `
      <div class="mdi mdi-drag-vertical drag-handle"></div>
      <input type="text" placeholder="Enter project name">
      <div class="buttons">
        <button class="mdi mdi-pencil edit-icon"></button>
        <button class="mdi mdi-delete"></button>
      </div>
    `;
    return projectItem;
  }

  #setListSortability() {
    Sortable.create(this.#list, {
      animation: 150,
      handle: '.drag-handle',
    });
  }

  #setCreateInputEvents() {
    this.#createInput.addEventListener('focus', () => {
      this.#createButton.classList.remove('mdi-plus');
      this.#createButton.classList.add('mdi-close');
    });

    this.#createInput.addEventListener('keyup', () => {
      if (!this.#createInput.value) {
        this.#enterButton.style.display = 'none';
        return;
      }

      this.#enterButton.style.display = 'block';
    });
  }

  #setCreateButtonEvents() {
    this.element.addEventListener('click', (e) => {
      if (e.target === this.#createInput) return;
      if (document.activeElement === this.#createInput) return;
      if (this.#createInput.value) return;
      if (this.#createButton.classList.contains('mdi-plus')) return;
      this.#createButton.classList.remove('mdi-close');
      this.#createButton.classList.add('mdi-plus');
    });

    this.#createButton.addEventListener('click', () => {
      if (this.#createButton.classList.contains('mdi-close')) {
        this.#createButton.classList.remove('mdi-close');
        this.#createButton.classList.add('mdi-plus');
        this.#enterButton.style.display = 'none';
        this.#createInput.value = '';
        return;
      }
      
      this.#createInput.focus();
    });
  }
};