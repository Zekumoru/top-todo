"use strict";
(self["webpackChunktop_todo"] = self["webpackChunktop_todo"] || []).push([["src_scripts_TodoRenderer_TodoRenderer_js"],{

/***/ "./src/scripts/RadioList.js":
/*!**********************************!*\
  !*** ./src/scripts/RadioList.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (class {
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
});

/***/ }),

/***/ "./src/scripts/TodoRenderer/Card.js":
/*!******************************************!*\
  !*** ./src/scripts/TodoRenderer/Card.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _RadioList__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../RadioList */ "./src/scripts/RadioList.js");
/* harmony import */ var _Popup__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Popup */ "./src/scripts/TodoRenderer/Popup.js");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (class {
  todo;
  element;
  title;
  content;
  checkbox;
  deleteButton;
  priorityButton;
  commentButton;

  constructor(todo, propertyForContent) {
    this.todo = todo;
    this.#createCard();
    this.#setValues(propertyForContent);
    this.#setEvents();    
    this.#setCheckBoxEvents();
    this.#setDeleteEvent();
    this.#setChangePriorityEvent();
    this.#setShowCommentEvent();
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

  #setValues(propertyForContent) {
    this.title.innerText = this.todo.title;
    this.checkbox.checked = this.todo.checked;
    this.element.classList.add(`${this.todo.priority}-priority`);
    if (this.todo.checked) this.element.classList.add('checked');

    const content = this.todo[propertyForContent];
    if (content) {
      this.content.innerText = content;
      return;
    }

    if (propertyForContent === 'description') {
      this.content.innerText = 'No description.'
      return;
    }

    this.content.innerText = 'Error!'
  }

  #setEvents() {
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
          todo: this.todo,
          card: this.element
        },
      });
      this.element.dispatchEvent(editEvent);
    });
  }

  #setCheckBoxEvents() {
    const checkedEvent = new CustomEvent('checkedTodo',{ 
      bubbles: true,
      cancelable: true,
      detail: {
        todo: this.todo,
        card: this.element
      },
    });

    const uncheckedEvent = new CustomEvent('uncheckedTodo', {
      bubbles: true,
      cancelable: true,
      detail: {
        todo: this.todo,
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

  #setDeleteEvent() {
    const deleteEvent = new CustomEvent('deleteTodo', {
      bubbles: true,
      cancelable: true,
      detail: {
        todo: this.todo,
        card: this.element
      },
    });
    this.deleteButton.addEventListener('click', () => this.element.dispatchEvent(deleteEvent));
  }

  #setChangePriorityEvent() {
    new _Popup__WEBPACK_IMPORTED_MODULE_1__["default"](this.priorityButton, this.priorityButton.parentElement, `
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
      const priorityList = new _RadioList__WEBPACK_IMPORTED_MODULE_0__["default"](popup.querySelector('.priority-choice-list'));
      priorityList.element.querySelector(`input[value="${this.todo.priority}"]`).checked = true;

      priorityList.element.addEventListener('change', () => {
        const changePriorityEvent = new CustomEvent('changeTodoPriority', {
          bubbles: true,
          cancelable: true,
          detail: {
            todo: this.todo,
            card: this.element,
            newPriority: priorityList.value,
          },
        });
        priorityList.element.dispatchEvent(changePriorityEvent);
        popup.close();
      });
    });
  }

  #setShowCommentEvent() {
    new _Popup__WEBPACK_IMPORTED_MODULE_1__["default"](this.commentButton, this.commentButton.parentElement, `
      <div class="description-title">Description</div>
      <p class="description"></p>
    `, (popup) => {
      popup.querySelector('.description').innerText = this.todo.description || 'No description.';
    });
  }

  #isPopup(element) {
    let parent = element;
    while (parent && parent !== this.element) {
      if (parent.classList.contains('pop-up')) return true;
      parent = parent.parentElement;
    }
    return false;
  }
});;

/***/ }),

/***/ "./src/scripts/TodoRenderer/Popup.js":
/*!*******************************************!*\
  !*** ./src/scripts/TodoRenderer/Popup.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (class {
  #closedOnSelf;

  constructor(triggerElement, parentElement, innerHTML, fnOnShown) {
    this.#closedOnSelf = false;
    triggerElement.addEventListener('click', () => {
      if (this.#closedOnSelf) {
        this.#closedOnSelf = false;
        return;
      }

      const popup = this.#showPopup(parentElement, innerHTML, (clickedOn) => {
        this.#closedOnSelf = (clickedOn === triggerElement);
      });

      if (typeof fnOnShown === 'function') fnOnShown(popup);
    });
  }

  #showPopup(parentElement, innerHTML, fnOnClosed) {
    const popup = document.createElement('div');
    popup.className = 'pop-up';
    popup.innerHTML = innerHTML;
    popup.close = function(clickedOn) {
      popup.remove();
      if (typeof fnOnClosed === 'function') fnOnClosed(clickedOn);
    };

    parentElement.appendChild(popup);
    return popup;
  }
});;

/***/ }),

/***/ "./src/scripts/TodoRenderer/Section.js":
/*!*********************************************!*\
  !*** ./src/scripts/TodoRenderer/Section.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! date-fns */ "./node_modules/date-fns/esm/format/index.js");
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! date-fns */ "./node_modules/date-fns/esm/isToday/index.js");
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! date-fns */ "./node_modules/date-fns/esm/isTomorrow/index.js");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (class {
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
    let title = (0,date_fns__WEBPACK_IMPORTED_MODULE_0__["default"])(date, 'eee - MMM. dd, yyyy');

    if ((0,date_fns__WEBPACK_IMPORTED_MODULE_1__["default"])(date)) {
      title = 'Today';
    }

    if ((0,date_fns__WEBPACK_IMPORTED_MODULE_2__["default"])(date)) {
      title = 'Tomorrow';
    }

    this.#title.innerText = title;
  }
});;

/***/ }),

/***/ "./src/scripts/TodoRenderer/TodoRenderer.js":
/*!**************************************************!*\
  !*** ./src/scripts/TodoRenderer/TodoRenderer.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! date-fns */ "./node_modules/date-fns/esm/format/index.js");
/* harmony import */ var _Card__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Card */ "./src/scripts/TodoRenderer/Card.js");
/* harmony import */ var _Section__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Section */ "./src/scripts/TodoRenderer/Section.js");




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (class {
  element;
  currentProject;
  emptyMessage;
  #sections;
  #renderingProject;
  #appendMode;
  #fnFilter;

  constructor(element, todos) {
    this.element = element;
    this.currentProject = null;
    this.emptyMessage = this.element.querySelector('.empty-message');
    this.#renderingProject = false;
    this.#fnFilter = this.defaultFilter;
    this.#appendMode = false;

    this.#sections = [];
    this.render(todos);
  }

  get defaultFilter() {
    const today = (0,date_fns__WEBPACK_IMPORTED_MODULE_2__["default"])(new Date(), 'yyyy-MM-dd');
    return (todo) => {
      return todo.dueDate >= today;
    };
  }

  render(todos, { filter = this.defaultFilter, appendMode = false } = {}) {
    if (!this.#renderingProject) this.currentProject = null;
    this.#fnFilter = filter;
    this.#appendMode = appendMode;
    this.#emptyList();

    const listEmpty = todos.reduce((empty, todo) => {
      const card = this.renderTodo(todo);
      if (!card) return empty;
      return false;
    }, true);
    if (listEmpty) this.#showEmptyMessage();
  }

  renderTodo(todo) {
    if (!(this.currentProject === null || todo.project === this.currentProject.name)) return;
    if (typeof this.#fnFilter === 'function' && !this.#fnFilter(todo)) return; 
    
    const date = (0,date_fns__WEBPACK_IMPORTED_MODULE_2__["default"])(new Date(todo.dueDate), 'yyyy-MM-dd');
    let section = this.#sections.find(s => s.date === date);
    if (!section) {
      this.#hideEmptyMessage();
      section = this.#createSection(date);
    }

    const propertyForContent = (this.currentProject)? 'description' : 'project';
    const card = new _Card__WEBPACK_IMPORTED_MODULE_0__["default"](todo, propertyForContent);

    const insertBefore = Array.from(section.list.children).reduce((before, current) => {
      const tp = this.#getPriority(todo.priority, todo.checked);
      const cp = this.#getPriority(current.className, current.querySelector('.checkbox').checked);
      const bp = (!before)? -1 : this.#getPriority(before.className, before.querySelector('.checkbox').checked);
      if (tp >= cp && cp > bp) return current;
      return before;
    }, null);
    
    section.list.insertBefore(card.element, insertBefore);
    return card;
  }

  renderProject(project, todos) {
    this.currentProject = project;
    this.#renderingProject = true;

    const today = (0,date_fns__WEBPACK_IMPORTED_MODULE_2__["default"])(new Date(), 'yyyy-MM-dd');
    this.render(todos, {
      filter: (todo) => {
        return todo.project === project.name && todo.dueDate >= today;
      },
    });
    this.#renderingProject = false;
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
    const section = new _Section__WEBPACK_IMPORTED_MODULE_1__["default"](date);
    
    let index;
    if (this.#appendMode) index = this.#sections.findIndex(s => s.date < date);
    else index = this.#sections.findIndex(s => s.date > date);
    if (index === -1) index = this.#sections.length;

    const insertBefore = this.#sections[index];
    if (insertBefore) this.element.insertBefore(section.element, insertBefore.element);
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
    this.element.appendChild(this.emptyMessage);
  }

  #hideEmptyMessage() {
    if (this.#sections.length !== 0) return;
    if (!this.element.contains(this.emptyMessage)) return;
    this.element.removeChild(this.emptyMessage);
  }
});

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3NjcmlwdHNfVG9kb1JlbmRlcmVyX1RvZG9SZW5kZXJlcl9qcy4yOThlNzM4OGM5OTAwZWMwMjk5YS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUEsaUVBQWU7QUFDZjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw2REFBNkQsTUFBTTtBQUNuRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUN2QnFDO0FBQ1Q7O0FBRTVCLGlFQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0MsbUJBQW1CO0FBQ3JEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsT0FBTztBQUNQO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBLFFBQVEsOENBQUs7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixrREFBUztBQUN4Qyx5REFBeUQsbUJBQW1COztBQUU1RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYLFNBQVM7QUFDVDtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTDs7QUFFQTtBQUNBLFFBQVEsOENBQUs7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUNwTUQsaUVBQWU7QUFDZjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDL0JzRDs7QUFFdkQsaUVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxnQkFBZ0Isb0RBQU07O0FBRXRCLFFBQVEsb0RBQU87QUFDZjtBQUNBOztBQUVBLFFBQVEsb0RBQVU7QUFDbEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0Q2lDO0FBQ1I7QUFDTTs7QUFFaEMsaUVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxrQkFBa0Isb0RBQU07QUFDeEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsa0JBQWtCLGtEQUFrRCxJQUFJO0FBQ3hFO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsb0RBQU07QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHFCQUFxQiw2Q0FBSTs7QUFFekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxrQkFBa0Isb0RBQU07QUFDeEI7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esd0JBQXdCLGdEQUFPO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90b3AtdG9kby8uL3NyYy9zY3JpcHRzL1JhZGlvTGlzdC5qcyIsIndlYnBhY2s6Ly90b3AtdG9kby8uL3NyYy9zY3JpcHRzL1RvZG9SZW5kZXJlci9DYXJkLmpzIiwid2VicGFjazovL3RvcC10b2RvLy4vc3JjL3NjcmlwdHMvVG9kb1JlbmRlcmVyL1BvcHVwLmpzIiwid2VicGFjazovL3RvcC10b2RvLy4vc3JjL3NjcmlwdHMvVG9kb1JlbmRlcmVyL1NlY3Rpb24uanMiLCJ3ZWJwYWNrOi8vdG9wLXRvZG8vLi9zcmMvc2NyaXB0cy9Ub2RvUmVuZGVyZXIvVG9kb1JlbmRlcmVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcbiAgI2xpc3RFbGVtZW50O1xuXG4gIGNvbnN0cnVjdG9yKGxpc3RFbGVtZW50KSB7XG4gICAgdGhpcy4jbGlzdEVsZW1lbnQgPSBsaXN0RWxlbWVudDtcbiAgfVxuXG4gIHNldCB2YWx1ZSh2YWx1ZSkge1xuICAgIGNvbnN0IHJhZGlvID0gdGhpcy4jbGlzdEVsZW1lbnQucXVlcnlTZWxlY3RvcihgW3ZhbHVlPScke3ZhbHVlfSddYCk7XG4gICAgcmFkaW8uY2hlY2tlZCA9IHRydWU7XG4gIH1cblxuICBnZXQgdmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2xpc3RFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJzpjaGVja2VkJykudmFsdWU7XG4gIH1cblxuICBnZXQgZWxlbWVudCgpIHtcbiAgICByZXR1cm4gdGhpcy4jbGlzdEVsZW1lbnQ7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLiNsaXN0RWxlbWVudC5xdWVyeVNlbGVjdG9yKCc6Zmlyc3QtY2hpbGQgaW5wdXQnKS5jaGVja2VkID0gdHJ1ZTtcbiAgfVxufSIsImltcG9ydCBSYWRpb0xpc3QgZnJvbSBcIi4uL1JhZGlvTGlzdFwiO1xuaW1wb3J0IFBvcHVwIGZyb20gXCIuL1BvcHVwXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcbiAgdG9kbztcbiAgZWxlbWVudDtcbiAgdGl0bGU7XG4gIGNvbnRlbnQ7XG4gIGNoZWNrYm94O1xuICBkZWxldGVCdXR0b247XG4gIHByaW9yaXR5QnV0dG9uO1xuICBjb21tZW50QnV0dG9uO1xuXG4gIGNvbnN0cnVjdG9yKHRvZG8sIHByb3BlcnR5Rm9yQ29udGVudCkge1xuICAgIHRoaXMudG9kbyA9IHRvZG87XG4gICAgdGhpcy4jY3JlYXRlQ2FyZCgpO1xuICAgIHRoaXMuI3NldFZhbHVlcyhwcm9wZXJ0eUZvckNvbnRlbnQpO1xuICAgIHRoaXMuI3NldEV2ZW50cygpOyAgICBcbiAgICB0aGlzLiNzZXRDaGVja0JveEV2ZW50cygpO1xuICAgIHRoaXMuI3NldERlbGV0ZUV2ZW50KCk7XG4gICAgdGhpcy4jc2V0Q2hhbmdlUHJpb3JpdHlFdmVudCgpO1xuICAgIHRoaXMuI3NldFNob3dDb21tZW50RXZlbnQoKTtcbiAgfVxuXG4gICNjcmVhdGVDYXJkKCkge1xuICAgIHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgdGhpcy5lbGVtZW50LmNsYXNzTmFtZSA9ICd0b2RvLWl0ZW0nO1xuICAgIHRoaXMuZWxlbWVudC5pbm5lckhUTUwgPSBgXG4gICAgICA8ZGl2IGNsYXNzPVwiY2hlY2tib3gtY29udGFpbmVyXCI+XG4gICAgICAgIDxpbnB1dCBjbGFzcz1cImNoZWNrYm94XCIgdHlwZT1cImNoZWNrYm94XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJtZGkgbWRpLWNoZWNrLWJvbGQgY2hlY2staWNvblwiPjwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICA8aDMgY2xhc3M9XCJ0aXRsZVwiPjwvaDM+XG4gICAgICA8cCBjbGFzcz1cImNvbnRlbnRcIj48L3A+XG4gICAgICA8dWwgY2xhc3M9XCJidXR0b25zXCI+XG4gICAgICAgIDxsaSBjbGFzcz1cImJ1dHRvbi1jb250YWluZXJcIj5cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiZGVsZXRlIG1kaSBtZGktZGVsZXRlXCI+PC9idXR0b24+XG4gICAgICAgIDwvbGk+XG4gICAgICAgIDxsaSBjbGFzcz1cImJ1dHRvbi1jb250YWluZXJcIj5cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwicHJpb3JpdHkgbWRpIG1kaS1leGNsYW1hdGlvbi10aGlja1wiPjwvYnV0dG9uPlxuICAgICAgICA8L2xpPlxuICAgICAgICA8bGkgY2xhc3M9XCJidXR0b24tY29udGFpbmVyXCI+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImNvbW1lbnQgbWRpIG1kaS1jb21tZW50LXRleHQtb3V0bGluZVwiPjwvYnV0dG9uPlxuICAgICAgICA8L2xpPlxuICAgICAgPC91bD5cbiAgICBgO1xuXG4gICAgdGhpcy50aXRsZSA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKTtcbiAgICB0aGlzLmNvbnRlbnQgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLmNvbnRlbnQnKTtcbiAgICB0aGlzLmNoZWNrYm94ID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jaGVja2JveCcpO1xuICAgIHRoaXMuZGVsZXRlQnV0dG9uID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kZWxldGUnKTtcbiAgICB0aGlzLnByaW9yaXR5QnV0dG9uID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcmlvcml0eScpO1xuICAgIHRoaXMuY29tbWVudEJ1dHRvbiA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuY29tbWVudCcpO1xuXG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudDtcbiAgfVxuXG4gICNzZXRWYWx1ZXMocHJvcGVydHlGb3JDb250ZW50KSB7XG4gICAgdGhpcy50aXRsZS5pbm5lclRleHQgPSB0aGlzLnRvZG8udGl0bGU7XG4gICAgdGhpcy5jaGVja2JveC5jaGVja2VkID0gdGhpcy50b2RvLmNoZWNrZWQ7XG4gICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoYCR7dGhpcy50b2RvLnByaW9yaXR5fS1wcmlvcml0eWApO1xuICAgIGlmICh0aGlzLnRvZG8uY2hlY2tlZCkgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2NoZWNrZWQnKTtcblxuICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLnRvZG9bcHJvcGVydHlGb3JDb250ZW50XTtcbiAgICBpZiAoY29udGVudCkge1xuICAgICAgdGhpcy5jb250ZW50LmlubmVyVGV4dCA9IGNvbnRlbnQ7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHByb3BlcnR5Rm9yQ29udGVudCA9PT0gJ2Rlc2NyaXB0aW9uJykge1xuICAgICAgdGhpcy5jb250ZW50LmlubmVyVGV4dCA9ICdObyBkZXNjcmlwdGlvbi4nXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5jb250ZW50LmlubmVyVGV4dCA9ICdFcnJvciEnXG4gIH1cblxuICAjc2V0RXZlbnRzKCkge1xuICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCAoZSkgPT4ge1xuICAgICAgaWYgKHRoaXMuI2lzUG9wdXAoZS50YXJnZXQpKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdob3ZlcmFibGUnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2hvdmVyYWJsZScpO1xuICAgIH0pO1xuICAgIFxuICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICBpZiAoZS50YXJnZXQgPT09IHRoaXMuY2hlY2tib3gpIHJldHVybjtcbiAgICAgIGlmIChlLnRhcmdldCA9PT0gdGhpcy5kZWxldGVCdXR0b24pIHJldHVybjtcbiAgICAgIGlmIChlLnRhcmdldCA9PT0gdGhpcy5wcmlvcml0eUJ1dHRvbikgcmV0dXJuO1xuICAgICAgaWYgKGUudGFyZ2V0ID09PSB0aGlzLmNvbW1lbnRCdXR0b24pIHJldHVybjtcbiAgICAgIGlmICh0aGlzLiNpc1BvcHVwKGUudGFyZ2V0KSkgcmV0dXJuO1xuXG4gICAgICBjb25zdCBlZGl0RXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoJ2VkaXRUb2RvJywge1xuICAgICAgICBidWJibGVzOiB0cnVlLFxuICAgICAgICBjYW5jZWxhYmxlOiB0cnVlLFxuICAgICAgICBkZXRhaWw6IHsgXG4gICAgICAgICAgdG9kbzogdGhpcy50b2RvLFxuICAgICAgICAgIGNhcmQ6IHRoaXMuZWxlbWVudFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICB0aGlzLmVsZW1lbnQuZGlzcGF0Y2hFdmVudChlZGl0RXZlbnQpO1xuICAgIH0pO1xuICB9XG5cbiAgI3NldENoZWNrQm94RXZlbnRzKCkge1xuICAgIGNvbnN0IGNoZWNrZWRFdmVudCA9IG5ldyBDdXN0b21FdmVudCgnY2hlY2tlZFRvZG8nLHsgXG4gICAgICBidWJibGVzOiB0cnVlLFxuICAgICAgY2FuY2VsYWJsZTogdHJ1ZSxcbiAgICAgIGRldGFpbDoge1xuICAgICAgICB0b2RvOiB0aGlzLnRvZG8sXG4gICAgICAgIGNhcmQ6IHRoaXMuZWxlbWVudFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHVuY2hlY2tlZEV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KCd1bmNoZWNrZWRUb2RvJywge1xuICAgICAgYnViYmxlczogdHJ1ZSxcbiAgICAgIGNhbmNlbGFibGU6IHRydWUsXG4gICAgICBkZXRhaWw6IHtcbiAgICAgICAgdG9kbzogdGhpcy50b2RvLFxuICAgICAgICBjYXJkOiB0aGlzLmVsZW1lbnRcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgXG4gICAgdGhpcy5jaGVja2JveC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZSkgPT4ge1xuICAgICAgaWYgKHRoaXMuY2hlY2tib3guY2hlY2tlZCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQuZGlzcGF0Y2hFdmVudChjaGVja2VkRXZlbnQpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLmVsZW1lbnQuZGlzcGF0Y2hFdmVudCh1bmNoZWNrZWRFdmVudCk7XG4gICAgfSk7XG4gIH1cblxuICAjc2V0RGVsZXRlRXZlbnQoKSB7XG4gICAgY29uc3QgZGVsZXRlRXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoJ2RlbGV0ZVRvZG8nLCB7XG4gICAgICBidWJibGVzOiB0cnVlLFxuICAgICAgY2FuY2VsYWJsZTogdHJ1ZSxcbiAgICAgIGRldGFpbDoge1xuICAgICAgICB0b2RvOiB0aGlzLnRvZG8sXG4gICAgICAgIGNhcmQ6IHRoaXMuZWxlbWVudFxuICAgICAgfSxcbiAgICB9KTtcbiAgICB0aGlzLmRlbGV0ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHRoaXMuZWxlbWVudC5kaXNwYXRjaEV2ZW50KGRlbGV0ZUV2ZW50KSk7XG4gIH1cblxuICAjc2V0Q2hhbmdlUHJpb3JpdHlFdmVudCgpIHtcbiAgICBuZXcgUG9wdXAodGhpcy5wcmlvcml0eUJ1dHRvbiwgdGhpcy5wcmlvcml0eUJ1dHRvbi5wYXJlbnRFbGVtZW50LCBgXG4gICAgICA8ZGl2IGNsYXNzPVwicHJpb3JpdHktY2hvaWNlLXRpdGxlXCI+Q2hhbmdlIHByaW9yaXR5PC9kaXY+XG4gICAgICA8dWwgY2xhc3M9XCJwcmlvcml0eS1jaG9pY2UtbGlzdFwiPlxuICAgICAgICA8bGk+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzPVwicHJpb3JpdHktY2hvaWNlXCI+PGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJwcmlvcml0eS1jaG9pY2VcIiB2YWx1ZT1cImxvd1wiPkxvdzwvbGFiZWw+XG4gICAgICAgIDwvbGk+XG4gICAgICAgIDxsaT5cbiAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJwcmlvcml0eS1jaG9pY2VcIj48aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cInByaW9yaXR5LWNob2ljZVwiIHZhbHVlPVwibWVkaXVtXCI+TWVkPC9sYWJlbD5cbiAgICAgICAgPC9saT5cbiAgICAgICAgPGxpPlxuICAgICAgICAgIDxsYWJlbCBjbGFzcz1cInByaW9yaXR5LWNob2ljZVwiPjxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwicHJpb3JpdHktY2hvaWNlXCIgdmFsdWU9XCJoaWdoXCI+SGlnaDwvbGFiZWw+XG4gICAgICAgIDwvbGk+XG4gICAgICA8L3VsPlxuICAgIGAsIChwb3B1cCkgPT4ge1xuICAgICAgY29uc3QgcHJpb3JpdHlMaXN0ID0gbmV3IFJhZGlvTGlzdChwb3B1cC5xdWVyeVNlbGVjdG9yKCcucHJpb3JpdHktY2hvaWNlLWxpc3QnKSk7XG4gICAgICBwcmlvcml0eUxpc3QuZWxlbWVudC5xdWVyeVNlbGVjdG9yKGBpbnB1dFt2YWx1ZT1cIiR7dGhpcy50b2RvLnByaW9yaXR5fVwiXWApLmNoZWNrZWQgPSB0cnVlO1xuXG4gICAgICBwcmlvcml0eUxpc3QuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGNoYW5nZVByaW9yaXR5RXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoJ2NoYW5nZVRvZG9Qcmlvcml0eScsIHtcbiAgICAgICAgICBidWJibGVzOiB0cnVlLFxuICAgICAgICAgIGNhbmNlbGFibGU6IHRydWUsXG4gICAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgICB0b2RvOiB0aGlzLnRvZG8sXG4gICAgICAgICAgICBjYXJkOiB0aGlzLmVsZW1lbnQsXG4gICAgICAgICAgICBuZXdQcmlvcml0eTogcHJpb3JpdHlMaXN0LnZhbHVlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgICBwcmlvcml0eUxpc3QuZWxlbWVudC5kaXNwYXRjaEV2ZW50KGNoYW5nZVByaW9yaXR5RXZlbnQpO1xuICAgICAgICBwb3B1cC5jbG9zZSgpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAjc2V0U2hvd0NvbW1lbnRFdmVudCgpIHtcbiAgICBuZXcgUG9wdXAodGhpcy5jb21tZW50QnV0dG9uLCB0aGlzLmNvbW1lbnRCdXR0b24ucGFyZW50RWxlbWVudCwgYFxuICAgICAgPGRpdiBjbGFzcz1cImRlc2NyaXB0aW9uLXRpdGxlXCI+RGVzY3JpcHRpb248L2Rpdj5cbiAgICAgIDxwIGNsYXNzPVwiZGVzY3JpcHRpb25cIj48L3A+XG4gICAgYCwgKHBvcHVwKSA9PiB7XG4gICAgICBwb3B1cC5xdWVyeVNlbGVjdG9yKCcuZGVzY3JpcHRpb24nKS5pbm5lclRleHQgPSB0aGlzLnRvZG8uZGVzY3JpcHRpb24gfHwgJ05vIGRlc2NyaXB0aW9uLic7XG4gICAgfSk7XG4gIH1cblxuICAjaXNQb3B1cChlbGVtZW50KSB7XG4gICAgbGV0IHBhcmVudCA9IGVsZW1lbnQ7XG4gICAgd2hpbGUgKHBhcmVudCAmJiBwYXJlbnQgIT09IHRoaXMuZWxlbWVudCkge1xuICAgICAgaWYgKHBhcmVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3BvcC11cCcpKSByZXR1cm4gdHJ1ZTtcbiAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnRFbGVtZW50O1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn07IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xuICAjY2xvc2VkT25TZWxmO1xuXG4gIGNvbnN0cnVjdG9yKHRyaWdnZXJFbGVtZW50LCBwYXJlbnRFbGVtZW50LCBpbm5lckhUTUwsIGZuT25TaG93bikge1xuICAgIHRoaXMuI2Nsb3NlZE9uU2VsZiA9IGZhbHNlO1xuICAgIHRyaWdnZXJFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuI2Nsb3NlZE9uU2VsZikge1xuICAgICAgICB0aGlzLiNjbG9zZWRPblNlbGYgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBwb3B1cCA9IHRoaXMuI3Nob3dQb3B1cChwYXJlbnRFbGVtZW50LCBpbm5lckhUTUwsIChjbGlja2VkT24pID0+IHtcbiAgICAgICAgdGhpcy4jY2xvc2VkT25TZWxmID0gKGNsaWNrZWRPbiA9PT0gdHJpZ2dlckVsZW1lbnQpO1xuICAgICAgfSk7XG5cbiAgICAgIGlmICh0eXBlb2YgZm5PblNob3duID09PSAnZnVuY3Rpb24nKSBmbk9uU2hvd24ocG9wdXApO1xuICAgIH0pO1xuICB9XG5cbiAgI3Nob3dQb3B1cChwYXJlbnRFbGVtZW50LCBpbm5lckhUTUwsIGZuT25DbG9zZWQpIHtcbiAgICBjb25zdCBwb3B1cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHBvcHVwLmNsYXNzTmFtZSA9ICdwb3AtdXAnO1xuICAgIHBvcHVwLmlubmVySFRNTCA9IGlubmVySFRNTDtcbiAgICBwb3B1cC5jbG9zZSA9IGZ1bmN0aW9uKGNsaWNrZWRPbikge1xuICAgICAgcG9wdXAucmVtb3ZlKCk7XG4gICAgICBpZiAodHlwZW9mIGZuT25DbG9zZWQgPT09ICdmdW5jdGlvbicpIGZuT25DbG9zZWQoY2xpY2tlZE9uKTtcbiAgICB9O1xuXG4gICAgcGFyZW50RWxlbWVudC5hcHBlbmRDaGlsZChwb3B1cCk7XG4gICAgcmV0dXJuIHBvcHVwO1xuICB9XG59OyIsImltcG9ydCB7IGZvcm1hdCwgaXNUb2RheSwgaXNUb21vcnJvdyB9IGZyb20gXCJkYXRlLWZuc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB7XG4gICN0aXRsZTtcbiAgZWxlbWVudDtcbiAgZGF0ZTtcbiAgbGlzdDtcblxuICBjb25zdHJ1Y3RvcihkYXRlKSB7XG4gICAgY29uc3Qgc2VjdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgc2VjdGlvbi5jbGFzc05hbWUgPSAndG9kby1zZWN0aW9uJztcbiAgICBzZWN0aW9uLmlubmVySFRNTCA9IGBcbiAgICAgIDxoMj48L2gyPlxuICAgICAgPHVsPjwvdWw+XG4gICAgYDtcblxuICAgIHRoaXMuZWxlbWVudCA9IHNlY3Rpb247XG4gICAgdGhpcy5kYXRlID0gZGF0ZTtcbiAgICB0aGlzLmxpc3QgPSBzZWN0aW9uLnF1ZXJ5U2VsZWN0b3IoJ3VsJyk7XG4gICAgdGhpcy4jdGl0bGUgPSBzZWN0aW9uLnF1ZXJ5U2VsZWN0b3IoJ2gyJyk7XG5cbiAgICB0aGlzLnVwZGF0ZVRpdGxlKCk7XG4gIH1cblxuICB1cGRhdGVUaXRsZSgpIHtcbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGUodGhpcy5kYXRlKTtcbiAgICBsZXQgdGl0bGUgPSBmb3JtYXQoZGF0ZSwgJ2VlZSAtIE1NTS4gZGQsIHl5eXknKTtcblxuICAgIGlmIChpc1RvZGF5KGRhdGUpKSB7XG4gICAgICB0aXRsZSA9ICdUb2RheSc7XG4gICAgfVxuXG4gICAgaWYgKGlzVG9tb3Jyb3coZGF0ZSkpIHtcbiAgICAgIHRpdGxlID0gJ1RvbW9ycm93JztcbiAgICB9XG5cbiAgICB0aGlzLiN0aXRsZS5pbm5lclRleHQgPSB0aXRsZTtcbiAgfVxufTsiLCJpbXBvcnQgeyBmb3JtYXQgfSBmcm9tIFwiZGF0ZS1mbnNcIjtcbmltcG9ydCBDYXJkIGZyb20gXCIuL0NhcmRcIjtcbmltcG9ydCBTZWN0aW9uIGZyb20gXCIuL1NlY3Rpb25cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xuICBlbGVtZW50O1xuICBjdXJyZW50UHJvamVjdDtcbiAgZW1wdHlNZXNzYWdlO1xuICAjc2VjdGlvbnM7XG4gICNyZW5kZXJpbmdQcm9qZWN0O1xuICAjYXBwZW5kTW9kZTtcbiAgI2ZuRmlsdGVyO1xuXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnQsIHRvZG9zKSB7XG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcbiAgICB0aGlzLmN1cnJlbnRQcm9qZWN0ID0gbnVsbDtcbiAgICB0aGlzLmVtcHR5TWVzc2FnZSA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuZW1wdHktbWVzc2FnZScpO1xuICAgIHRoaXMuI3JlbmRlcmluZ1Byb2plY3QgPSBmYWxzZTtcbiAgICB0aGlzLiNmbkZpbHRlciA9IHRoaXMuZGVmYXVsdEZpbHRlcjtcbiAgICB0aGlzLiNhcHBlbmRNb2RlID0gZmFsc2U7XG5cbiAgICB0aGlzLiNzZWN0aW9ucyA9IFtdO1xuICAgIHRoaXMucmVuZGVyKHRvZG9zKTtcbiAgfVxuXG4gIGdldCBkZWZhdWx0RmlsdGVyKCkge1xuICAgIGNvbnN0IHRvZGF5ID0gZm9ybWF0KG5ldyBEYXRlKCksICd5eXl5LU1NLWRkJyk7XG4gICAgcmV0dXJuICh0b2RvKSA9PiB7XG4gICAgICByZXR1cm4gdG9kby5kdWVEYXRlID49IHRvZGF5O1xuICAgIH07XG4gIH1cblxuICByZW5kZXIodG9kb3MsIHsgZmlsdGVyID0gdGhpcy5kZWZhdWx0RmlsdGVyLCBhcHBlbmRNb2RlID0gZmFsc2UgfSA9IHt9KSB7XG4gICAgaWYgKCF0aGlzLiNyZW5kZXJpbmdQcm9qZWN0KSB0aGlzLmN1cnJlbnRQcm9qZWN0ID0gbnVsbDtcbiAgICB0aGlzLiNmbkZpbHRlciA9IGZpbHRlcjtcbiAgICB0aGlzLiNhcHBlbmRNb2RlID0gYXBwZW5kTW9kZTtcbiAgICB0aGlzLiNlbXB0eUxpc3QoKTtcblxuICAgIGNvbnN0IGxpc3RFbXB0eSA9IHRvZG9zLnJlZHVjZSgoZW1wdHksIHRvZG8pID0+IHtcbiAgICAgIGNvbnN0IGNhcmQgPSB0aGlzLnJlbmRlclRvZG8odG9kbyk7XG4gICAgICBpZiAoIWNhcmQpIHJldHVybiBlbXB0eTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LCB0cnVlKTtcbiAgICBpZiAobGlzdEVtcHR5KSB0aGlzLiNzaG93RW1wdHlNZXNzYWdlKCk7XG4gIH1cblxuICByZW5kZXJUb2RvKHRvZG8pIHtcbiAgICBpZiAoISh0aGlzLmN1cnJlbnRQcm9qZWN0ID09PSBudWxsIHx8IHRvZG8ucHJvamVjdCA9PT0gdGhpcy5jdXJyZW50UHJvamVjdC5uYW1lKSkgcmV0dXJuO1xuICAgIGlmICh0eXBlb2YgdGhpcy4jZm5GaWx0ZXIgPT09ICdmdW5jdGlvbicgJiYgIXRoaXMuI2ZuRmlsdGVyKHRvZG8pKSByZXR1cm47IFxuICAgIFxuICAgIGNvbnN0IGRhdGUgPSBmb3JtYXQobmV3IERhdGUodG9kby5kdWVEYXRlKSwgJ3l5eXktTU0tZGQnKTtcbiAgICBsZXQgc2VjdGlvbiA9IHRoaXMuI3NlY3Rpb25zLmZpbmQocyA9PiBzLmRhdGUgPT09IGRhdGUpO1xuICAgIGlmICghc2VjdGlvbikge1xuICAgICAgdGhpcy4jaGlkZUVtcHR5TWVzc2FnZSgpO1xuICAgICAgc2VjdGlvbiA9IHRoaXMuI2NyZWF0ZVNlY3Rpb24oZGF0ZSk7XG4gICAgfVxuXG4gICAgY29uc3QgcHJvcGVydHlGb3JDb250ZW50ID0gKHRoaXMuY3VycmVudFByb2plY3QpPyAnZGVzY3JpcHRpb24nIDogJ3Byb2plY3QnO1xuICAgIGNvbnN0IGNhcmQgPSBuZXcgQ2FyZCh0b2RvLCBwcm9wZXJ0eUZvckNvbnRlbnQpO1xuXG4gICAgY29uc3QgaW5zZXJ0QmVmb3JlID0gQXJyYXkuZnJvbShzZWN0aW9uLmxpc3QuY2hpbGRyZW4pLnJlZHVjZSgoYmVmb3JlLCBjdXJyZW50KSA9PiB7XG4gICAgICBjb25zdCB0cCA9IHRoaXMuI2dldFByaW9yaXR5KHRvZG8ucHJpb3JpdHksIHRvZG8uY2hlY2tlZCk7XG4gICAgICBjb25zdCBjcCA9IHRoaXMuI2dldFByaW9yaXR5KGN1cnJlbnQuY2xhc3NOYW1lLCBjdXJyZW50LnF1ZXJ5U2VsZWN0b3IoJy5jaGVja2JveCcpLmNoZWNrZWQpO1xuICAgICAgY29uc3QgYnAgPSAoIWJlZm9yZSk/IC0xIDogdGhpcy4jZ2V0UHJpb3JpdHkoYmVmb3JlLmNsYXNzTmFtZSwgYmVmb3JlLnF1ZXJ5U2VsZWN0b3IoJy5jaGVja2JveCcpLmNoZWNrZWQpO1xuICAgICAgaWYgKHRwID49IGNwICYmIGNwID4gYnApIHJldHVybiBjdXJyZW50O1xuICAgICAgcmV0dXJuIGJlZm9yZTtcbiAgICB9LCBudWxsKTtcbiAgICBcbiAgICBzZWN0aW9uLmxpc3QuaW5zZXJ0QmVmb3JlKGNhcmQuZWxlbWVudCwgaW5zZXJ0QmVmb3JlKTtcbiAgICByZXR1cm4gY2FyZDtcbiAgfVxuXG4gIHJlbmRlclByb2plY3QocHJvamVjdCwgdG9kb3MpIHtcbiAgICB0aGlzLmN1cnJlbnRQcm9qZWN0ID0gcHJvamVjdDtcbiAgICB0aGlzLiNyZW5kZXJpbmdQcm9qZWN0ID0gdHJ1ZTtcblxuICAgIGNvbnN0IHRvZGF5ID0gZm9ybWF0KG5ldyBEYXRlKCksICd5eXl5LU1NLWRkJyk7XG4gICAgdGhpcy5yZW5kZXIodG9kb3MsIHtcbiAgICAgIGZpbHRlcjogKHRvZG8pID0+IHtcbiAgICAgICAgcmV0dXJuIHRvZG8ucHJvamVjdCA9PT0gcHJvamVjdC5uYW1lICYmIHRvZG8uZHVlRGF0ZSA+PSB0b2RheTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgdGhpcy4jcmVuZGVyaW5nUHJvamVjdCA9IGZhbHNlO1xuICB9XG5cbiAgcmVwbGFjZUNhcmRzQ29udGVudChuZXdDb250ZW50LCBvbGRDb250ZW50KSB7XG4gICAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50b2RvLWl0ZW0nKS5mb3JFYWNoKChjYXJkKSA9PiB7XG4gICAgICBjb25zdCBjb250ZW50ID0gY2FyZC5xdWVyeVNlbGVjdG9yKCcuY29udGVudCcpO1xuICAgICAgaWYgKGNvbnRlbnQuaW5uZXJUZXh0ID09PSBvbGRDb250ZW50KSBjb250ZW50LmlubmVyVGV4dCA9IG5ld0NvbnRlbnQ7XG4gICAgfSk7XG4gIH1cblxuICAjZ2V0UHJpb3JpdHkoc3RyLCBjaGVja2VkKSB7XG4gICAgY29uc3Qgb2Zmc2V0ID0gY2hlY2tlZD8gMCA6IDEwO1xuICAgIGlmIChzdHIuaW5jbHVkZXMoJ2hpZ2gnKSkgcmV0dXJuIDIgKyBvZmZzZXQ7XG4gICAgaWYgKHN0ci5pbmNsdWRlcygnbWVkaXVtJykpIHJldHVybiAxICsgb2Zmc2V0O1xuICAgIHJldHVybiAwICsgb2Zmc2V0O1xuICB9XG5cbiAgcmVtb3ZlQ2FyZChjYXJkKSB7XG4gICAgY29uc3Qgc2VjdGlvbiA9IHRoaXMuI3NlY3Rpb25zLmZpbmQocyA9PiBzLmVsZW1lbnQuY29udGFpbnMoY2FyZCkpO1xuICAgIGlmICghc2VjdGlvbikgcmV0dXJuO1xuICAgIFxuICAgIHNlY3Rpb24ubGlzdC5yZW1vdmVDaGlsZChjYXJkKTtcbiAgICBpZiAoIXNlY3Rpb24ubGlzdC5oYXNDaGlsZE5vZGVzKCkpIHtcbiAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVDaGlsZChzZWN0aW9uLmVsZW1lbnQpO1xuICAgICAgdGhpcy4jc2VjdGlvbnMuc3BsaWNlKHRoaXMuI3NlY3Rpb25zLmZpbmRJbmRleChzID0+IHMgPT09IHNlY3Rpb24pLCAxKTtcbiAgICAgIHRoaXMuI3Nob3dFbXB0eU1lc3NhZ2UoKTtcbiAgICB9XG4gIH1cblxuICAjY3JlYXRlU2VjdGlvbihkYXRlKSB7XG4gICAgY29uc3Qgc2VjdGlvbiA9IG5ldyBTZWN0aW9uKGRhdGUpO1xuICAgIFxuICAgIGxldCBpbmRleDtcbiAgICBpZiAodGhpcy4jYXBwZW5kTW9kZSkgaW5kZXggPSB0aGlzLiNzZWN0aW9ucy5maW5kSW5kZXgocyA9PiBzLmRhdGUgPCBkYXRlKTtcbiAgICBlbHNlIGluZGV4ID0gdGhpcy4jc2VjdGlvbnMuZmluZEluZGV4KHMgPT4gcy5kYXRlID4gZGF0ZSk7XG4gICAgaWYgKGluZGV4ID09PSAtMSkgaW5kZXggPSB0aGlzLiNzZWN0aW9ucy5sZW5ndGg7XG5cbiAgICBjb25zdCBpbnNlcnRCZWZvcmUgPSB0aGlzLiNzZWN0aW9uc1tpbmRleF07XG4gICAgaWYgKGluc2VydEJlZm9yZSkgdGhpcy5lbGVtZW50Lmluc2VydEJlZm9yZShzZWN0aW9uLmVsZW1lbnQsIGluc2VydEJlZm9yZS5lbGVtZW50KTtcbiAgICBlbHNlIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChzZWN0aW9uLmVsZW1lbnQpO1xuXG4gICAgdGhpcy4jc2VjdGlvbnMuc3BsaWNlKGluZGV4LCAwLCBzZWN0aW9uKTtcbiAgICByZXR1cm4gc2VjdGlvbjtcbiAgfVxuXG4gICNlbXB0eUxpc3QoKSB7XG4gICAgdGhpcy5lbGVtZW50LmlubmVySFRNTCA9ICcnO1xuICAgIHRoaXMuI3NlY3Rpb25zID0gW107XG4gIH1cblxuICAjc2hvd0VtcHR5TWVzc2FnZSgpIHtcbiAgICBpZiAodGhpcy4jc2VjdGlvbnMubGVuZ3RoKSByZXR1cm47XG4gICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuZW1wdHlNZXNzYWdlKTtcbiAgfVxuXG4gICNoaWRlRW1wdHlNZXNzYWdlKCkge1xuICAgIGlmICh0aGlzLiNzZWN0aW9ucy5sZW5ndGggIT09IDApIHJldHVybjtcbiAgICBpZiAoIXRoaXMuZWxlbWVudC5jb250YWlucyh0aGlzLmVtcHR5TWVzc2FnZSkpIHJldHVybjtcbiAgICB0aGlzLmVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy5lbXB0eU1lc3NhZ2UpO1xuICB9XG59Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9