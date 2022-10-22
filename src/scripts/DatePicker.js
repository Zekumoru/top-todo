import { compareAsc, format } from "date-fns";

export default class {
  static DATE_FORMAT = 'yyyy-MM-dd';
  #datePicker;
  #minDate;
  #maxDate;

  constructor(datePickerElement, date, minDate, maxDate) {
    this.#datePicker = datePickerElement;
    this.#minDate = minDate;
    this.#maxDate = maxDate;

    if (minDate) {
      datePickerElement.min = format(minDate, this.constructor.DATE_FORMAT);
    }

    if (maxDate) {
      datePickerElement.max = format(maxDate, this.constructor.DATE_FORMAT);
    }

    if (!this.#validate(date)) {
      datePickerElement.value = format(date, this.constructor.DATE_FORMAT);
    }

    datePickerElement.addEventListener('focusout', (e) => this.#validate(new Date(e.target.value)));
  }

  #validate(date) {
    if (compareAsc(date, this.#minDate) < 0) {
      this.#datePicker.value = format(this.#minDate, this.constructor.DATE_FORMAT);
      return -1;
    }

    if (compareAsc(date, this.#maxDate) > 0) {
      this.#datePicker.value = format(this.#maxDate, this.constructor.DATE_FORMAT);
      return 1;
    }

    return 0;
  }

  get value() {
    return this.#datePicker.value;
  }

  set value(value) {
    if (this.#validate(new Date(value))) return;
    this.#datePicker.value = value;
  }

  setDate(date) {
    if (this.#validate(date)) return;
    this.#datePicker.value = format(date, this.constructor.DATE_FORMAT);
  }

  getDate() {
    return new Date(this.#datePicker.value);
  }
}