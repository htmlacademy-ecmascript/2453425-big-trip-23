import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import he from 'he';
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const BLANK_WAYPOINT = {
  basePrice: 0,
  dateFrom: '',
  dateTo: '',
  destination: '',
  isFavorite: false,
  offers: [],
  type: 'flight',
};

const createEventTypeItemTemplate = (waypoint, eventType) => {
  const eventTypeName = eventType.replace(
    eventType[0],
    eventType[0].toUpperCase()
  );

  return `<div class="event__type-item">
      <input
      id="event-type-${eventType}-1"
      class="event__type-input
      visually-hidden"
      type="radio"
      name="event-type"
      value="${eventType}"
      ${waypoint.isDisabled ? 'disabled' : ''}
      ${waypoint.type === eventType ? 'checked' : ''}
      >
      <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-1">${eventTypeName}</label>
    </div>`;
};

const createEventTypeItemsTemplate = (waypoint, eventTypes) =>
  eventTypes.reduce(
    (template, eventType) =>
      `${template} ${createEventTypeItemTemplate(waypoint, eventType)}`,
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
      <input
      class="event__offer-checkbox
      visually-hidden"
      id="${offer.id}"
      type="checkbox"
      name="${offer.id}"
      ${offersChecked}
      ${waypoint.isDisabled ? 'disabled' : ''}>
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
  return `<button
    class="event__rollup-btn"
    type="button"
    >
      <span class="visually-hidden">Open event</span>
    </button>`;
};

const getFormCancelingText = (waypoint) => {
  if (!waypoint.id) {
    return 'Cancel';
  }

  if (waypoint.isDeleting) {
    return 'Deleting...';
  }

  return 'Delete';
};

const createEventDetailsTemplate = (waypoint, offers, destination) => {
  const offersTemplate = createOffersTemplate(waypoint, offers);
  const destinationTemplate = createDestinationContainerTemplate(destination);

  if (!offersTemplate && !destinationTemplate) {
    return '';
  }

  return `<section class="event__details">
      ${offersTemplate}
      ${destinationTemplate}
    </section>`;
};

const createWaypointEditTemplate = (waypoint, offers, destinations) => {
  const eventTypes = offers.map((offer) => offer.type);
  const waypointDestination = destinations.find(
    (dest) => dest.id === waypoint.destination
  );

  const destinationsNames = destinations.map((dest) => dest.name);
  const waypointOffers = offers.find(
    (offer) => offer.type === waypoint.type
  ).offers;

  const startDate = waypoint.dateFrom
    ? dayjs(waypoint.dateFrom).format('DD/MM/YY HH:mm')
    : '';
  const endDate = waypoint.dateTo
    ? dayjs(waypoint.dateTo).format('DD/MM/YY HH:mm')
    : '';

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

                ${createEventTypeItemsTemplate(waypoint, eventTypes)}

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
            ${waypoint.isDisabled ? 'disabled' : ''}
            value="${waypointDestination?.name || ''}" list="destination-list-1"
            >
            ${createDestinationList(destinationsNames)}
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input
            class="event__input
            event__input--time"
            id="event-start-time-1"
            type="text"
            name="event-start-time"
            ${waypoint.isDisabled ? 'disabled' : ''}
            value="${startDate}"
            >
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input
            class="event__input
            event__input--time"
            id="event-end-time-1"
            type="text"
            name="event-end-time"
            ${waypoint.isDisabled ? 'disabled' : ''}
            value="${endDate}"
            >
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
            ${waypoint.isDisabled ? 'disabled' : ''}
            value="${he.encode(String(waypoint.basePrice))}"
            >
          </div>

          <button
          class="event__save-btn  btn  btn--blue"
          type="submit"
          >${waypoint.isSaving ? 'Saving...' : 'Save'}
          </button>
          <button
          class="event__reset-btn"
          type="reset"
          >${getFormCancelingText(waypoint)}
          </button>

          ${createRollupButton(waypoint)}

        </header>
        ${createEventDetailsTemplate(waypoint, waypointOffers, waypointDestination)}
      </form>
    </li>`;
};

export default class WaypointEditView extends AbstractStatefulView {
  #handleRollupClick = null;
  #handleFormSubmit = null;
  #handleDeleteClick = null;
  #startDatepicker = null;
  #endDatepicker = null;

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

  get isExistingInDOM() {
    return Boolean(this.element.parentElement);
  }

  removeElement() {
    super.removeElement();

    if (this.#startDatepicker) {
      this.#startDatepicker.destroy();
      this.#startDatepicker = null;
    }
    if (this.#endDatepicker) {
      this.#endDatepicker.destroy();
      this.#endDatepicker = null;
    }
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

    if (this.#handleRollupClick) {
      this.element
        .querySelector('.event__rollup-btn')
        .addEventListener('click', this.#rollupClickHandler);
    }

    this.#setStartDatepicker();
    this.#setEndDatepicker();
  }

  #setStartDatepicker() {
    this.#startDatepicker = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        'time_24hr': true,
        onChange: this.#startDateChangeHandler,
      }
    );
  }

  #setEndDatepicker() {
    this.#endDatepicker = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        'time_24hr': true,
        minDate: this._state.dateFrom,
        onChange: this.#endDateChangeHandler,
      }
    );
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
    const enteredDestinationName = event.target.value;
    const selectedDestination = this.destinations.find(
      (destination) => destination.name === enteredDestinationName
    );

    if (selectedDestination) {
      this.updateElement({
        destination: selectedDestination.id,
      });
    }
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
    const enteredValue = event.target.value;
    const isNumber = !isNaN(Number(enteredValue));

    if (!isNumber) {
      event.target.value = this._state.basePrice;
      return;
    }

    this._setState({ basePrice: +event.target.value });
  };

  #startDateChangeHandler = ([date]) => {
    this.#endDatepicker.config.minDate = date;
    this._setState({
      dateFrom: date,
    });
  };

  #endDateChangeHandler = ([date]) => {
    this._setState({
      dateTo: date,
    });
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
