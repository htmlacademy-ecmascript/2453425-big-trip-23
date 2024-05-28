import TripInfoView from '../view/trip-info.js';
import { remove, render, RenderPosition, replace } from '../render.js';

export default class TripInfoPresenter {
  #waypointsModel = null;

  #tripInfoComponent = null;
  #tripInfoContainer = null;

  constructor(tripInfoContainer, waypointsModel) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#waypointsModel = waypointsModel;
  }

  init() {
    const waypoints = this.#waypointsModel.waypoints;

    const destinations = waypoints.map(
      (waypoint) =>
        this.#waypointsModel.getDestinationById(waypoint.destination).name
    );

    const dates = waypoints.map((waypoint) => [
      waypoint.dateFrom,
      waypoint.dateTo,
    ]);

    const cost = waypoints.reduce((resultCost, waypoint) => {
      const offers = this.#waypointsModel.getOffersByType(waypoint.type);
      const selectedOffers = offers.filter((offer) =>
        waypoint.offers.includes(offer.id)
      );

      const basePrice = waypoint.basePrice;
      const offersPrise = selectedOffers.reduce(
        (result, offer) => result + offer.price,
        0
      );
      const totalPrice = basePrice + offersPrise;

      return resultCost + totalPrice;
    }, 0);

    const prevTripInfoComponent = this.#tripInfoComponent;

    this.#tripInfoComponent = new TripInfoView(destinations, dates, cost);

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
}
