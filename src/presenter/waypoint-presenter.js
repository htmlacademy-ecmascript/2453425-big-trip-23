import { UpdateType, UserAction } from '../const.js';
import { remove, render, replace } from '../framework/render.js';
import WaypointEditView from '../view/waypoint-edit-view.js';
import WaypointView from '../view/waypoint-view.js';
import { isDatesEqual } from '../util.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class WaypointPresenter {
  #waypointListContainer = null;

  #waypointComponent = null;
  #waypointEditComponent = null;

  #waypoint = null;
  #offers = null;
  #destinations = null;

  #handleDataChange = null;
  #handleModeChange = null;

  #mode = Mode.DEFAULT;

  constructor({ waypointListContainer, onDataChange, onModeChange }) {
    this.#waypointListContainer = waypointListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init({ waypoint, offers, destinations }) {
    this.#waypoint = waypoint;
    this.#offers = offers || this.#offers;
    this.#destinations = destinations || this.#destinations;

    const prevWaypointComponent = this.#waypointComponent;
    const prevWaypointEditComponent = this.#waypointEditComponent;

    this.#waypointComponent = new WaypointView({
      waypoint: this.#waypoint,
      offers: this.#offers,
      destinations: this.#destinations,
      onRollupClick: this.#handleRollupClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });
    this.#waypointEditComponent = new WaypointEditView({
      waypoint: this.#waypoint,
      offers: this.#offers,
      destinations: this.#destinations,
      onRollupClick: this.#handleRollupClick,
      onFormSubmit: this.#handleFormSubmit,
      onFormDeleteClick: this.#handleFormDeleteClick,
    });

    if (prevWaypointComponent === null && prevWaypointEditComponent === null) {
      render(this.#waypointComponent, this.#waypointListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#waypointComponent, prevWaypointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#waypointComponent, prevWaypointEditComponent);
      this.#mode = Mode.DEFAULT;
    }

    remove(prevWaypointComponent);
    remove(prevWaypointEditComponent);
  }

  destroy() {
    if (this.#mode === Mode.EDITING) {
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
    remove(this.#waypointComponent);
    remove(this.#waypointEditComponent);
  }

  setSaving() {
    if (this.#waypointEditComponent?.isExistingInDOM) {
      this.#waypointEditComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#waypointEditComponent?.isExistingInDOM) {
      this.#waypointEditComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    const resetFormState = () => {
      if (this.#waypointEditComponent?.isExistingInDOM) {
        this.#waypointEditComponent.updateElement({
          isDisabled: false,
          isSaving: false,
          isDeleting: false,
        });
      }
    };

    if (this.#mode === Mode.DEFAULT) {
      this.#waypointComponent.shake(resetFormState);
      return;
    }

    this.#waypointEditComponent.shake(resetFormState);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#waypointEditComponent.reset(this.#waypoint);
      this.#replaceFormToCard();
    }
  }

  #replaceCardToForm() {
    replace(this.#waypointEditComponent, this.#waypointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToCard() {
    replace(this.#waypointComponent, this.#waypointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #handleRollupClick = () => {
    if (this.#mode === Mode.DEFAULT) {
      this.#replaceCardToForm();
      return;
    }

    this.#waypointEditComponent.reset(this.#waypoint);
    this.#replaceFormToCard();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(UserAction.UPDATE_WAYPOINT, UpdateType.PATCH, {
      ...this.#waypoint,
      isFavorite: !this.#waypoint.isFavorite,
    });
  };

  #handleFormSubmit = (update) => {
    const isMinorUpdate =
      !isDatesEqual(this.#waypoint.dateFrom, update.dateFrom) ||
      !isDatesEqual(this.#waypoint.dateTo, update.dateTo) ||
      this.#waypoint.basePrice !== update.basePrice;
    this.#handleDataChange(
      UserAction.UPDATE_WAYPOINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update
    );
  };

  #handleFormDeleteClick = (waypoint) => {
    this.#handleDataChange(
      UserAction.DELETE_WAYPOINT,
      UpdateType.MINOR,
      waypoint
    );
  };

  #escKeyDownHandler = (event) => {
    if (event.key === 'Escape' || event.key === 'Esc') {
      event.preventDefault();
      this.#waypointEditComponent.reset(this.#waypoint);
      this.#replaceFormToCard();
    }
  };
}
