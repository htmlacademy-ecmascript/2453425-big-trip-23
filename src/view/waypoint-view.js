import AbstractView from '../framework/view/abstract-view.js';
import { getDuration } from '../util.js';
import he from 'he';
import dayjs from 'dayjs';

const createOffersListItemTemplate = ({ title, price }) =>
  `<li class="event__offer">
    <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
    <span class="event__offer-price">${price}</span>
  </li>`;

const createOffersListTemplate = (offers) => {
  if (!offers.length) {
    return '';
  }

  const offersListItemsTemplate = offers.reduce(
    (template, offer) => `${template} ${createOffersListItemTemplate(offer)}`,
    ''
  );

  return `<ul class="event__selected-offers">
      ${offersListItemsTemplate}
    </ul>`;
};

const createWaypointTemplate = (waypoint, offers, destinations) => {
  const date = dayjs(waypoint.dateFrom).format('YYYY-MM-DD');
  const startDateTime = dayjs(waypoint.dateFrom).format('YYYY-MM-DDTHH:mm');
  const endDateTime = dayjs(waypoint.dateTo).format('YYYY-MM-DDTHH:mm');
  const startTime = dayjs(waypoint.dateFrom).format('HH:mm');
  const endTime = dayjs(waypoint.dateTo).format('HH:mm');
  const day = dayjs(waypoint.dateFrom).format('MMM DD');
  const eventDurationInMilliseconds = dayjs(waypoint.dateTo).diff(
    dayjs(waypoint.dateFrom)
  );
  const humanizeEventDuration = getDuration(eventDurationInMilliseconds);

  const isFavorite = waypoint.isFavorite;
  const favoriteClassName = isFavorite ? 'event__favorite-btn--active' : '';
  const price = he.encode(String(waypoint.basePrice));
  const type = waypoint.type;
  const waypointDestination = destinations.find(
    (destination) => destination.id === waypoint.destination
  );
  const destinationName = waypointDestination.name;
  const waypointOffers = offers.find(
    (offer) => offer.type === waypoint.type
  ).offers;
  const selectedOffers = waypointOffers.filter((offer) =>
    waypoint.offers.includes(offer.id)
  );

  return `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${date}">${day}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${destinationName}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${startDateTime}">${startTime}</time>
            &mdash;
            <time class="event__end-time" datetime="${endDateTime}">${endTime}</time>
          </p>
          <p class="event__duration">${humanizeEventDuration}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        ${createOffersListTemplate(selectedOffers)}
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
    </li>`;
};

export default class WaypointView extends AbstractView {
  #waypoint = null;
  #offers = null;
  #destinations = null;
  #handleRollupClick = null;
  #handleFavoriteClick = null;

  constructor({
    waypoint,
    offers,
    destinations,
    onRollupClick,
    onFavoriteClick,
  }) {
    super();
    this.#waypoint = waypoint;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleRollupClick = onRollupClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#rollupClickHandler);
    this.element
      .querySelector('.event__favorite-btn')
      .addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createWaypointTemplate(
      this.#waypoint,
      this.#offers,
      this.#destinations
    );
  }

  #rollupClickHandler = (event) => {
    event.preventDefault();
    this.#handleRollupClick();
  };

  #favoriteClickHandler = (event) => {
    event.preventDefault();
    this.#handleFavoriteClick();
  };
}
