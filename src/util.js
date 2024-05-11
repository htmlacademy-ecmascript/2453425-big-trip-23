const TimeUnits = {
  D: (durationInMiliseconds) => Math.floor(durationInMiliseconds / (1000 * 60 * 60 * 24)),
  H: (durationInMiliseconds) => Math.floor((durationInMiliseconds / (1000 * 60 * 60)) % 24),
  M: (durationInMiliseconds) => Math.floor((durationInMiliseconds / (1000 * 60)) % 60),
};

const getTimeDifference = (durationInMiliseconds, unit) => {
  let duration = TimeUnits[unit](durationInMiliseconds);

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
  const duration = Object.keys(TimeUnits)
    .reduce((result, unit) => {
      let currentUnitDuration = getTimeDifference(durationInMiliseconds, unit);

      if (result && !currentUnitDuration) {
        currentUnitDuration = `00${unit}`;
      }

      return `${result} ${currentUnitDuration}`;
    }, '');

  return duration;
};

export { getDuration };
