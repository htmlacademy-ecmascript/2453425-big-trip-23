import { remove, render, RenderPosition } from '../framework/render.js';
import WaypointEditView from '../view/waypoint-edit.js';
import { UpdateType, UserAction } from '../const.js';

export default class newWaypointPresenter {
  #waypointListContainer = null;

  #waypointEditComponent = null;

  #handleDataChange = null;
  #handleDestroy = null;

  constructor({ waypointListContainer, onDataChange, onDestroy }) {
    this.#waypointListContainer = waypointListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init({ offers, destinations }) {
    if (this.#waypointEditComponent) {
      return;
    }

    this.#waypointEditComponent = new WaypointEditView({
      offers,
      destinations,
      isNewWaypoint: true,
      onFormSubmit: this.#handleFormSubmit,
      onFormDeleteClick: this.#handleFormDeleteClick,
    });

    render(
      this.#waypointEditComponent,
      this.#waypointListContainer.querySelector('.trip-events__list'),
      RenderPosition.AFTERBEGIN
    );

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (!this.#waypointEditComponent) {
      return;
    }

    this.#handleDestroy();

    remove(this.#waypointEditComponent);
    this.#waypointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving() {
    this.#waypointEditComponent.updeteElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  #handleFormSubmit = (waypoint) => {
    this.#handleDataChange(UserAction.ADD_WAYPOINT, UpdateType.MINOR, waypoint);
  };

  #handleFormDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (event) => {
    if (event.key === 'Escape' || event.key === 'Esc') {
      event.preventDefault();
      this.destroy();
    }
  };
}
