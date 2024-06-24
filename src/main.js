import SortPresenter from './presenter/sort-presenter.js';
import WaypointListPresenter from './presenter/waypoint-list-presenter.js';
import WaypointsModel from './model/waypoints-model.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilterModel from './model/filter-model.js';
import SortModel from './model/sort-model.js';
import WaypointApiService from './waypoint-api-service.js';

const END_POINT = 'https://23.objects.htmlacademy.pro/big-trip';
const AUTHORIZATION = 'Basic MD12xAZID10JFVejW';

const siteMainElement = document.querySelector('.trip-events');
const headerMain = document.querySelector('.trip-main');
const filterContainer = document.querySelector('.trip-controls__filters');
const newWaypointButton = document.querySelector('.trip-main__event-add-btn');

const waypointsModel = new WaypointsModel({
  waypointApiService: new WaypointApiService(END_POINT, AUTHORIZATION),
});
const filterModel = new FilterModel();
const sortModel = new SortModel();

const tripInfoPresenter = new TripInfoPresenter({
  tripInfoContainer: headerMain,
  waypointsModel,
});

const filterPresenter = new FilterPresenter({
  filterContainer,
  filterModel,
  waypointsModel,
});

const sortPresenter = new SortPresenter({
  sortContainer: siteMainElement,
  sortModel,
  filterModel,
  waypointsModel,
});

const waypointListPresenter = new WaypointListPresenter({
  waypointListContainer: siteMainElement,
  waypointsModel,
  filterModel,
  sortModel,
  newWaypointButton,
});

waypointListPresenter.init();
filterPresenter.init();
sortPresenter.init();
tripInfoPresenter.init();
waypointsModel.init();
