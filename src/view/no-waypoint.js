import AbstractView from './abstract.js';
import { FilterType } from '../const.js';

const NoWaypointTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now',
};

const createNoWaypointTemplate = (filterType = 'EVERYTHING') => {
  const noWaypointTextValue = NoWaypointTextType[filterType];
  return `<p class="trip-events__msg">${noWaypointTextValue}</p>`;
};

export default class Loading extends AbstractView {
  get template() {
    return createNoWaypointTemplate();
  }
}
