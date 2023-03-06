import { getAuth } from "firebase/auth";
import getPrimaryNav from "./getPrimaryNav";
import { getProjects, loadProjects } from "./projects-operations";
import { getTodos, loadTodos, todoRenderer } from "./todos-operations";

const primaryNav = getPrimaryNav(getProjects);

const setUserProfileTab = () => {
  const { name, pic } = primaryNav.userProfileTab;
  const profilePicUrl = getAuth().currentUser.photoURL;
  const userName = getAuth().currentUser.displayName;

  pic.style.backgroundImage = `url(${profilePicUrl})`;
  name.textContent = userName;
  primaryNav.userProfileTab.style.display = '';
};

const unsetUserProfileTab = () => {
  const { name, pic } = primaryNav.userProfileTab;

  name.textContent = '';
  pic.style.backgroundImage = '';
  primaryNav.userProfileTab.style.display = 'none';
};

const authStateObserver = (user) => {
  if (user) {
    primaryNav.signOutTab.removeAttribute('hidden');
    primaryNav.signInTab.setAttribute('hidden', 'true');
    setUserProfileTab();
    loadTodos();
    loadProjects();
    todoRenderer.render(getTodos());
    primaryNav.renderProjects(getProjects(), 'default');
    return;
  }
  
  primaryNav.signInTab.removeAttribute('hidden');
  primaryNav.signOutTab.setAttribute('hidden', 'true');
  unsetUserProfileTab();
  loadTodos();
  loadProjects();
  todoRenderer.render(getTodos());
  primaryNav.renderProjects(getProjects(), 'default');
}

export default authStateObserver;
