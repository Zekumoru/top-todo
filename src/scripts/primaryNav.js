const primaryNav = document.querySelector('.primary-nav');
export default primaryNav;

const openButton = document.querySelector('.open.primary-nav-button');
const closeButton = document.querySelector('.close.primary-nav-button');

const openEvent = new Event('openPrimaryNav', { bubbles: true });
const closeEvent = new Event('closePrimaryNav', { bubbles: true });

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

openButton.addEventListener('click', (e) => {
  primaryNav.style.left = '0px';
  primaryNav.dispatchEvent(openEvent);
});

closeButton.addEventListener('click', (e) => {
  primaryNav.style.left = '';
  primaryNav.dispatchEvent(closeEvent);
});