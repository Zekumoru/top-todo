export default class {
  #listElement;

  constructor(listElement) {
    this.#listElement = listElement;
  }

  set value(value) {
    const radio = this.#listElement.querySelector(`[value='${value}']`);
    radio.checked = true;
  }

  get value() {
    return this.#listElement.querySelector(':checked').value;
  }

  get element() {
    return this.#listElement;
  }

  reset() {
    this.#listElement.querySelector(':first-child input').checked = true;
  }
}
