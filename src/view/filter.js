import AbstractView from './abstract.js';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const { type, count } = filter;

  return `<div class="trip-filters__filter">
      <input id="filter-${type}"
      class="trip-filters__filter-input
      visually-hidden"
      type="radio"
      name="trip-filter"
      value="${type}"
      ${type === currentFilterType ? 'checked' : ''}
      ${count === 0 ? 'disabled' : ''}
    >
      <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
    </div>`;
};

const createFilterTemplate = (filters, currentFilterType) => {
  const filterItemsTemplate = filters.reduce(
    (template, filter) =>
      `${template} ${createFilterItemTemplate(filter, currentFilterType)}`,
    ''
  );

  return `<form class="trip-filters" action="#" method="get">
      ${filterItemsTemplate}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;
};

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilter = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilter);
  }
}
