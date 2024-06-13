import FilterView from '../view/filter.js';
import { remove, render, replace } from '../render/render.js';
import { FilterType, UpdateType } from '../const.js';
import { filter } from '../util.js';

export default class FilterPresenter {
  #filterContainer = null;

  #filterModel = null;
  #waypointsModel = null;

  #filterComponent = null;

  constructor({ filterContainer, filterModel, waypointsModel }) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#waypointsModel = waypointsModel;

    this.#waypointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const waypoints = this.#waypointsModel.waypoints;

    return Object.values(FilterType).map((type) => ({
      type,
      count: filter[type](waypoints).length,
    }));
  }

  init() {
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView({
      filters: this.filters,
      currentFilterType: this.#filterModel.filter,
      onFilterTypeChange: this.#handleFilterTypeChange,
    });

    if (!prevFilterComponent) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
