import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class WaypointsModel extends Observable {
  #waypointsApiService = null;
  #waypoints = [];
  #offers = [];
  #destinations = [];
  #failedToLoad = false;

  constructor({waypointApiService}) {
    super();
    this.#waypointsApiService = waypointApiService;
  }

  get waypoints() {
    return this.#waypoints;
  }

  get offers() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
  }

  get failedToLoad() {
    return this.#failedToLoad;
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

  async init() {
    try {
      const waypoints = await this.#waypointsApiService.waypoints;
      this.#waypoints = waypoints.map(this.#adaptToClient);
      this.#offers = await this.#waypointsApiService.offers;
      this.#destinations = await this.#waypointsApiService.destinations;
    } catch(error) {
      this.#waypoints = [];
      this.#offers = [];
      this.#destinations = [];
      this.#failedToLoad = true;
    }
    this._notify(UpdateType.INIT);
  }

  async updateWaypoint(updateType, update) {
    const index = this.#waypoints.findIndex(
      (waypoint) => waypoint.id === update.id
    );

    if (index === -1) {
      throw new Error('Can not update unexisting waypoint');
    }

    try {
      const response = await this.#waypointsApiService.updateWaypoint(update);
      const updatedWaypoint = this.#adaptToClient(response);

      this.#waypoints = [
        ...this.#waypoints.slice(0, index),
        updatedWaypoint,
        ...this.#waypoints.slice(index + 1),
      ];

      this._notify(updateType, updatedWaypoint);
    } catch(error) {
      throw new Error('Con not update waypoint');
    }
  }

  async addWaypoint(updateType, update) {
    try {
      const response = await this.#waypointsApiService.addWaypoint(update);
      const newWaypoint = this.#adaptToClient(response);

      this.#waypoints = [newWaypoint, ...this.#waypoints];

      this._notify(updateType, newWaypoint);
    } catch(error) {
      throw new Error('Can not add waypoint');
    }
  }

  async deleteWaypoint(updateType, update) {
    const index = this.#waypoints.findIndex(
      (waypoint) => waypoint.id === update.id
    );

    if (index === -1) {
      throw new Error('Can not delete unexisting waypoint');
    }

    try {
      await this.#waypointsApiService.deleteWaypoint(update);

      this.#waypoints = [
        ...this.#waypoints.slice(0, index),
        ...this.#waypoints.slice(index + 1),
      ];

      this._notify(updateType, update);
    } catch(error) {
      throw new Error('Can not delete waypoint');
    }
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
