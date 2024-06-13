import waypointEditView from '../view/waypoint-edit';
import { render, RenderPosition } from '../render/render.js';

export default class NewWaypointPresenter {
  #waypointListContainer = null;
  #waypointEditComponent = null;

  constructor(waypointListContainer) {
    this.#waypointListContainer = waypointListContainer;
  }

  init() {
    if (this.#waypointEditComponent !== null) {
      return;
    }

    this.#waypointEditComponent = new waypointEditView();

    render(
      this.#waypointEditComponent,
      this.#waypointListContainer,
      RenderPosition.AFTERBEGIN
    );
  }
}
