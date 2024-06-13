import TripInfoView from '../view/trip-info.js';
import { remove, render, RenderPosition, replace } from '../render/render.js';
import { sort } from '../util.js';
import { SortType } from '../const.js';

export default class TripInfoPresenter {
  #waypointsModel = null;

  #tripInfoComponent = null;
  #tripInfoContainer = null;

  constructor({ tripInfoContainer, waypointsModel }) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#waypointsModel = waypointsModel;

    this.#waypointsModel.addObserver(this.#handleModelEvent);
  }

  init() {
    const waypoints = this.#waypointsModel.waypoints;
    const sortedWaypoints = waypoints.sort(sort[SortType.DAY]);

    const reducedWaypoints = sortedWaypoints.map((waypoint) => {
      const destinationName = this.#waypointsModel.getDestinationById(
        waypoint.destination
      ).name;
      const selectedOffersPrice = this.#waypointsModel
        .getOffersByType(waypoint.type)
        .filter((offer) => waypoint.offers.includes(offer.id))
        .reduce((totalPrice, offer) => totalPrice + offer.price, 0);

      return {
        dateFrom: waypoint.dateFrom,
        dateTo: waypoint.dateTo,
        destination: destinationName,
        price: waypoint.basePrice + selectedOffersPrice,
      };
    });

    const prevTripInfoComponent = this.#tripInfoComponent;

    this.#tripInfoComponent = new TripInfoView(reducedWaypoints);

    if (!prevTripInfoComponent) {
      render(
        this.#tripInfoComponent,
        this.#tripInfoContainer,
        RenderPosition.AFTERBEGIN
      );
      return;
    }

    replace(this.#tripInfoComponent, prevTripInfoComponent);
    remove(prevTripInfoComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };
}