import SortView from '../view/sort.js';
import {
  remove,
  render,
  RenderPosition,
  replace,
} from '../framework/render.js';
import { SortItem, SortType, UpdateType } from '../const.js';

export default class SortPresenter {
  #sortContainer = null;

  #sortModel = null;
  #waypointsModel = null;

  #sortComponent = null;

  constructor({ sortContainer, sortModel, waypointsModel }) {
    this.#sortContainer = sortContainer;
    this.#sortModel = sortModel;
    this.#waypointsModel = waypointsModel;

    this.#waypointsModel.addObserver(this.#handleModelEvent);
    this.#sortModel.addObserver(this.#handleModelEvent);
  }

  get sortTypes() {
    return Object.values(SortType).map((type) => type);
  }

  get sortItems() {
    return Object.values(SortItem).map((item) => item);
  }

  init() {
    const sortTypes = this.sortTypes;
    const sortItems = this.sortItems;
    const prevSortComponent = this.#sortComponent;

    this.#sortComponent = new SortView({
      sortTypes,
      sortItems,
      currentSort: this.#sortModel.sort,
      onSortChange: this.#handleSortChange,
    });

    if (!prevSortComponent) {
      render(
        this.#sortComponent,
        this.#sortContainer,
        RenderPosition.AFTERBEGIN
      );
      return;
    }

    replace(this.#sortComponent, prevSortComponent);
    remove(prevSortComponent);
  }

  #handleSortChange = (sortType) => {
    if (this.#sortModel.sort === sortType) {
      return;
    }

    this.#sortModel.setSort(UpdateType.MINOR, sortType);
  };

  #handleModelEvent = () => {
    this.init();
  };
}
