import { FilterType } from '../const.js';

export default class FilterModel {
  #filter = FilterType.EVERYTHING;

  get filter() {
    return this.#filter;
  }
}
