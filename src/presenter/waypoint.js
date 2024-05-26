import { remove, render, replace } from '../render.js';
import WaypointEditView from '../view/waypoint-edit.js';
import WaypointView from '../view/waypoint.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class WaypointPresenter {
  #waypointListContainer = null;

  #waypointComponent = null;
  #waypointEditComponent = null;

  #waypoint = null;
  #destination = null;
  #offers = null;
  #eventTypes = null;
  #destinations = null;
  #mode = Mode.DEFAULT;

  constructor(waypointListContainer) {
    this.#waypointListContainer = waypointListContainer;
  }

  init(waypoint, destination, offers, eventTypes, destinations) {
    this.#waypoint = waypoint;
    this.#destination = destination;
    this.#offers = offers;
    this.#eventTypes = eventTypes;
    this.#destinations = destinations;

    const prevWaypointComponent = this.#waypointComponent;
    const prevWaypointEditComponent = this.#waypointEditComponent;

    this.#waypointComponent = new WaypointView(
      this.#waypoint,
      this.#destination,
      this.#offers
    );
    this.#waypointEditComponent = new WaypointEditView(
      this.#waypoint,
      this.#destination,
      this.#offers,
      this.#eventTypes,
      this.#destinations
    );

    if (prevWaypointComponent === null && prevWaypointEditComponent === null) {
      render(this.#waypointComponent, this.#waypointListContainer);

      if (this.#waypoint.id === 'f4b62099-293f-4c3d-a702-94eec4a2808c_A') {
        this.#replaceCardToForm();
      }

      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#waypointComponent, prevWaypointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#waypointComponent, prevWaypointEditComponent);
      this.#mode = Mode.DEFAULT;
    }

    remove(prevWaypointComponent);
    remove(prevWaypointEditComponent);
  }

  #replaceCardToForm() {
    replace(this.#waypointEditComponent, this.#waypointComponent);
    this.#mode = Mode.EDITING;
  }

  #replaceFormToCard() {
    replace(this.#waypointComponent, this.#waypointEditComponent);
    this.#mode = Mode.DEFAULT;
  }
}
