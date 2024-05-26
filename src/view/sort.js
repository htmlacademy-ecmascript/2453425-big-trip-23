import AbstractView from './abstract.js';

const createSortItemTemplate = (sortTypes, sortItem, currentSort) =>
  `<div class="trip-sort__item  trip-sort__item--${sortItem}">
    <input
    id="sort-${sortItem}"
    class="trip-sort__input visually-hidden"
    type="radio"
    name="trip-sort"
    value="sort-${sortItem}"
    ${sortItem === currentSort ? 'checked' : ''}
    ${!sortTypes.includes(sortItem) ? 'disabled' : ''}
  >
    <label class="trip-sort__btn" for="sort-${sortItem}">${sortItem}</label>
  </div>`;

const createSortTemplate = (sortTypes, sortItems, currentSort) => {
  const sortItemsTemplate = sortItems.reduce(
    (template, sortItem) =>
      `${template} ${createSortItemTemplate(sortTypes, sortItem, currentSort)}`,
    ''
  );

  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${sortItemsTemplate}
    </form>`;
};

export default class SortView extends AbstractView {
  #sortTypes = null;
  #currentSort = null;
  #sortItems = null;

  constructor(sortTypes, sortItems, currentSort) {
    super();
    this.#sortTypes = sortTypes;
    this.#sortItems = sortItems;
    this.#currentSort = currentSort;
  }

  get template() {
    return createSortTemplate(
      this.#sortTypes,
      this.#sortItems,
      this.#currentSort
    );
  }
}
