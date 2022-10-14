export default class {
  #listElement;

  constructor(listElement) {
    this.#listElement = listElement;
  }

  get value() {
    return this.#listElement.querySelector(':checked').value;
  }

  reset() {
    this.#listElement.querySelector(':first-child input').checked = true;
  }
}