export default class Todo {
  title;
  description;
  project;
  priority;
  dueDate;
  checked;

  constructor(properties) {
    this.checked = false;
    
    Object.entries(properties).forEach(([key, value]) => {
      if (!Object.hasOwn(this, key)) return;
      this[key] = value;
    });
  }
}