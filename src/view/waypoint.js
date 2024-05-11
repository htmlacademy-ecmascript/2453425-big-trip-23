import AbstractView from './abstract.js';
import { getDuration } from '../util.js';

// const data = {
//   id: 'f4b62099-293f-4c3d-a702-94eec4a2808c',
//   basePrice: 1100,
//   dateFrom: '2019-07-10T22:55:56.845Z',
//   dateTo: '2019-07-11T11:22:13.375Z',
//   destination: 'bfa5cb75-a1fe-4b77-a83c-0e528e910e04',
//   isFavorite: true,
//   offers: [
//     'b4c3e4e6-9053-42ce-b747-e281314baa31'
//   ],
//   type: 'taxi'
// };

const createWaypointTemplate = (waypointData) => {
  const eventDate = new Date(waypointData.dateFrom);
  const eventEndDate = new Date(waypointData.dateTo);
  const dateFrom = waypointData.dateFrom;
  const dateTo = waypointData.dateTo;
  const date = dateFrom.slice(0, 10);
  const startDateTime = dateFrom.slice(0, 16);
  const endDateTime = dateTo.slice(0, 16);
  const startTime = dateFrom.slice(11, 16);
  const endTime = dateTo.slice(11, 16);
  const duration = getDuration(eventDate, eventEndDate);
  const day = eventDate
    .toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    .split(',')[0];
  const isFavorite = waypointData.isFavorite;
  const favoriteClassName = isFavorite ? 'event__favorite-btn--active' : '';
  const price = waypointData.basePrice;
  const type = waypointData.type;
  const destination = 'Amsterdam';

  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${date}">${day}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${destination}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${startDateTime}">${startTime}</time>
            &mdash;
            <time class="event__end-time" datetime="${endDateTime}">${endTime}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          <li class="event__offer">
            <span class="event__offer-title">Order Uber</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">20</span>
          </li>
        </ul>
        <button class="event__favorite-btn ${favoriteClassName}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class WaypointView extends AbstractView {
  constructor(waypointData) {
    super();
    this.waypointData = waypointData;
  }

  get template() {
    return createWaypointTemplate(this.waypointData);
  }
}
