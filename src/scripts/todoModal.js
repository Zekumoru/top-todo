import DatePicker from "./DatePicker";
import RadioList from "./RadioList";

const todoModal = document.querySelector('.todo-modal');
export default todoModal;

const title = todoModal.querySelector('.title');
const description = todoModal.querySelector('.description');
const priorityList = new RadioList(todoModal.querySelector('.priority-choice-list'));
const dueDatePicker = new DatePicker(todoModal.querySelector('.due-date-picker'), new Date(2020, 11, 1), new Date());

const showEvent = new Event('showTodoModal');
const backEvent = new Event('backTodoModal');

todoModal.show = function (input) {
  todoModal.style.display = 'flex';
  todoModal.querySelector('.title').value = input;
  todoModal.querySelector('.title').focus();
  todoModal.dispatchEvent(showEvent);
}

const backButton = todoModal.querySelector('button.back');
backButton.addEventListener('click', (e) => {
  todoModal.style.display = 'none';
  todoModal.dispatchEvent(backEvent);
});

const confirmButton = todoModal.querySelector('button.confirm');
confirmButton.addEventListener('click', (e) => {
  const result = {
    title: title.value,
    description: description.value,
    priority: priorityList.value,
    dueDate: dueDatePicker.value,
  };

  reset();
  backButton.click();
  todoModal.dispatchEvent(new CustomEvent('confirmTodoModal', { detail: result }));
});

function reset() {
  priorityList.reset();
  dueDatePicker.setDate(new Date());
}