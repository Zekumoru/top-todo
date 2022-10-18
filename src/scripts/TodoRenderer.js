import { format, isToday, isTomorrow } from "date-fns";

export default class {
  element;
  #sections;

  constructor(element, todos) {
    this.element = element;
    this.#sections = [];

    todos.forEach((todo) => this.renderTodo(todo));
  }

  renderTodo(todo) {
    let section = this.#sections.find(s => s.date === todo.dueDate);
    if (!section) {
      section = this.#createSection(todo.dueDate);
    }

    const card = new Card(todo);
    section.list.appendChild(card.element);
  }

  removeCard(card) {
    const section = this.#sections.find(s => s.element.contains(card));
    if (!section) return;
    
    section.list.removeChild(card);
    if (!section.list.hasChildNodes()) {
      this.element.removeChild(section.element);
    }
  }

  #createSection(date) {
    const section = new Section(date);

    let index = this.#sections.findIndex(s => s.date > date);
    if (index === -1) index = this.#sections.length;
    
    const prependTo = this.#sections[index];
    if (prependTo) this.element.insertBefore(section.element, prependTo.element);
    else this.element.appendChild(section.element);
    
    this.#sections.splice(index, 0, section);
    return section;
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
      <h2></h2>
      <ul></ul>
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

class Card {
  element;
  title;
  content;
  checkbox;
  deleteButton;
  priorityButton;
  noteButton;

  constructor(todo) {
    const card = document.createElement('li');
    card.className = 'todo-item';
    card.innerHTML = `
      <div class="checkbox-container">
        <input class="checkbox" type="checkbox">
        <div class="mdi mdi-check-bold check"></div>
      </div>
      <h3 class="title"></h3>
      <p class="content"></p>
      <div class="buttons">
        <button class="delete mdi mdi-delete"></button>
        <button class="priority mdi mdi-exclamation-thick"></button>
        <button class="note mdi mdi-comment-text-outline"></button>
      </div>
    `;

    this.element = card;
    this.title = card.querySelector('.title');
    this.content = card.querySelector('.content');
    this.checkbox = card.querySelector('.checkbox');
    this.deleteButton = card.querySelector('.delete');
    this.priorityButton = card.querySelector('.priority');
    this.noteButton = card.querySelector('.note');

    this.title.innerText = todo.title;
    this.content.innerText = todo.project;

    const checkedEvent = new CustomEvent('checkedTodo', { bubbles: true, cancelable: true, detail: { todo, card } });
    const uncheckedEvent = new CustomEvent('uncheckedTodo', { bubbles: true, cancelable: true, detail: { todo, card } });
    this.checkbox.addEventListener('change', () => {
      if (this.checkbox.checked) {
        card.dispatchEvent(checkedEvent);
        return;
      }

      card.dispatchEvent(uncheckedEvent);
    });

    const deleteEvent = new CustomEvent('deleteTodo', { bubbles: true, cancelable: true, detail: { todo, card } });
    this.deleteButton.addEventListener('click', () => card.dispatchEvent(deleteEvent));
  }
}