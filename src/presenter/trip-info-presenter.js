import TripInfoView from '../view/trip-info-view.js';
import { sort } from '../util.js';
import { SortType } from '../const.js';
import {
  remove,
  render,
  RenderPosition,
  replace,
} from '../framework/render.js';

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
    const isFailedToLoadWaypoints = this.#waypointsModel.isFailedToLoad;
    const waypoints = this.#waypointsModel.waypoints;
    const isNoWaypoints = waypoints.length === 0;

    if (isFailedToLoadWaypoints || isNoWaypoints === 0) {
      return;
    }

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
