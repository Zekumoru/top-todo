import '@mdi/font/css/materialdesignicons.css'
import './styles/reset.css';
import './styles/styles.css';

const primaryNav = document.querySelector('.primary-nav');
const main = document.querySelector('main');
const openPrimaryNavButton = document.querySelector('.open.primary-nav-button');
const closePrimaryNavButton = document.querySelector('.close.primary-nav-button');
const todos = document.querySelectorAll('.todos li');

openPrimaryNavButton.addEventListener('click', (e) => {
  main.inert = true;
  primaryNav.style.left = '0px';
});

closePrimaryNavButton.addEventListener('click', (e) => {
  main.inert = false;
  primaryNav.style.left = '';
});

primaryNav.querySelectorAll('li:not(.section)').forEach((navItem) => {
  navItem.addEventListener('click', (e) => selectPrimaryNavTab(navItem));
  navItem.addEventListener('keyup', (e) => {
    if (!(e.key === 'Enter' || e.key === ' ')) return;
    selectPrimaryNavTab(navItem);
  });
});

function selectPrimaryNavTab(tab) {
  const currentSelected = primaryNav.querySelector('li.current');
  if (tab === currentSelected) return;

  currentSelected.classList.remove('current');
  tab.classList.add('current');
}

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
