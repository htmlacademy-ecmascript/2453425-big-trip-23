import WaypointEditView from '../view/waypoint-edit.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import { UpdateType, UserAction } from '../const.js';

export default class newWaypointPresenter {
  #waypointListComponent = null;

  #waypointEditComponent = null;

  #newWaypointButton = null;

  #handleDataChange = null;
  #handleDestroy = null;

  constructor({
    waypointListComponent,
    newWaypointButton,
    onDataChange,
    onDestroy,
  }) {
    this.#waypointListComponent = waypointListComponent;
    this.#newWaypointButton = newWaypointButton;
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
      this.#waypointListComponent.element,
      RenderPosition.AFTERBEGIN
    );

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (!this.#waypointEditComponent) {
      return;
    }

    this.#newWaypointButton.disabled = false;

    remove(this.#waypointEditComponent);
    this.#waypointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving() {
    this.#waypointEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#waypointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#waypointEditComponent.shake(resetFormState);
  }

  #handleFormSubmit = (waypoint) => {
    this.#handleDataChange(UserAction.ADD_WAYPOINT, UpdateType.MINOR, waypoint);
  };

  #handleFormDeleteClick = () => {
    this.#handleDestroy();
  };

  #escKeyDownHandler = (event) => {
    if (event.key === 'Escape' || event.key === 'Esc') {
      event.preventDefault();
      this.#handleDestroy();
    }
  };
}
