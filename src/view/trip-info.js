import AbstractView from './abstract.js';

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
  const startDate = dates[0][0].toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  const endDate = dates[[dates.length - 1]][1].toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return `<p class="trip-info__dates">${startDate}&nbsp;&mdash;&nbsp;${endDate}</p>`;
};

const createTripInfoTemplate = (destinations, dates, cost) =>
  `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      ${createTripInfoTitleTemplate(destinations)}

      ${destinations.length ? createTripInfoDatesTemplate(dates) : ''}
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
    </p>
  </section>`;

export default class TripInfoView extends AbstractView {
  constructor(destinations, dates, cost) {
    super();
    this.destinations = destinations;
    this.dates = dates;
    this.cost = cost;
  }

  get template() {
    return createTripInfoTemplate(this.destinations, this.dates, this.cost);
  }
}
