export default class {
  element;

  constructor(element) {
    this.element = element;
    this.#setBackButton();
  }

  show() {
    this.element.style.display = 'flex';
    
    const showModalEvent = new Event('showModal', {
      bubbles: true,
      cancelable: true,
    });
    this.element.dispatchEvent(showModalEvent);
  }

  hide() {
    this.element.style.display = 'none';
    
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