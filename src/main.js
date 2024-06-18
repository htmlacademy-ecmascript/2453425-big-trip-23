import SortPresenter from './presenter/sort.js';
import WaypointListPresenter from './presenter/waypoint-list.js';
import WaypointsModel from './model/waypoints.js';
import TripInfoPresenter from './presenter/trip-info.js';
import FilterPresenter from './presenter/filter.js';
import FilterModel from './model/filter.js';
import SortModel from './model/sort.js';
import WaypointApiService from './waypoint-api-service.js';

const END_POINT = 'https://23.objects.htmlacademy.pro/big-trip';
const AUTHORIZATION = 'Basic MD12xAZID10JFVejW';

const siteMainElement = document.querySelector('.trip-events');
const headerMain = document.querySelector('.trip-main');
const filterContainer = document.querySelector('.trip-controls__filters');
const newWaypointButton = document.querySelector('.trip-main__event-add-btn');
newWaypointButton.disabled = true;

const waypointsModel = new WaypointsModel({
  waypointApiService: new WaypointApiService(END_POINT, AUTHORIZATION)
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
  waypointsModel,
});

const waypointListPresenter = new WaypointListPresenter({
  waypointListContainer: siteMainElement,
  waypointsModel,
  filterModel,
  sortModel,
  newWaypointButton: newWaypointButton,
});

waypointListPresenter.init();
filterPresenter.init();
sortPresenter.init();
tripInfoPresenter.init();
waypointsModel.init();

newWaypointButton.addEventListener('click', (event) => {
  event.preventDefault();

  waypointListPresenter.createWaypoint();
  newWaypointButton.disabled = true;
});
