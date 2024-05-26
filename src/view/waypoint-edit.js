import AbstractView from './abstract.js';

const BLANK_WAYPOINT = {
  id: 'f4b62099-293f-4c3d-a702-94eec4a2808c_A',
  'base_price': 0,
  'date_from': '',
  'date_to': '',
  destination: '',
  'is_favorite': false,
  offers: [],
  type: 'flight'
};

const createEventTypeItemTemplate = (eventType) =>
  `<div class="event__type-item">
    <input id="event-type-${eventType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType}">
    <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-1">${eventType}</label>
  </div>`;

const createEventTypeItemsTemplate = (eventTypes) => eventTypes
  .reduce((template, eventType) =>
    `${template} ${createEventTypeItemTemplate(eventType)}`, '');

const createDestinationListItemTemplate = (destinations) => destinations
  .reduce((template, destination) =>
    `${template} <option value="${destination}"></option>`, '');

const createDestinationList = (destinations) =>
  `<datalist id="destination-list-1">
    ${createDestinationListItemTemplate(destinations)}
  </datalist>`;

const createOfferTemplate = (waypoint, offer) => {
  const offersChecked = waypoint.offers.includes(offer.id) ? 'checked' : '';
  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="${offer.id}" type="checkbox" name="${offer.id}" ${offersChecked}>
      <label class="event__offer-label" for="${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`
  );
};

const createOffersTemplate = (waypoint, offers) => {
  if (!offers.length) {
    return '';
  }

  const offersTemplate = offers.reduce((template, offer) => template + createOfferTemplate(waypoint, offer), '');
  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${offersTemplate}
      </div>
    </section>`
  );
};

const createDestinationPhotoTemplate = (photo) =>
  `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`;

const createDestinationPhotosTemplate = (pictures) => {
  if (!pictures.length) {
    return '';
  }
  const photos = pictures.reduce((template, photo) => `${template} ${createDestinationPhotoTemplate(photo)}`, '');
  return (
    `<div class="event__photos-container">
      <div class="event__photos-tape">
        ${photos}
      </div>
    </div>`
  );
};

const createDestinationDescriptionTemplate = (description) => {
  if (!description) {
    return '';
  }

  return `<p class="event__destination-description">${description}</p>`;
};

const createDestinationContainerTemplate = (destination) => {
  if (!destination || (!destination.pictures.length && !destination.description)) {
    return '';
  }

  return (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      ${createDestinationDescriptionTemplate(destination.description)}
      ${createDestinationPhotosTemplate(destination.pictures)}
    </section>`
  );
};

const createWaypointEditTemplate = (waypoint, destination, offers, eventTypes, destinations) => {
  const startDate = waypoint.dateFrom.toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  }).split(',').join('');
  const endDate = waypoint.dateTo.toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  }).split(',').join('');
  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${waypoint.type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>

                ${createEventTypeItemsTemplate(eventTypes)}

              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${waypoint.type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
            ${createDestinationList(destinations)}
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startDate}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endDate}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${waypoint.basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${createOffersTemplate(waypoint, offers)}

          ${createDestinationContainerTemplate(destination)}
        </section>
      </form>
    </li>`
  );
};

export default class WaypointEditView extends AbstractView {
  constructor(waypoint = BLANK_WAYPOINT, destination, offers, eventTypes, destinations) {
    super();
    this.waypoint = waypoint;
    this.destination = destination;
    this.offers = offers;
    this.eventTypes = eventTypes;
    this.destinations = destinations;
  }

  get template() {
    return createWaypointEditTemplate(this.waypoint, this.destination, this.offers, this.eventTypes, this.destinations);
  }
}


