import SortPresenter from './presenter/sort.js';
import WaypointPresenter from './presenter/waypoint-list.js';

const siteMainElement = document.querySelector('.trip-events');

const sortPresenter = new SortPresenter(siteMainElement);
const waypointPresenter = new WaypointPresenter(siteMainElement);

sortPresenter.init();
waypointPresenter.init();
