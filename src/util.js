import { TimeUnits } from './const.js';
import { FilterType, SortType } from './const.js';

const durationInTimeUnits = {
  [TimeUnits.DAYS]: (durationInMiliseconds) =>
    Math.floor(durationInMiliseconds / (1000 * 60 * 60 * 24)),
  [TimeUnits.HOURS]: (durationInMiliseconds) =>
    Math.floor((durationInMiliseconds / (1000 * 60 * 60)) % 24),
  [TimeUnits.MINUTES]: (durationInMiliseconds) =>
    Math.floor((durationInMiliseconds / (1000 * 60)) % 60),
};

const getTimeDifference = (durationInMiliseconds, unit) => {
  let duration = durationInTimeUnits[unit](durationInMiliseconds);

  if (duration < 1) {
    duration = '';
  } else if (duration < 10) {
    duration = `0${duration}${unit}`;
  } else {
    duration = `${duration}${unit}`;
  }

  return duration;
};

const getDuration = (eventDate, eventEndDate) => {
  const durationInMiliseconds = eventEndDate - eventDate;

  const duration = Object.values(TimeUnits).reduce((result, unit) => {
    let currentUnitDuration = getTimeDifference(durationInMiliseconds, unit);

    if (result.trim() !== '' && !currentUnitDuration) {
      currentUnitDuration = `00${unit}`;
    }

    return `${result} ${currentUnitDuration}`;
  }, '');

  return duration;
};

const filter = {
  [FilterType.EVERYTHING]: (waypoints) =>
    waypoints.filter((waypoint) => waypoint),
  [FilterType.FUTURE]: (waypoints) =>
    waypoints.filter((waypoint) => waypoint.dateFrom > new Date()),
  [FilterType.PRESENT]: (waypoints) =>
    waypoints.filter(
      (waypoint) =>
        waypoint.dateFrom <= new Date() && waypoint.dateTo >= new Date()
    ),
  [FilterType.PAST]: (waypoints) =>
    waypoints.filter((waypoint) => waypoint.dateTo <= new Date()),
};

const sort = {
  [SortType.DAY]: (waypointA, waypointB) =>
    waypointA.dateFrom - waypointB.dateFrom,
  [SortType.TIME]: (waypointA, waypointB) =>
    waypointA.DateTo -
    waypointA.dateFrom -
    (waypointB.dateTo - waypointB.dateTo),
  [SortType.PRICE]: (waypointA, waypointB) =>
    waypointA.basePrice - waypointB.basePrice,
};

export { getDuration, filter, sort };
