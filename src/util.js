import { TimeUnit } from './const.js';
import { FilterType, SortType } from './const.js';
import dayjs from 'dayjs';

const durationInTimeUnits = {
  [TimeUnit.DAYS]: (durationInMiliseconds) =>
    Math.floor(durationInMiliseconds / (1000 * 60 * 60 * 24)),
  [TimeUnit.HOURS]: (durationInMiliseconds) =>
    Math.floor((durationInMiliseconds / (1000 * 60 * 60)) % 24),
  [TimeUnit.MINUTES]: (durationInMiliseconds) =>
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

const getDuration = (eventDurationInMilliseconds) => {
  const duration = Object.values(TimeUnit).reduce((result, unit) => {
    let currentUnitDuration = getTimeDifference(
      eventDurationInMilliseconds,
      unit
    );

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
    waypoints.filter((waypoint) => waypoint.dateTo < new Date()),
};

const sort = {
  [SortType.DAY]: (waypointA, waypointB) =>
    waypointA.dateFrom - waypointB.dateFrom,
  [SortType.TIME]: (waypointA, waypointB) => {
    const durationA = waypointA.dateTo - waypointA.dateFrom;
    const durationB = waypointB.dateTo - waypointB.dateFrom;

    return durationB - durationA;
  },
  [SortType.PRICE]: (waypointA, waypointB) =>
    waypointB.basePrice - waypointA.basePrice,
};

const isDatesEqual = (dateA, dateB) => dayjs(dateA).isSame(dateB);

export { getDuration, filter, sort, isDatesEqual };
