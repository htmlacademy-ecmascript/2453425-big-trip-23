import BoardView from '../view/board.js';
import WaypointListView from '../view/waypoint-list.js';
import LoadingView from '../view/loading.js';
import SortView from '../view/sort.js';
import FilterView from '../view/filter.js';
import NoWaypointView from '../view/no-waypoint.js';
// import {render} from '../render.js';

export default class Board {
  #boardContainer = null;

  #boardComponent = new BoardView();
  #waypointListComponent = new WaypointListView();
  #loadingComponent = new LoadingView();
  #sortComponent = new SortView();
  #filterComponent = new FilterView();
  #noWaypointComponent = new NoWaypointView();


  // constructor(boardContainer) {

  // }

  // getBoardComponent() {
  //   const component = this.#boardComponent.element;
  // }
}
