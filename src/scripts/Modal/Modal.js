export default class {
  element;
  #titleElement;

  constructor(element, title = '') {
    this.element = element;
    this.#titleElement = element.querySelector('.modal-title');
    if (title) this.#titleElement.innerText = title;
    this.#setBackButton();
  }

  get title() {
    return this.#titleElement.innerText;
  }

  set title(value) {
    this.#titleElement.innerText = value;
  }

  show() {
    this.element.style.display = 'flex';
    document.body.style.overflowY = 'hidden';
    
    const showModalEvent = new Event('showModal', {
      bubbles: true,
      cancelable: true,
    });
    this.element.dispatchEvent(showModalEvent);
  }

  hide() {
    this.element.style.display = 'none';
    document.body.style.overflowY = '';
    
    const hideModalEvent = new Event('hideModal', {
      bubbles: true,
      cancelable: true,
    });
    this.element.dispatchEvent(hideModalEvent);
  }

  #setBackButton() {
    const backButton = this.element.querySelector('button.back');
    backButton.addEventListener('click', () => this.hide());
  }
};