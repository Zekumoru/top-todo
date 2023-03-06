import { format } from 'date-fns';
import { nanoid } from 'nanoid';

export default class Todo {
  id;
  title;
  description;
  project;
  priority;
  dueDate;
  checked;

  constructor(properties) {
    this.id = nanoid();
    this.title = '';
    this.description = '';
    this.project = '';
    this.checked = false;
    this.priority = 'low';
    this.dueDate = format(new Date(), 'yyyy-MM-dd');

    Object.entries(properties).forEach(([key, value]) => {
      if (!Object.hasOwn(this, key)) return;
      this[key] = value;
    });
  }
}
