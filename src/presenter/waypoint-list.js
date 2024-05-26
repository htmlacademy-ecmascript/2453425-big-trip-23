import WaypointPresenter from './waypoint.js';
import LoadingView from '../view/loading.js';
import WaypointListView from '../view/waypoint-list.js';
import NoWaypointView from '../view/no-waypoint.js';
import { render } from '../render.js';

export default class WaypointListPresenter {
  #waypointListContainer = null;

  #waypointListComponent = new WaypointListView();
  #loadingComponent = new LoadingView();
  #noWaypointComponent = new NoWaypointView();

  #waypointsModel = null;

  #isLoading = false;

  constructor(waypointListContainer, waypointsModel) {
    this.#waypointListContainer = waypointListContainer;
    this.#waypointsModel = waypointsModel;
  }

  get waypoints() {
    return this.#waypointsModel.waypoints;
  }

  init() {
    this.#renderWaypointList();
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#waypointListContainer);
  }

  #renderWaypoint(waypoint) {
    const destination = this.#waypointsModel.getDestinationById(
      waypoint.destination
    );
    const offers = this.#waypointsModel.getOffersByType(waypoint.type);
    const eventTypes = this.#waypointsModel.getOffersTypes();
    const destinations = this.#waypointsModel.getDestinationsNames();

    const waypointPresenter = new WaypointPresenter(
      this.#waypointListComponent.element
    );
    waypointPresenter.init(
      waypoint,
      destination,
      offers,
      eventTypes,
      destinations
    );
  }

  #renderWaypoints(waypoints) {
    waypoints.forEach((waypoint) => this.#renderWaypoint(waypoint));
  }

  #renderNoWaypoints() {
    render(this.#noWaypointComponent, this.#waypointListContainer);
  }

  #renderWaypointList() {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const waypoints = this.waypoints;
    const waypointsLength = waypoints.length;

    if (waypointsLength === 0) {
      this.#renderNoWaypoints();
      return;
    }
    render(this.#waypointListComponent, this.#waypointListContainer);
    this.#renderWaypoints(this.waypoints);
  }
}
