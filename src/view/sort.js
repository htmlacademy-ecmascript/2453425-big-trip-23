import AbstractView from '../framework/view/abstract-view.js';

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
  #handleSortChange = null;

  constructor({ sortTypes, sortItems, currentSort, onSortChange }) {
    super();
    this.#sortTypes = sortTypes;
    this.#sortItems = sortItems;
    this.#currentSort = currentSort;
    this.#handleSortChange = onSortChange;

    this.element.addEventListener('change', this.#sortChangeHandler);
  }

  get template() {
    return createSortTemplate(
      this.#sortTypes,
      this.#sortItems,
      this.#currentSort
    );
  }

  #sortChangeHandler = (event) => {
    event.preventDefault();
    const sortType = event.target.value.split('-')[1];
    this.#handleSortChange(sortType);
  };
}
