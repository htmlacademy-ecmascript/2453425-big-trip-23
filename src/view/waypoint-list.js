import AbstractView from './abstract.js';

const createWaypointListTemplate = () => '<ul class="trip-events__list"></ul>';

export default class WaypointListView extends AbstractView {
  get template() {
    return createWaypointListTemplate();
  }
}
