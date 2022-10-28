export default class {
  #closedOnSelf;

  constructor(triggerElement, parentElement, innerHTML, fnOnShown) {
    this.#closedOnSelf = false;
    triggerElement.addEventListener('click', () => {
      if (this.#closedOnSelf) {
        this.#closedOnSelf = false;
        return;
      }

      const popup = this.#showPopup(parentElement, innerHTML, (clickedOn) => {
        this.#closedOnSelf = (clickedOn === triggerElement);
      });

      if (typeof fnOnShown === 'function') fnOnShown(popup);
    });
  }

  #showPopup(parentElement, innerHTML, fnOnClosed) {
    const popup = document.createElement('div');
    popup.className = 'pop-up';
    popup.innerHTML = innerHTML;
    popup.close = function (clickedOn) {
      popup.remove();
      if (typeof fnOnClosed === 'function') fnOnClosed(clickedOn);
    };

    parentElement.appendChild(popup);
    return popup;
  }
}
