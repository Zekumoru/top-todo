import DatePicker from '../DatePicker';
import Modal from "./Modal";
import RadioList from "../RadioList";
import Todo from "../Todo";
import Selector from '../Selector';

export default class extends Modal {
  #projects;
  #checkBox;
  #titleInput;
  #descriptionInput;
  #projectSelector;
  #priorityRadioList;
  #dueDatePicker;
  #onConfirm;

  constructor(element, projects) {
    super(element);
    this.#projects = projects;
    this.#onConfirm = null;
    this.#checkBox = element.querySelector('.checkbox');
    this.#titleInput = element.querySelector('.title');
    this.#descriptionInput = element.querySelector('.description');
    this.#priorityRadioList = new RadioList(element.querySelector('.priority-choice-list'));
    this.#dueDatePicker = new DatePicker(element.querySelector('.due-date-picker'), new Date(), new Date());
    this.#projectSelector = new Selector(element.querySelector('.project-select'), {
      options: projects,
      property: 'name',
    });

    this.#setConfirmButton();
    this.#setTitleInputEvent();
    this.#setDescriptionInputEvent();
  }

  show({ title, description, project, priority, dueDate, checked }, fnOnConfirm) {
    this.#checkBox.checked = checked;
    this.#titleInput.value = title ?? '';
    this.#descriptionInput.value = description ?? '';
    this.#projectSelector.value = project;
    if (priority) this.#priorityRadioList.value = priority;
    if (dueDate) this.#dueDatePicker.value = dueDate;
    this.#onConfirm = fnOnConfirm;

    this.#projectSelector.renderOptions(this.#projects);
    super.show();
    this.#titleInput.focus();
  }

  hide() {
    this.reset();
    super.hide();
  }

  reset() {
    this.#checkBox.checked = false;
    this.#titleInput.value = '';
    this.#descriptionInput.value = '';
    this.#projectSelector.reset();
    this.#priorityRadioList.reset();
    this.#dueDatePicker.setDate(new Date());
  }

  #setConfirmButton() {
    const confirmButton = this.element.querySelector('button.confirm');
    confirmButton.addEventListener('click', () => {
      if (!this.#titleInput.value) {
        this.hide();
        return;
      }

      const todo = new Todo({
        title: this.#titleInput.value,
        description: this.#descriptionInput.value.replace(/[\r\n]+/g, ' '),
        project: this.#projectSelector.value,
        priority: this.#priorityRadioList.value,
        dueDate: this.#dueDatePicker.value,
        checked: this.#checkBox.checked,
      });
    
      this.hide();
      if (typeof this.#onConfirm === 'function') {
        this.#onConfirm(todo);
        this.#onConfirm = null;
      }
    });
  }
  
  #setTitleInputEvent() {
    this.#titleInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        this.#descriptionInput.focus();
        return;
      }
    });
  }

  #setDescriptionInputEvent() {
    this.#descriptionInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { 
        this.#descriptionInput.blur();
        return;
      }
    });
  }
};