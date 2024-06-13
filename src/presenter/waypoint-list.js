import WaypointPresenter from './waypoint.js';
import newWaypointPresenter from './new-waypoint-presenter.js';
import LoadingView from '../view/loading.js';
import WaypointListView from '../view/waypoint-list.js';
import NoWaypointView from '../view/no-waypoint.js';
import { remove, render } from '../framework/render.js';
import { FilterType, SortType, UpdateType, UserAction } from '../const.js';
import { filter, sort } from '../util.js';

export default class WaypointListPresenter {
  #waypointListContainer = null;

  #waypointsModel = null;
  #filterModel = null;
  #sortModel = null;

  #newWaypointPresenter = null;

  #waypointListComponent = new WaypointListView();
  #loadingComponent = new LoadingView();
  #noWaypointComponent = new NoWaypointView();

  #filterType = FilterType.EVERYTHING;
  #sortType = SortType.DAY;
  #waypointPresenters = new Map();
  #isLoading = true;

  constructor({
    waypointListContainer,
    waypointsModel,
    filterModel,
    sortModel,
    onNewWaypointDestroy,
  }) {
    this.#waypointListContainer = waypointListContainer;
    this.#waypointsModel = waypointsModel;
    this.#filterModel = filterModel;
    this.#sortModel = sortModel;

    this.#newWaypointPresenter = new newWaypointPresenter({
      waypointListContainer: this.#waypointListContainer,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewWaypointDestroy,
    });

    this.#waypointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#sortModel.addObserver(this.#handleModelEvent);
  }

  get waypoints() {
    this.#filterType = this.#filterModel.filter;
    this.#sortType = this.#sortModel.sort;
    const waypoints = this.#waypointsModel.waypoints;
    const filteredWaypoints = filter[this.#filterType](waypoints);

    const sortedWaypoints = filteredWaypoints.sort(sort[this.#sortType]);
    return sortedWaypoints;
  }

  init() {
    this.#renderWaypointList();
  }

  createWaypoint() {
    const offers = this.#waypointsModel.offers;
    const destinations = this.#waypointsModel.destinations;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#sortModel.setSort(UpdateType.MAJOR, SortType.DAY);
    this.#newWaypointPresenter.init({ offers, destinations });
  }

  #handleModeChange = () => {
    this.#newWaypointPresenter.destroy();
    this.#waypointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.ADD_WAYPOINT:
        this.#waypointsModel.addWaypoint(updateType, update);
        break;
      case UserAction.DELETE_WAYPOINT:
        this.#waypointsModel.deleteWaypoint(updateType, update);
        break;
      case UserAction.UPDATE_WAYPOINT:
        this.#waypointPresenters.get(update.id).setSaving();
        this.#waypointsModel.updateWaypoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#waypointPresenters.get(data.id).init({ waypoint: data });
        break;
      case UpdateType.MINOR:
        this.#clearWaypointList();
        this.#renderWaypointList();
        break;
      case UpdateType.MAJOR:
        this.#clearWaypointList({ resetSortType: true });
        this.#renderWaypointList();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderWaypointList();
        break;
    }
  };

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

  #clearWaypointList({ resetSortType = false } = {}) {
    if (resetSortType) {
      this.#sortModel.setSort(UpdateType.MINOR, SortType.DAY);
    }

    this.#newWaypointPresenter.destroy();
    this.#waypointPresenters.forEach((presenter) => presenter.destroy());
    this.#waypointPresenters.clear();

    if (this.#loadingComponent) {
      remove(this.#loadingComponent);
    }

    if (this.#noWaypointComponent) {
      remove(this.#noWaypointComponent);
    }
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#waypointListContainer);
  }

  #renderNoWaypoints() {
    this.#noWaypointComponent.setFilterType(this.#filterType);
    render(this.#noWaypointComponent, this.#waypointListContainer);
  }

  #renderWaypoints(waypoints) {
    waypoints.forEach((waypoint) => this.#renderWaypoint(waypoint));
  }

  #renderWaypoint(waypoint) {
    const offers = this.#waypointsModel.offers;
    const destinations = this.#waypointsModel.destinations;

    const waypointPresenter = new WaypointPresenter({
      waypointListContainer: this.#waypointListComponent.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });
    waypointPresenter.init({ waypoint, offers, destinations });
    this.#waypointPresenters.set(waypoint.id, waypointPresenter);
  }
}
