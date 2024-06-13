import AbstractView from '../framework/view/abstract-view.js';

const createTripInfoTitleTemplate = (destinations) => {
  let title;

  if (destinations.length > 3) {
    title = `${destinations[0]} &mdash; &hellip; &mdash; ${
      destinations[destinations.length - 1]
    }`;
  }

  if (destinations.length <= 3) {
    title = destinations.join(' &mdash; ');
  }

  return `<h1 class="trip-info__title">${title}</h1>`;
};

const createTripInfoDatesTemplate = (dates) => {
  const startDate = dates[0].dateFrom.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  const endDate = dates[[dates.length - 1]].dateTo.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return `<p class="trip-info__dates">${startDate}&nbsp;&mdash;&nbsp;${endDate}</p>`;
};

const createTripInfoTemplate = (waypoints) => {
  const destinations = waypoints.map((waypoint) => waypoint.destination);
  const dates = waypoints.map((waypoint) => ({
    dateFrom: waypoint.dateFrom,
    dateTo: waypoint.dateTo,
  }));
  const cost = waypoints.reduce(
    (totalPrice, waypoint) => totalPrice + waypoint.price,
    0
  );
  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      ${createTripInfoTitleTemplate(destinations)}

      ${waypoints.length ? createTripInfoDatesTemplate(dates) : ''}
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
    </p>
  </section>`;
};

export default class TripInfoView extends AbstractView {
  #waypoints = null;

  constructor(waypoints) {
    super();
    this.#waypoints = waypoints;
  }

  get template() {
    return createTripInfoTemplate(this.#waypoints);
  }
}
