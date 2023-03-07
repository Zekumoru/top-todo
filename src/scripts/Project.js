import { nanoid } from "nanoid";

export default class {
  id;
  name;

  constructor(name) {
    this.id = nanoid();
    this.name = name;
  }
}
