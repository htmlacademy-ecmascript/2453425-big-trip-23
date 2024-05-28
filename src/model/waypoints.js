import { getWaypoints } from '../mock/waypoint.js';
import { getMockOffers } from '../mock/offer.js';
import { getMockDestinations } from '../mock/destionation.js';

export default class WaypointsModel {
  #waypoints = [];
  #offers = [];
  #destinations = [];

  get waypoints() {
    return this.#waypoints;
  }

  init() {
    const waypoints = getWaypoints();
    const offers = getMockOffers();
    const destinations = getMockDestinations();

    this.#offers = offers;
    this.#destinations = destinations;
    this.#waypoints = waypoints.map(this.#adaptToClient);
  }

  getOffersByType(type) {
    const requiredOffer = this.#offers.find((item) => item.type === type);
    return requiredOffer.offers;
  }

  getOffersTypes() {
    return this.#offers.map((offer) => offer.type);
  }

  getDestinationsNames() {
    return this.#destinations.map((destination) => destination.name);
  }

  getDestinationById(id) {
    return this.#destinations.find((item) => item.id === id);
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
