import { SortType } from '../const.js';

export default class SortModel {
  #sort = SortType.DAY;

  get sort() {
    return this.#sort;
  }
}
