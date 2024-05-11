import SortView from '../view/sort.js';
import {render} from '../render.js';

export default class Board {
  #sortContainer = null;

  #sortComponent = new SortView();

  constructor(sortContainer) {
    this.#sortContainer = sortContainer;
  }

  init() {
    this.#renderSort();
  }

  #renderSort() {
    render(this.#sortComponent, this.#sortContainer);
  }
}
