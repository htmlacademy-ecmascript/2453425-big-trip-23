import Observable from '../framework/observable.js';
import { getWaypoints } from '../mock/waypoint.js';
import { getMockOffers } from '../mock/offer.js';
import { getMockDestinations } from '../mock/destionation.js';
import { UpdateType } from '../const.js';

export default class WaypointsModel extends Observable {
  #waypoints = [];
  #offers = [];
  #destinations = [];

  get waypoints() {
    return this.#waypoints;
  }

  get offers() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
  }

  getOffersByType(type) {
    const requiredOffer = this.#offers.find((offer) => offer.type === type);
    return [...requiredOffer.offers];
  }

  getDestinationById(id) {
    const requiredDestination = this.#destinations.find(
      (item) => item.id === id
    );
    return { ...requiredDestination };
  }

  init() {
    const waypoints = getWaypoints();
    const offers = getMockOffers();
    const destinations = getMockDestinations();

    this.#offers = offers;
    this.#destinations = destinations;
    this.#waypoints = waypoints.map(this.#adaptToClient);

    this._notify(UpdateType.INIT);
  }

  updateWaypoint(updateType, update) {
    const index = this.#waypoints.findIndex(
      (waypoint) => waypoint.id === update.id
    );

    if (index === -1) {
      throw new Error('Can not update unexisting waypoint');
    }

    this.#waypoints = [
      ...this.#waypoints.slice(0, index),
      update,
      ...this.#waypoints.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addWaypoint(updateType, update) {
    update.id = +new Date();
    this.#waypoints = [...this.#waypoints, update];
    this._notify(updateType, update);
  }

  deleteWaypoint(updateType, update) {
    const index = this.#waypoints.findIndex(
      (waypoint) => waypoint.id === update.id
    );

    if (index === -1) {
      throw new Error('Can not update unexisting waypoint');
    }

    this.#waypoints = [
      ...this.#waypoints.slice(0, index),
      ...this.#waypoints.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  #adaptToClient = (waypoint) => {
    const adaptedWaypoint = {
      ...waypoint,
      basePrice: waypoint['base_price'],
      dateFrom: new Date(waypoint['date_from']),
      dateTo: new Date(waypoint['date_to']),
      isFavorite: waypoint['is_favorite'],
    };

    delete adaptedWaypoint['base_price'];
    delete adaptedWaypoint['date_from'];
    delete adaptedWaypoint['date_to'];
    delete adaptedWaypoint['is_favorite'];

    return adaptedWaypoint;
  };
}
