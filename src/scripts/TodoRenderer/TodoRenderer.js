import { format } from "date-fns";
import Card from "./Card";
import Section from "./Section";

export default class {
  element;
  #sections;
  #emptyMessage;

  constructor(element, todos) {
    this.element = element;
    this.#emptyMessage = this.element.querySelector('.empty-message');

    this.#sections = [];
    this.render(todos);
  }

  render(todos, fnFilter = null) {
    this.#emptyList();
    const listEmpty = todos.reduce((empty, todo) => {
      if (typeof fnFilter === 'function' && fnFilter(todo)) return empty;
      this.renderTodo(todo);
      return false;
    }, true);
    if (listEmpty) this.#showEmptyMessage();
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

  renderProject(project, todos) {
    this.render(todos, (todo) => {
      return todo.project !== project.name;
    });
  }

  replaceCardsContent(newContent, oldContent) {
    this.element.querySelectorAll('.todo-item').forEach((card) => {
      const content = card.querySelector('.content');
      if (content.innerText === oldContent) content.innerText = newContent;
    });
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

  #emptyList() {
    this.element.innerHTML = '';
    this.#sections = [];
  }

  #showEmptyMessage() {
    if (this.#sections.length) return;
    this.element.appendChild(this.#emptyMessage);
  }

  #hideEmptyMessage() {
    if (this.#sections.length !== 0) return;
    if (!this.element.contains(this.#emptyMessage)) return;
    this.element.removeChild(this.#emptyMessage);
  }
}