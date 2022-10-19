import DatePicker from "./DatePicker";
import RadioList from "./RadioList";
import Todo from "./Todo";

const todoModal = document.querySelector('.todo-modal');
export default todoModal;

const checkInput = todoModal.querySelector('.checkbox');
const titleInput = todoModal.querySelector('.title');
const descriptionInput = todoModal.querySelector('.description');
const projectSelect = todoModal.querySelector('.project-select');
const priorityList = new RadioList(todoModal.querySelector('.priority-choice-list'));
const dueDatePicker = new DatePicker(todoModal.querySelector('.due-date-picker'), new Date(2020, 11, 1), new Date());

const showEvent = new Event('showTodoModal');
const backEvent = new Event('backTodoModal');

let fnOnConfirm;

todoModal.show = function ({ title, description, project, priority, dueDate, checked }, fn) {
  fnOnConfirm = fn;

  checkInput.checked = checked;
  titleInput.value = title ?? '';
  descriptionInput.value = description ?? '';
  if (priority) priorityList.value = priority;
  if (dueDate) dueDatePicker.value = dueDate;
  
  todoModal.style.display = 'flex';
  titleInput.focus();
  todoModal.dispatchEvent(showEvent);
}

const backButton = todoModal.querySelector('button.back');
backButton.addEventListener('click', (e) => {
  reset();
  todoModal.style.display = 'none';
  todoModal.dispatchEvent(backEvent);
});

const confirmButton = todoModal.querySelector('button.confirm');
confirmButton.addEventListener('click', (e) => {
  const todo = new Todo({
    title: titleInput.value,
    description: descriptionInput.value,
    project: projectSelect.options[projectSelect.selectedIndex].value,
    priority: priorityList.value,
    dueDate: dueDatePicker.value,
    checked: checkInput.checked,
  });

  backButton.click();
  if (typeof fnOnConfirm === 'function') {
    fnOnConfirm(todo);
    fnOnConfirm = null;
  }
});

function reset() {
  titleInput.value = '';
  descriptionInput.value = '';
  priorityList.reset();
  dueDatePicker.setDate(new Date());
}