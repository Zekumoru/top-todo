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
    this.#setEnterButtonEvents();
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
    const editButton = projectItem.querySelector('button.edit');
    let previousInputText = ''; //CHANGE THIS TO CHECK THE PROJECT ITSELF
    // MAKE PROJECT OBJECT RATHER THAN IT BEING A STRING

    const onInputEnter = () => {
      if (!input.value) {
        input.value = previousInputText;
        return;
      }

      if (input.value === previousInputText) return;
      console.log('check');
    };

    const onInputBlur = () => {
      editButton.style.display = '';
      editButton.classList.remove('mdi-check');
      editButton.classList.add('mdi-pencil');
    };

    input.value = item;
    input.addEventListener('focus', () => {
      editButton.classList.remove('mdi-pencil');
      editButton.classList.add('mdi-check');
      editButton.style.display = 'block';
      previousInputText = input.value;
    });

    input.addEventListener('keyup', (e) => {
      if (e.key !== 'Enter') return;
      onInputEnter();
      input.blur();
      onInputBlur();
    });

    editButton.addEventListener('click', () => {
      if (editButton.classList.contains('mdi-pencil')) {
        input.focus();
        return;
      }

      onInputEnter();
    });

    this.element.addEventListener('click', (e) => {
      // all of the conditions below check if the user
      // has clicked outside the input so that we can
      // change the edit icon accordingly
      if (e.target === input) return;
      if (document.activeElement === input) return;
      if (editButton.classList.contains('mdi-pencil')) return;
      if (input.value !== previousInputText) return;
      onInputBlur();
    });
    
    this.#list.appendChild(projectItem);
  }

  #createProjectItem() {
    const projectItem = document.createElement('li');
    projectItem.innerHTML = `
      <div class="mdi mdi-drag-vertical drag-handle"></div>
      <input type="text" placeholder="Enter project name" enterkeyhint="go">
      <div class="buttons">
        <button class="mdi mdi-pencil edit"></button>
        <button class="mdi mdi-delete delete"></button>
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

    this.#createInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        this.#enterCreate();
        return;
      }

      if (!this.#createInput.value) {
        this.#enterButton.style.display = 'none';
        return;
      }

      this.#enterButton.style.display = 'block';
    });
  }

  #setCreateButtonEvents() {
    this.element.addEventListener('click', (e) => {
      // same as above, all of these check if the user
      // has clicked outside the input
      if (e.target === this.#createInput) return;
      if (document.activeElement === this.#createInput) return;
      if (this.#createInput.value) return;
      if (this.#createButton.classList.contains('mdi-plus')) return;
      this.#createButton.classList.remove('mdi-close');
      this.#createButton.classList.add('mdi-plus');
    });

    this.#createButton.addEventListener('click', () => {
      if (this.#createButton.classList.contains('mdi-close')) {
        this.#resetCreateBar();
        return;
      }
      
      this.#createInput.focus();
    });
  }

  #setEnterButtonEvents() {
    this.#enterButton.addEventListener('click', () => this.#enterCreate());
  }

  #enterCreate() {
    const project = this.#createInput.value;
    if (!project) return;
    this.#resetCreateBar();
    this.#addProjectItem(project);
  }

  #resetCreateBar() {
    this.#createButton.classList.remove('mdi-close');
    this.#createButton.classList.add('mdi-plus');
    this.#enterButton.style.display = 'none';
    this.#createInput.value = '';
  }
};