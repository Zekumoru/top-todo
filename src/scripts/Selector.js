export default class {
  #selectElement;
  #property;

  constructor(selectElement, { options = [], property = '', value = '' }) {
    this.#selectElement = selectElement;
    this.#property = property;
    this.renderOptions(options);
  }

  get value() {
    return this.#selectElement.options[this.#selectElement.selectedIndex].value;
  }

  set value(value) {
    for (let i = 0; i < this.#selectElement.options.length; i++) {
      const option = this.#selectElement.options[i];
      if (option.value === value) {
        this.#selectElement.selectedIndex = i;
        return;
      }
    }
  }

  reset() {
    this.#selectElement.selectedIndex = 0;
  }

  renderOptions(options = [], value = '') {
    this.#selectElement.innerHTML = '';
    options.forEach((option, index) => {
      if (typeof option === 'object') option = option[this.#property];
      const optionElement = this.#createOptionElement(option);
      this.#selectElement.appendChild(optionElement);
      if (option === value) this.#selectElement.selectedIndex = index;
    });
  }

  #createOptionElement(option) {
    const optionElement = document.createElement('option');
    optionElement.value = option;
    optionElement.innerText = option;
    return optionElement;
  }
};