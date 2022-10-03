import '@mdi/font/css/materialdesignicons.css'
import './styles.css';

const primaryNav = document.querySelector('.primary-nav');
const openPrimaryNavButton = document.querySelector('.open.primary-nav-button');
const closePrimaryNavButton = document.querySelector('.close.primary-nav-button');
const todos = document.querySelectorAll('.todos li');

openPrimaryNavButton.addEventListener('click', (e) => {
  openPrimaryNavButton.disabled = true;
  closePrimaryNavButton.disabled = false;
  primaryNav.style.left = '0px';
});

closePrimaryNavButton.addEventListener('click', (e) => {
  openPrimaryNavButton.disabled = false;
  closePrimaryNavButton.disabled = true;
  primaryNav.style.left = '';
});

primaryNav.querySelectorAll('li:not(.section)').forEach((navItem) => {
  navItem.addEventListener('click', (e) => {
    const currentSelected = primaryNav.querySelector('li.current');
    if (navItem === currentSelected) return;

    currentSelected.classList.remove('current');
    navItem.classList.add('current');
  });
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
