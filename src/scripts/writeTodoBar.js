const writeTodoBar = document.querySelector('.write-todo-bar');
export default writeTodoBar;

const input = writeTodoBar.querySelector('.write-todo-bar-input');
const buttons = writeTodoBar.querySelector('.buttons');
const enterButton = buttons.querySelector('.enter');
const editButton = buttons.querySelector('.edit');

input.addEventListener('keyup', (e) => {
  if (e.key !== 'Enter') return;
  enterInput(input.value);
});

function enterInput(text) {
  if (!text) return;

  input.value = '';
  const enterEvent = new CustomEvent('enterWriteTodoInput', { bubbles: true, cancelable: true, detail: text });
  input.dispatchEvent(enterEvent);
}

input.addEventListener('keyup', (e) => {
  if (!e.target.value || e.key === 'Enter') {
    buttons.style.display = 'none';
    return;
  }
  buttons.style.display = 'flex';
});

enterButton.addEventListener('click', (e) => {
  enterInput(input.value);
});

editButton.addEventListener('click', (e) => {
  const text = input.value;
  if (!text) return;

  input.value = '';
  const editEvent = new CustomEvent('editWriteTodoInput', { bubbles: true, cancelable: true, detail: text });
  input.dispatchEvent(editEvent);
});