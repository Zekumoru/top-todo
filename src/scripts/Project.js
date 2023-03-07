import { nanoid } from "nanoid";

export default class {
  id;
  name;
  position;

  constructor(name, position = -1) {
    this.id = nanoid();
    this.name = name;
    this.position = position;
  }
}
