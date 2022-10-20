import RadioList from "../RadioList";
import Popup from "./Popup";

export default class {
  element;
  title;
  content;
  checkbox;
  deleteButton;
  priorityButton;
  commentButton;

  constructor(todo) {
    this.#createCard();
    this.#setValues(todo);
    this.#setEvents(todo);    
    this.#setCheckBoxEvents(todo);
    this.#setDeleteEvent(todo);
    this.#setChangePriorityEvent(todo);
    this.#setShowCommentEvent(todo);
  }

  #createCard() {
    this.element = document.createElement('li');
    this.element.className = 'todo-item';
    this.element.innerHTML = `
      <div class="checkbox-container">
        <input class="checkbox" type="checkbox">
        <div class="mdi mdi-check-bold check-icon"></div>
      </div>
      <h3 class="title"></h3>
      <p class="content"></p>
      <ul class="buttons">
        <li class="button-container">
          <button class="delete mdi mdi-delete"></button>
        </li>
        <li class="button-container">
          <button class="priority mdi mdi-exclamation-thick"></button>
        </li>
        <li class="button-container">
          <button class="comment mdi mdi-comment-text-outline"></button>
        </li>
      </ul>
    `;

    this.title = this.element.querySelector('.title');
    this.content = this.element.querySelector('.content');
    this.checkbox = this.element.querySelector('.checkbox');
    this.deleteButton = this.element.querySelector('.delete');
    this.priorityButton = this.element.querySelector('.priority');
    this.commentButton = this.element.querySelector('.comment');

    return this.element;
  }

  #setValues(todo) {
    this.title.innerText = todo.title;
    this.content.innerText = todo.project;
    this.checkbox.checked = todo.checked;
    this.element.classList.add(`${todo.priority}-priority`);
    if (todo.checked) this.element.classList.add('checked');
  }

  #setEvents(todo) {
    this.element.addEventListener('mouseover', (e) => {
      if (this.#isPopup(e.target)) {
        this.element.classList.remove('hoverable');
        return;
      }
      this.element.classList.add('hoverable');
    });
    
    this.element.addEventListener('click', (e) => {
      if (e.target === this.checkbox) return;
      if (e.target === this.deleteButton) return;
      if (e.target === this.priorityButton) return;
      if (e.target === this.commentButton) return;
      if (this.#isPopup(e.target)) return;

      const editEvent = new CustomEvent('editTodo', {
        bubbles: true,
        cancelable: true,
        detail: { 
          todo,
          card: this.element
        },
      });
      this.element.dispatchEvent(editEvent);
    });
  }

  #setCheckBoxEvents(todo) {
    const checkedEvent = new CustomEvent('checkedTodo',{ 
      bubbles: true,
      cancelable: true,
      detail: {
        todo,
        card: this.element
      },
    });

    const uncheckedEvent = new CustomEvent('uncheckedTodo', {
      bubbles: true,
      cancelable: true,
      detail: {
        todo,
        card: this.element
      },
    });
    
    this.checkbox.addEventListener('change', (e) => {
      if (this.checkbox.checked) {
        this.element.dispatchEvent(checkedEvent);
        return;
      }
      this.element.dispatchEvent(uncheckedEvent);
    });
  }

  #setDeleteEvent(todo) {
    const deleteEvent = new CustomEvent('deleteTodo', {
      bubbles: true,
      cancelable: true,
      detail: {
        todo,
        card: this.element
      },
    });
    this.deleteButton.addEventListener('click', () => this.element.dispatchEvent(deleteEvent));
  }

  #setChangePriorityEvent(todo) {
    new Popup(this.priorityButton, this.priorityButton.parentElement, `
      <div class="priority-choice-title">Change priority</div>
      <ul class="priority-choice-list">
        <li>
          <label class="priority-choice"><input type="radio" name="priority-choice" value="low">Low</label>
        </li>
        <li>
          <label class="priority-choice"><input type="radio" name="priority-choice" value="medium">Med</label>
        </li>
        <li>
          <label class="priority-choice"><input type="radio" name="priority-choice" value="high">High</label>
        </li>
      </ul>
    `, (popup) => {
      const priorityList = new RadioList(popup.querySelector('.priority-choice-list'));
      priorityList.element.querySelector(`input[value="${todo.priority}"]`).checked = true;

      priorityList.element.addEventListener('change', () => {
        const changePriorityEvent = new CustomEvent('changeTodoPriority', {
          bubbles: true,
          cancelable: true,
          detail: {
            todo,
            card: this.element,
            newPriority: priorityList.value,
          },
        });
        priorityList.element.dispatchEvent(changePriorityEvent);
        popup.close();
      });
    });
  }

  #setShowCommentEvent(todo) {
    new Popup(this.commentButton, this.commentButton.parentElement, `
      <div class="description-title">Description</div>
      <p class="description"></p>
    `, (popup) => {
      popup.querySelector('.description').innerText = todo.description || 'No description.';
    });
  }

  #isPopup(element) {
    let parent = element.parentElement;
    while (parent && parent !== this.element) {
      if (parent.classList.contains('pop-up')) return true;
      parent = parent.parentElement;
    }
    return false;
  }
};