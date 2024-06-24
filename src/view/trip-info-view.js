import AbstractView from '../framework/view/abstract-view.js';
import dayjs from 'dayjs';

const createTripInfoTitleTemplate = (destinations) => {
  let title;

  if (destinations.length > 3) {
    title = `${destinations[0]} &mdash; &hellip; &mdash; ${
      destinations[destinations.length - 1]
    }`;
  } else {
    title = destinations.join(' &mdash; ');
  }

  return `<h1 class="trip-info__title">${title}</h1>`;
};

const createTripInfoDatesTemplate = (dates) => {
  const startDate = dayjs(dates[0].dateFrom).format('DD MMM');
  const endDate = dayjs(dates[[dates.length - 1]].dateTo).format('DD MMM');

  return `<p class="trip-info__dates">${startDate}&nbsp;&mdash;&nbsp;${endDate}</p>`;
};

const createTripInfoCostTemplate = (cost) => {
  if (cost === 0) {
    return '';
  }

  return `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
    </p>`;
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

    ${createTripInfoCostTemplate(cost)}


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
