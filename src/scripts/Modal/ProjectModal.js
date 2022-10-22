import Sortable from 'sortablejs';
import Modal from './Modal';

export default class extends Modal {
  constructor(element) {
    super(element);
    this.#setProjectListSortability();
  }

  #setProjectListSortability() {
    const projectModalList = this.element.querySelector('.project-modal-list');
    Sortable.create(projectModalList, {
      animation: 150,
      handle: '.drag-handle',
    });
  }
}