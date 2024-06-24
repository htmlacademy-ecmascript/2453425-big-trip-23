import AbstractView from '../framework/view/abstract-view.js';

export default class NewWaypointButtonView extends AbstractView {
  #element = null;
  #handleNewEventButtonClick = null;

  constructor({ newEventButton, onNewEventButtonClick }) {
    super();

    this.#element = newEventButton;
    this.#handleNewEventButtonClick = onNewEventButtonClick;

    this.element.addEventListener('click', this.#newEventButtonClickHandler);
  }

  get element() {
    return this.#element;
  }

  disable() {
    this.element.disabled = true;
  }

  enable() {
    this.element.disabled = false;
  }

  #newEventButtonClickHandler = (event) => {
    event.preventDefault();
    this.#handleNewEventButtonClick();
  };
}
