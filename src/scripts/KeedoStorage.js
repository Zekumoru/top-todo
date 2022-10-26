const TODOS_KEY = 'todos';
const PROJECTS_KEY = 'projects';
const TUTORIAL_KEY = 'tutorial-shown';

export default {
  loadTodos: function() {
    return this.loadJSON(TODOS_KEY);
  },
  loadProjects: function() {
    return this.loadJSON(PROJECTS_KEY);
  },
  loadJSON(key) {
    const json = localStorage.getItem(key);
    if (!json) return;
    return JSON.parse(json);
  },
  saveTodos: function() {
    localStorage.setItem(TODOS_KEY, JSON.stringify(this.todos));
  },
  saveProjects: function() {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(this.projects));
  },
  get tutorialShown() {
    return localStorage.getItem(TUTORIAL_KEY);
  },
  set tutorialShown(value) {
    return localStorage.setItem(TUTORIAL_KEY, !!value);
  },
};