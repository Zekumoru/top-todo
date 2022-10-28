const writeTodoBar = document.querySelector('.write-todo-bar');
export default writeTodoBar;

const input = writeTodoBar.querySelector('.write-todo-bar-input');
const buttons = writeTodoBar.querySelector('.buttons');
const enterButton = buttons.querySelector('.enter');
const editButton = buttons.querySelector('.edit');
const defaultPlaceholder = input.placeholder;
let disabled = false;

writeTodoBar.enable = function () {
  input.disabled = false;
  input.placeholder = defaultPlaceholder;
  enterButton.disabled = false;
  editButton.disabled = false;
  disabled = false;
};

writeTodoBar.disable = function () {
  input.disabled = true;
  input.placeholder = 'Cannot write to do here!';
  enterButton.disabled = true;
  editButton.disabled = true;
  disabled = true;
};

input.addEventListener('keyup', (e) => {
  if (e.key !== 'Enter') return;
  enterInput(input.value);
});

function enterInput(text) {
  if (!text) return;

  input.value = '';
  buttons.style.display = 'none';
  const enterEvent = new CustomEvent('enterWriteTodoInput', { bubbles: true, cancelable: true, detail: text });
  input.dispatchEvent(enterEvent);
}

input.addEventListener('keydown', (e) => {
  if (disabled) e.preventDefault();
});

input.addEventListener('keyup', (e) => {
  if (!e.target.value || e.key === 'Enter') {
    buttons.style.display = 'none';
    return;
  }
  buttons.style.display = 'flex';
});

enterButton.addEventListener('click', () => {
  if (disabled) return;
  enterInput(input.value);
});

editButton.addEventListener('click', () => {
  if (disabled) return;

  const editEvent = new CustomEvent('editWriteTodoInput', { bubbles: true, cancelable: true, detail: input.value });
  input.value = '';
  buttons.style.display = 'none';
  input.dispatchEvent(editEvent);
});
