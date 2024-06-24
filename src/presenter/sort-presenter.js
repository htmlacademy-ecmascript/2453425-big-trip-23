import SortView from '../view/sort-view.js';
import { filter } from '../util.js';
import { SortItem, SortType, UpdateType } from '../const.js';
import {
  remove,
  render,
  RenderPosition,
  replace,
} from '../framework/render.js';

export default class SortPresenter {
  #sortContainer = null;

  #sortModel = null;
  #filterModel = null;
  #waypointsModel = null;

  #sortComponent = null;

  #isLoading = true;

  constructor({ sortContainer, sortModel, filterModel, waypointsModel }) {
    this.#sortContainer = sortContainer;
    this.#sortModel = sortModel;
    this.#filterModel = filterModel;
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
    if (this.#isLoading) {
      return;
    }

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

  remove() {
    if (this.#sortComponent) {
      remove(this.#sortComponent);
      this.#sortComponent = null;
    }
  }

  #handleSortChange = (sortType) => {
    if (this.#sortModel.sort === sortType) {
      return;
    }

    this.#sortModel.setSort(UpdateType.MINOR, sortType);
  };

  #handleModelEvent = (updateType) => {
    const waypoints = this.#waypointsModel.waypoints;
    const filteredWaypoints = filter[this.#filterModel.filter](waypoints);
    const filteredWaypointsLength = filteredWaypoints.length;

    if (filteredWaypointsLength === 0) {
      this.remove();
      return;
    }

    if (updateType === UpdateType.INIT) {
      this.#isLoading = false;
    }

    this.init();
  };
}
