import WaypointPresenter from './waypoint.js';
import newWaypointPresenter from './new-waypoint-presenter.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import LoadingView from '../view/loading.js';
import WaypointListView from '../view/waypoint-list.js';
import NoWaypointView from '../view/no-waypoint.js';
import FailedToLoadView from '../view/failed-to-load.js';
import { remove, render } from '../framework/render.js';
import { filter, sort } from '../util.js';
import { FilterType, SortType, UpdateType, UserAction } from '../const.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class WaypointListPresenter {
  #waypointListContainer = null;

  #waypointsModel = null;
  #filterModel = null;
  #sortModel = null;

  #newWaypointPresenter = null;

  #waypointListComponent = new WaypointListView();
  #loadingComponent = new LoadingView();
  #noWaypointComponent = new NoWaypointView();
  #failedToLoadComponent = new FailedToLoadView();

  #filterType = FilterType.EVERYTHING;
  #sortType = SortType.DAY;
  #waypointPresenters = new Map();
  #isLoading = true;
  #newWaypointButton = null;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT,
  });

  constructor({
    waypointListContainer,
    waypointsModel,
    filterModel,
    sortModel,
    onNewWaypointDestroy,
    newWaypointButton,
  }) {
    this.#waypointListContainer = waypointListContainer;
    this.#waypointsModel = waypointsModel;
    this.#filterModel = filterModel;
    this.#sortModel = sortModel;
    this.onNewWaypointDestroy = onNewWaypointDestroy;
    this.#newWaypointButton = newWaypointButton;
    this.#newWaypointPresenter = new newWaypointPresenter({
      waypointListComponent: this.#waypointListComponent,
      newWaypointButton: this.#newWaypointButton,
      onDataChange: this.#handleViewAction,
      onDestroy: this.#handleNewWaypointDestroy,
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
    if (this.#noWaypointComponent) {
      remove(this.#noWaypointComponent);
      render(this.#waypointListComponent, this.#waypointListContainer);
    }
    this.#newWaypointPresenter.init({ offers, destinations });
  }

  #renderWaypointList() {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.#waypointsModel.isFailedToLoad) {
      render(this.#failedToLoadComponent, this.#waypointListContainer);
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

    if (this.#failedToLoadComponent) {
      remove(this.#failedToLoadComponent);
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

  #handleModeChange = () => {
    this.#newWaypointPresenter.destroy();
    this.#waypointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.ADD_WAYPOINT:
        this.#newWaypointPresenter.setSaving();
        try {
          await this.#waypointsModel.addWaypoint(updateType, update);
        } catch (error) {
          this.#newWaypointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_WAYPOINT:
        this.#waypointPresenters.get(update.id).setDeleting();
        try {
          await this.#waypointsModel.deleteWaypoint(updateType, update);
        } catch (error) {
          this.#waypointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.UPDATE_WAYPOINT:
        this.#waypointPresenters.get(update.id).setSaving();
        try {
          await this.#waypointsModel.updateWaypoint(updateType, update);
        } catch (error) {
          this.#waypointPresenters.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
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
        if (!this.#waypointsModel.isFailedToLoad) {
          this.#newWaypointButton.disabled = false;
          this.#newWaypointButton.addEventListener(
            'click',
            this.#newWaypointButtonClickHandler
          );
        }
        break;
    }
  };

  #handleNewWaypointDestroy = () => {
    this.#clearWaypointList();
    this.#renderWaypointList();
    this.#newWaypointButton.disabled = false;
  };

  #newWaypointButtonClickHandler = (event) => {
    event.preventDefault();

    this.createWaypoint();
    this.#newWaypointButton.disabled = true;
  };
}
