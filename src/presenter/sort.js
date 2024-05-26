import SortView from '../view/sort.js';
import { remove, render, replace } from '../render.js';
import { SortItems, SortType } from '../const.js';

export default class SortPresenter {
  #sortContainer = null;

  #sortModel = null;

  #sortComponent = null;

  constructor(sortContainer, sortModel) {
    this.#sortContainer = sortContainer;
    this.#sortModel = sortModel;
  }

  get sortTypes() {
    return Object.values(SortType).map((type) => type);
  }

  get sortItems() {
    return Object.values(SortItems).map((item) => item);
  }

  init() {
    const sortTypes = this.sortTypes;
    const sortItems = this.sortItems;
    const prevSortComponent = this.#sortComponent;

    this.#sortComponent = new SortView(
      sortTypes,
      sortItems,
      this.#sortModel.sort
    );

    if (!prevSortComponent) {
      render(this.#sortComponent, this.#sortContainer);
      return;
    }

    replace(this.#sortComponent, prevSortComponent);
    remove(prevSortComponent);
  }
}
