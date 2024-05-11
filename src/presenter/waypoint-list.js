// import WaypointSortView from '../view/sort.js';
import WaypointListView from '../view/waypoint-list.js';
import LoadingView from '../view/loading.js';
import NoWaypointView from '../view/no-waypoint.js';
import WaypointView from '../view/waypoint.js';
import {render} from '../render.js';

const data = [{
  id: 'f4b62099-293f-4c3d-a702-94eec4a2808c',
  basePrice: 1100,
  dateFrom: '2019-07-10T12:00:00.000Z',
  dateTo: '2019-07-10T13:00:00.000Z',
  destination: 'bfa5cb75-a1fe-4b77-a83c-0e528e910e04',
  isFavorite: false,
  offers: [
    'b4c3e4e6-9053-42ce-b747-e281314baa31'
  ],
  type: 'taxi'
}];

export default class WaypointListPresenter {
  #waypointListContainer = null;

  #waypointListComponent = new WaypointListView();
  #loadingComponent = new LoadingView();
  #noWaypointComponent = new NoWaypointView();

  #isLoading = false;
  #waypoints = [];

  constructor(waypointListContainer, waypoints = data) {
    this.#waypointListContainer = waypointListContainer;
    this.#waypoints = waypoints;
  }

  get waypoints () {
    return this.#waypoints;
  }

  init() {
    this.#renderWaypointList();
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#waypointListContainer);
  }

  #renderWaypoint(waypoint) {
    const waypointComponent = new WaypointView(waypoint);
    render(waypointComponent, this.#waypointListComponent.element);
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
