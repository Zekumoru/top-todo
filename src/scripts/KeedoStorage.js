import { add, format } from "date-fns";
import Project from "./Project";
import Todo from "./Todo";

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
  populate: function() {
    const todos = [
      new Todo({
        title: 'Learn about Single Responsibility',
        description: 'What does it mean and what are the benefits of adhering to that principle?',
        project: 'programming',
        priority: 'medium',
        dueDate: format(add(new Date(), { days: 2 }), 'yyyy-MM-dd'),
      }),
      new Todo({
        title: 'Apple',
        project: 'Groceries',
      }),
      new Todo({
        title: 'Banana',
        project: 'Groceries',
      }),
      new Todo({
        title: 'Carrot',
        project: 'Groceries',
        priority: 'low',
      }),
      new Todo({
        title: 'Dragon fruit',
        project: 'Groceries',
        priority: 'medium',
      }),
      new Todo({
        title: 'Tap on me to edit my details',
        description: 'You can set any of my options to whatever you like!',
        project: 'default',
        priority: 'high',
      }),
    ];

    const projects = [
      new Project('default'),
      new Project('Programming'),
      new Project('Groceries'),
      new Project('Keedo'),
    ];

    return {
      todos,
      projects,
    };
  },
};