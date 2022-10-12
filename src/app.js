import '@mdi/font/css/materialdesignicons.css'
import './styles/reset.css';
import './styles/styles.css';
import primaryNav from './scripts/primaryNav';

const main = document.querySelector('main');
const writeTodoInput = document.querySelector('.write-todo-bar input[type=text]');
const todos = document.querySelectorAll('.todos li');

primaryNav.addEventListener('openPrimaryNav', (e) => {
  main.inert = true;
});

primaryNav.addEventListener('closePrimaryNav', (e) => {
  main.inert = false;
});

todos.forEach((todo) => {
  const checkbox = todo.querySelector('.checkbox');

  checkbox.addEventListener('change', (e) => {
    if (e.target.checked) {
      todo.classList.add('check');
      return;
    }
    
    todo.classList.remove('check');
  });
});

// TODO MODAL
const todoModal = document.querySelector('.todo-modal');

(() => {
  const backButton = todoModal.querySelector('button.back');

  backButton.addEventListener('click', (e) => {
    main.inert = false;
    primaryNav.inert = false;
    todoModal.style.display = "none";
  });
})();

writeTodoInput.addEventListener('keyup', (e) => {
  if (e.key !== 'Enter') return;

  const input = writeTodoInput.value;
  if (!input) return;

  writeTodoInput.value = '';

  main.inert = true;
  primaryNav.inert = true;
  todoModal.style.display = 'flex';
  todoModal.querySelector('.title').value = input;
  todoModal.querySelector('.title').focus();
});