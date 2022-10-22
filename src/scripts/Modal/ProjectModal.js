import Sortable from 'sortablejs';
import Modal from './Modal';

export default class extends Modal {
  #createInput;
  #createButton;
  #enterButton;

  constructor(element) {
    super(element);
    this.#createInput = element.querySelector('.create-input');
    this.#createButton = element.querySelector('button.create');
    this.#enterButton = element.querySelector('button.enter');
    this.#setProjectListSortability();
    this.#setCreateInputEvents();
    this.#setCreateButtonEvents();
  }

  #setProjectListSortability() {
    const projectModalList = this.element.querySelector('.project-modal-list');
    Sortable.create(projectModalList, {
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