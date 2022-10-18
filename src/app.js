import '@mdi/font/css/materialdesignicons.css'
import './styles/reset.css';
import './styles/styles.css';
import primaryNav from './scripts/primaryNav';
import writeTodoBar from './scripts/writeTodoBar';
import todoModal from './scripts/todoModal';
import TodoRenderer from './scripts/TodoRenderer';
import Todo from './scripts/Todo';

const todos = [
  new Todo({
    title: 'ok',
    project: 'default',
    priority: 'low',
    dueDate: '2022/10/18',
  }),
  new Todo({
    title: 'hah',
    project: 'default',
    priority: 'medium',
    dueDate: '2022/10/18',
    checked: true,
  }),
  new Todo({
    title: 'eh',
    project: 'default',
    priority: 'medium',
    dueDate: '2022/10/18',
  }),
  new Todo({
    title: 'lala',
    project: 'default',
    priority: 'high',
    dueDate: '2022/10/18',
    checked: true,
  }),
  new Todo({
    title: 'zenith',
    project: 'default',
    priority: 'low',
    dueDate: '2022/10/18',
    checked: true,
  }),
  new Todo({
    title: 'lol',
    project: 'default',
    priority: 'high',
    dueDate: '2022/10/18',
  }),
  new Todo({
    title: 'hmm',
    project: 'default',
    priority: 'low',
    dueDate: '2022/10/18',
  }),
];
const todoRenderer = new TodoRenderer(document.querySelector('.todos'), todos);

const main = document.querySelector('main');

primaryNav.addEventListener('openPrimaryNav', (e) => {
  main.inert = true;
});

primaryNav.addEventListener('closePrimaryNav', (e) => {
  main.inert = false;
});

todoModal.addEventListener('backTodoModal', (e) => {
  main.inert = false;
  primaryNav.inert = false;
});

todoModal.addEventListener('showTodoModal', (e) => {
  main.inert = true;
  primaryNav.inert = true;
});

todoModal.addEventListener('confirmTodoModal', (e) => {
  const todo = e.detail;
  todos.push(todo);
  todoRenderer.renderTodo(todo);
});

main.addEventListener('checkedTodo', (e) => {
  const { todo, card } = e.detail;
  todo.checked = true;
  todoRenderer.removeCard(card);
  todoRenderer.renderTodo(todo);
});

main.addEventListener('uncheckedTodo', (e) => {
  const { todo, card } = e.detail;
  todo.checked = false;
  todoRenderer.removeCard(card);
  todoRenderer.renderTodo(todo);
});

main.addEventListener('editTodo', (e) => {
  const { todo } = e.detail;
});

main.addEventListener('deleteTodo', (e) => {
  const { todo, card } = e.detail;
  const indexToRemove = todos.findIndex(t => t === todo);
  todos.splice(indexToRemove, 1);
  todoRenderer.removeCard(card);
});

main.addEventListener('enterWriteTodoInput', (e) => {
  const todo = new Todo({
    title: e.detail,
    project: 'default',
  });
  todos.push(todo);
  todoRenderer.renderTodo(todo);
});

main.addEventListener('editWriteTodoInput', (e) => {
  todoModal.show(e.detail);
});