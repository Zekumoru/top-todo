import { compareAsc, format, isThisISOWeek, isToday, isTomorrow } from "date-fns";

export default class {
  element;
  #sections;
  #emptyMessage;

  constructor(element, todos) {
    this.element = element;
    this.#emptyMessage = this.element.querySelector('.empty-message');

    this.#sections = [];

    todos.forEach((todo) => this.renderTodo(todo));
  }

  renderTodo(todo) {
    const date = format(new Date(todo.dueDate), 'yyyy-MM-dd');
    let section = this.#sections.find(s => s.date === date);
    if (!section) {
      this.#hideEmptyMessage();
      section = this.#createSection(date);
    }

    const card = new Card(todo);

    const insertBefore = Array.from(section.list.children).reduce((before, current) => {
      const tp = this.#getPriority(todo.priority, todo.checked);
      const cp = this.#getPriority(current.className, current.querySelector('.checkbox').checked);
      const bp = (!before)? -1 : this.#getPriority(before.className, before.querySelector('.checkbox').checked);
      if (tp >= cp && cp > bp) return current;
      return before;
    }, null);
    
    section.list.insertBefore(card.element, insertBefore);
  }

  #getPriority(str, checked) {
    const offset = checked? 0 : 10;
    if (str.includes('high')) return 2 + offset;
    if (str.includes('medium')) return 1 + offset;
    return 0 + offset;
  }

  removeCard(card) {
    const section = this.#sections.find(s => s.element.contains(card));
    if (!section) return;
    
    section.list.removeChild(card);
    if (!section.list.hasChildNodes()) {
      this.element.removeChild(section.element);
      this.#sections.splice(this.#sections.findIndex(s => s === section), 1);
      this.#showEmptyMessage();
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

  #showEmptyMessage() {
    if (this.#sections.length) return;
    this.element.appendChild(this.#emptyMessage);
  }

  #hideEmptyMessage() {
    if (this.#sections.length !== 0) return;
    this.element.removeChild(this.#emptyMessage);
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
        <div class="mdi mdi-check-bold check-icon"></div>
      </div>
      <h3 class="title"></h3>
      <p class="content"></p>
      <div class="buttons">
        <button class="delete mdi mdi-delete"></button>
        <div class="button-container">
          <button class="priority mdi mdi-exclamation-thick"></button>
        </div>
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
    this.checkbox.checked = todo.checked;
    card.classList.add(`${todo.priority}-priority`);
    if (todo.checked) card.classList.add('checked');
    
    const editEvent = new CustomEvent('editTodo', { bubbles: true, cancelable: true, detail: { todo, card } });
    card.addEventListener('click', (e) => {
      if (e.target === this.checkbox) return;
      if (e.target === this.deleteButton) return;
      if (e.target === this.priorityButton) return;
      if (e.target === this.noteButton) return;
      let parent = e.target.parentElement;
      while (parent !== card) {
        if (parent.classList.contains('pop-up')) return;
        parent = parent.parentElement;
      }
      card.dispatchEvent(editEvent);
    });

    const checkedEvent = new CustomEvent('checkedTodo', { bubbles: true, cancelable: true, detail: { todo, card } });
    const uncheckedEvent = new CustomEvent('uncheckedTodo', { bubbles: true, cancelable: true, detail: { todo, card } });
    this.checkbox.addEventListener('change', (e) => {
      if (this.checkbox.checked) {
        card.dispatchEvent(checkedEvent);
        return;
      }

      card.dispatchEvent(uncheckedEvent);
    });

    const deleteEvent = new CustomEvent('deleteTodo', { bubbles: true, cancelable: true, detail: { todo, card } });
    this.deleteButton.addEventListener('click', () => {
      card.dispatchEvent(deleteEvent);
    });

    this.priorityButton.addEventListener('click', (e) => {
      if (card.querySelector('.pop-up')) return;

      const popup = document.createElement('div');
      popup.className = 'pop-up';
      popup.innerHTML = `
        <ul class="priority-choice-list">
          <li>
            <label class="priority-choice"><input type="radio" name="priority-choice" value="low" checked>Low</label>
          </li>
          <li>
            <label class="priority-choice"><input type="radio" name="priority-choice" value="medium">Med</label>
          </li>
          <li>
            <label class="priority-choice"><input type="radio" name="priority-choice" value="high">High</label>
          </li>
        </ul>
      `;

      this.priorityButton.parentElement.appendChild(popup);
    });
  }
}