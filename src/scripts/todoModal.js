const todoModal = document.querySelector('.todo-modal');
export default todoModal;

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