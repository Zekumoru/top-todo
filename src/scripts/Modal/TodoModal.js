import DatePicker from '../DatePicker';
import Modal from "./Modal";
import RadioList from "../RadioList";
import Todo from "../Todo";

export default class extends Modal {
  #checkBox;
  #titleInput;
  #descriptionInput;
  #projectSelector;
  #priorityRadioList;
  #dueDatePicker;
  #onConfirm;

  constructor(element) {
    super(element);
    this.#checkBox = element.querySelector('.checkbox');
    this.#titleInput = element.querySelector('.title');
    this.#descriptionInput = element.querySelector('.description');
    this.#projectSelector = element.querySelector('.project-select');
    this.#priorityRadioList = new RadioList(element.querySelector('.priority-choice-list'));
    this.#dueDatePicker = new DatePicker(element.querySelector('.due-date-picker'), new Date(), new Date());
    this.#onConfirm = null;
    this.#setConfirmButton();
    this.#setDescriptionInputEvent();
  }

  show({ title, description, project, priority, dueDate, checked }, fnOnConfirm) {
    this.#checkBox.checked = checked;
    this.#titleInput.value = title ?? '';
    this.#descriptionInput.value = description ?? '';
    if (priority) this.#priorityRadioList.value = priority;
    if (dueDate) this.#dueDatePicker.value = dueDate;
    this.#onConfirm = fnOnConfirm;

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
    this.#priorityRadioList.reset();
    this.#dueDatePicker.setDate(new Date());
  }

  #setConfirmButton() {
    const confirmButton = this.element.querySelector('button.confirm');
    confirmButton.addEventListener('click', () => {
      const todo = new Todo({
        title: this.#titleInput.value,
        description: this.#descriptionInput.value.replace(/[\r\n]+/g, ' '),
        project: this.#projectSelector.options[this.#projectSelector.selectedIndex].value,
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
  
  #setDescriptionInputEvent() {
    this.#descriptionInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') e.preventDefault();
    });
  }
};