import FilterView from '../view/filter.js';
import { remove, render, replace } from '../render.js';
import { FilterType } from '../const.js';
import { filter } from '../util.js';

export default class FilterPresenter {
  #filterContainer = null;

  #filterModel = null;
  #waypointsModel = null;

  #filterComponent = null;

  constructor(filterContainer, filterModel, waypointsModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#waypointsModel = waypointsModel;
  }

  get filters() {
    const waypoints = this.#waypointsModel.waypoints;

    return Object.values(FilterType).map((type) => ({
      type,
      count: filter[type](waypoints).length,
    }));
  }

  init() {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView(filters, this.#filterModel.filter);

    if (!prevFilterComponent) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }
}
