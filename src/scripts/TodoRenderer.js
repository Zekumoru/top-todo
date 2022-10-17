import { format, isToday, isTomorrow } from "date-fns";

export default class {
  element;

  constructor(element, todos) {
    this.element = element;
  }
}

class Section {
  #title;
  element;
  date;
  list;

  constructor(date) {
    const section = document.createElement('li');
    section.className = 'todo-section';
    section.innerHTML = `
      <li class="todo-section">
        <h2></h2>
        <ul></ul>
      </li>
    `;

    this.element = section;
    this.date = date;
    this.list = section.querySelector('ul');
    this.#title = section.querySelector('h2');

    this.updateTitle();
  }

  updateTitle() {
    const date = new Date(this.date);
    let title = format(date, 'eee - MMM. dd, yyyy');

    if (isToday(date)) {
      title = 'Today';
    }

    if (isTomorrow(date)) {
      title = 'Tomorrow';
    }

    this.#title.innerText = title;
  }
}