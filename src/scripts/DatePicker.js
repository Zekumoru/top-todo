import { compareAsc, format } from "date-fns";

export default class {
  static DATE_FORMAT = 'yyyy-MM-dd';
  #datePicker;

  constructor(datePickerElement, date, minDate, maxDate) {
    this.#datePicker = datePickerElement;
    
    if (date) {
      datePickerElement.value = format(new Date(), this.constructor.DATE_FORMAT);
    }

    if (minDate) {
      datePickerElement.min = format(new Date(), this.constructor.DATE_FORMAT);
    }

    if (maxDate) {
      datePickerElement.max = format(new Date(), this.constructor.DATE_FORMAT);
    }

    datePickerElement.addEventListener('focusout', (e) => {
      if (compareAsc(new Date(datePickerElement.value), minDate) >= 0) return;
      datePickerElement.value = format(minDate, this.constructor.DATE_FORMAT);
    });
  }

  get value() {
    return this.#datePicker.value;
  }
}