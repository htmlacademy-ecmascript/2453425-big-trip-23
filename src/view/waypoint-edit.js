import AbstractStatefulView from '../render/view/abstract-stateful.js';

const BLANK_WAYPOINT = {
  basePrice: 0,
  dateFrom: '',
  dateTo: '',
  destination: '',
  isFavorite: false,
  offers: [],
  type: 'flight',
};

const createEventTypeItemTemplate = (eventType) =>
  `<div class="event__type-item">
    <input id="event-type-${eventType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType}">
    <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-1">${eventType}</label>
  </div>`;

const createEventTypeItemsTemplate = (eventTypes) =>
  eventTypes.reduce(
    (template, eventType) =>
      `${template} ${createEventTypeItemTemplate(eventType)}`,
    ''
  );

const createDestinationListItemTemplate = (destinations) =>
  destinations.reduce(
    (template, destination) =>
      `${template} <option value="${destination}"></option>`,
    ''
  );

const createDestinationList = (destinations) =>
  `<datalist id="destination-list-1">
    ${createDestinationListItemTemplate(destinations)}
  </datalist>`;

const createOfferTemplate = (waypoint, offer) => {
  const offersChecked = waypoint.offers.includes(offer.id) ? 'checked' : '';
  return `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="${offer.id}" type="checkbox" name="${offer.id}" ${offersChecked}>
      <label class="event__offer-label" for="${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`;
};

const createOffersTemplate = (waypoint, offers) => {
  if (!offers.length) {
    return '';
  }

  const offersTemplate = offers.reduce(
    (template, offer) => template + createOfferTemplate(waypoint, offer),
    ''
  );
  return `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${offersTemplate}
      </div>
    </section>`;
};

const createDestinationPhotoTemplate = (photo) =>
  `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`;

const createDestinationPhotosTemplate = (pictures) => {
  if (!pictures.length) {
    return '';
  }
  const photos = pictures.reduce(
    (template, photo) => `${template} ${createDestinationPhotoTemplate(photo)}`,
    ''
  );
  return `<div class="event__photos-container">
      <div class="event__photos-tape">
        ${photos}
      </div>
    </div>`;
};

const createDestinationDescriptionTemplate = (description) => {
  if (!description) {
    return '';
  }

  return `<p class="event__destination-description">${description}</p>`;
};

const createDestinationContainerTemplate = (destination) => {
  if (
    !destination ||
    (!destination.pictures.length && !destination.description)
  ) {
    return '';
  }

  return `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      ${createDestinationDescriptionTemplate(destination.description)}
      ${createDestinationPhotosTemplate(destination.pictures)}
    </section>`;
};

const createRollupButton = (waypoint) => {
  if (!waypoint.id) {
    return '';
  }
  return `<button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>`;
};

const createWaypointEditTemplate = (waypoint, offers, destinations) => {
  const eventTypes = offers.map((offer) => offer.type);
  const waypointDestination = destinations.filter(
    (dest) => dest.id === waypoint.destination
  )[0];

  const destinationsNames = destinations.map((dest) => dest.name);
  const waypointOffers = offers.filter(
    (offer) => offer.type === waypoint.type
  )[0].offers;

  const startDate = waypoint.dateFrom
    .toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    })
    .split(',')
    .join('');
  const endDate = waypoint.dateTo
    .toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    })
    .split(',')
    .join('');
  return `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img
              class="event__type-icon"
              width="17"
              height="17"
              src="img/icons/${waypoint.type}.png" alt="Event type icon"
              >
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
            <input
            class="event__input
            event__input--destination"
            id="event-destination-1"
            type="text"
            name="event-destination"
            value="${waypointDestination?.name || ''}" list="destination-list-1"
            >
            ${createDestinationList(destinationsNames)}
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
            <input
            class="event__input
            event__input--price"
            id="event-price-1"
            type="text"
            name="event-price"
            value="${waypoint.basePrice}"
            >
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          ${createRollupButton(waypoint)}

        </header>
        <section class="event__details">
          ${createOffersTemplate(waypoint, waypointOffers)}

          ${createDestinationContainerTemplate(waypointDestination)}
        </section>
      </form>
    </li>`;
};

export default class WaypointEditView extends AbstractStatefulView {
  #handleRollupClick = null;
  #handleFormSubmit = null;
  #handleDeleteClick = null;

  constructor({
    waypoint = BLANK_WAYPOINT,
    offers,
    destinations,
    onRollupClick,
    onFormSubmit,
    onFormDeleteClick,
  }) {
    super();
    this._setState(WaypointEditView.parseWaypointToState(waypoint));
    this.waypoint = waypoint;
    this.offers = offers;
    this.destinations = destinations;
    this.#handleRollupClick = onRollupClick;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleDeleteClick = onFormDeleteClick;

    this._restoreHandlers();
  }

  get template() {
    return createWaypointEditTemplate(
      this._state,
      this.offers,
      this.destinations
    );
  }

  reset(waypoint) {
    this.updateElement(WaypointEditView.parseWaypointToState(waypoint));
  }

  _restoreHandlers() {
    this.element
      .querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);
    this.element
      .querySelector('.event__reset-btn')
      .addEventListener('click', this.#formDeleteClickHandler);
    this.element
      .querySelector('.event__type-group')
      .addEventListener('change', this.#eventTypeChangeHandler);
    this.element
      .querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);
    this.element
      .querySelector('.event--edit')
      .addEventListener('change', this.#offersChangeHandler);
    this.element
      .querySelector('.event__input--price')
      .addEventListener('input', this.#priceInputHandler);
    this.element
      .querySelector('#event-start-time-1')
      .addEventListener('input', this.#dateChangeHandler);
    this.element
      .querySelector('#event-end-time-1')
      .addEventListener('input', this.#dateChangeHandler);

    if (this.#handleRollupClick) {
      this.element
        .querySelector('.event__rollup-btn')
        .addEventListener('click', this.#rollupClickHandler);
    }
  }

  #rollupClickHandler = (event) => {
    event.preventDefault();
    this.#handleRollupClick();
  };

  #eventTypeChangeHandler = (event) => {
    event.preventDefault();
    this.updateElement({
      type: event.target.value,
      offers: [],
    });
  };

  #destinationChangeHandler = (event) => {
    event.preventDefault();
    const destinationName = event.target.value;
    const destinationId = this.destinations.filter(
      (destination) => destination.name === destinationName
    )[0].id;
    this.updateElement({
      destination: destinationId,
    });
  };

  #offersChangeHandler = (event) => {
    if (event.target.classList.contains('event__offer-checkbox')) {
      event.preventDefault();

      const checkedOffers = [
        ...this.element.querySelectorAll('.event__offer-checkbox'),
      ]
        .filter((offer) => offer.checked)
        .map((offer) => offer.id);

      this.updateElement({ offers: checkedOffers });
    }
  };

  #priceInputHandler = (event) => {
    event.preventDefault();
    this._setState({ basePrice: +event.target.value });
  };

  #dateChangeHandler = (event) => {
    if (event.target.id === 'event-start-time-1') {
      this._setState({ dateFrom: new Date(event.target.value) });
    }
    if (event.target.id === 'event-end-time-1') {
      this._setState({ dateTo: new Date(event.target.value) });
    }
  };

  #formSubmitHandler = (event) => {
    event.preventDefault();

    this.#handleFormSubmit(WaypointEditView.parseStateToWaypoint(this._state));
  };

  #formDeleteClickHandler = (event) => {
    event.preventDefault();
    this.#handleDeleteClick(WaypointEditView.parseStateToWaypoint(this._state));
  };

  static parseWaypointToState(waypoint) {
    const state = { ...waypoint };

    state.isSaving = false;
    state.isDisabled = false;
    state.isDeleting = false;

    return state;
  }

  static parseStateToWaypoint(state) {
    const waypoint = { ...state };

    delete waypoint.isSaving;
    delete waypoint.isDisabled;
    delete waypoint.isDeleting;

    return waypoint;
  }
}
