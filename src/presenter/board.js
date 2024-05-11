import BoardView from '../view/board.js';
import WaypointListView from '../view/waypoint-list.js';
import LoadingView from '../view/loading.js';
import SortView from '../view/sort.js';
import FilterView from '../view/filter.js';
import NoWaypointView from '../view/no-waypoint.js';
import NewEventButtonView from '../view/new-event-button.js';
import {render} from '../render.js';

export default class Board {
  #boardContainer = null;

  #boardComponent = new BoardView();
  #waypointListComponent = new WaypointListView();
  #loadingComponent = new LoadingView();
  #sortComponent = new SortView();
  #filterComponent = new FilterView();
  #noWaypointComponent = new NoWaypointView();
  #newEventButtonComponent = new NewEventButtonView();


  constructor(boardContainer) {
    this.#boardContainer = boardContainer;
  }

  init() {
    this.#renderBoard();
  }

  #renderBoard() {
    render(this.#sortComponent, this.#boardContainer);
    render(this.#waypointListComponent, this.#boardContainer);
    render(this.#noWaypointComponent, this.#waypointListComponent.element);
  }
}
