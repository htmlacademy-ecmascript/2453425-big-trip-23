import SortPresenter from './presenter/sort.js';
import WaypointListPresenter from './presenter/waypoint-list.js';
import WaypointsModel from './model/waypoints.js';
import TripInfoPresenter from './presenter/trip-info.js';
import FilterPresenter from './presenter/filter.js';
import FilterModel from './model/filter.js';
import SortModel from './model/sort.js';

const siteMainElement = document.querySelector('.trip-events');
const headerMain = document.querySelector('.trip-main');
const filterContainer = document.querySelector('.trip-controls__filters');

const waypointsModel = new WaypointsModel();
waypointsModel.init();

const filterModel = new FilterModel();
const sortModel = new SortModel();

const tripInfoPresenter = new TripInfoPresenter(headerMain, waypointsModel);
tripInfoPresenter.init();

const filterPresenter = new FilterPresenter(
  filterContainer,
  filterModel,
  waypointsModel
);
filterPresenter.init();

const sortPresenter = new SortPresenter(siteMainElement, sortModel);
sortPresenter.init();

const waypointListPresenter = new WaypointListPresenter(
  siteMainElement,
  waypointsModel
);

sortPresenter.init();
waypointListPresenter.init();
