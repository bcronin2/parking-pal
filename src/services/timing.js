const millisPerMinute = 60 * 1000;
const millisPerHour = 60 * millisPerMinute;
const maxParking = 72 * millisPerHour;
const days = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];

const convertMillis = millis => {
  let hours = Math.floor(millis / millisPerHour);
  millis %= millisPerHour;
  let minutes = Math.floor(millis / millisPerMinute);
  millis %= millisPerMinute;
  let seconds = Math.floor(millis / 1000);
  return `${hours}hr, ${minutes}min, ${seconds}s`;
};

const parseDate = date => {
  return date.toString().split("GMT")[0];
};

const isCleaning = (block, dayIndexInWeek, weekIndexInMonth, hour) => {
  const sweepDay = block.days.indexOf(days[dayIndexInWeek]) >= 0;
  const sweepWeek = block.weeks[weekIndexInMonth] === "Y";
  const sweepHour = block.start_hour <= hour && block.end_hour > hour;
  return sweepDay && sweepWeek && sweepHour;
};

const getExpiration = (block, currentTime) => {
  let testDate = new Date(currentTime);
  testDate.setHours(0, 0, 0, 0);
  while (true) {
    const sweepDay = block.days.indexOf(days[testDate.getDay()]) >= 0;
    const sweepWeek = block.weeks[Math.floor(testDate.getDate() / 7)] === "Y";
    if (sweepDay && sweepWeek) {
      expiration = testDate.getTime();
      if (expiration + block.start_hour * millisPerHour > currentTime) {
        testDate.setHours(block.start_hour);
        return testDate;
      } else if (expiration + block.end_hour * millisPerHour > currentTime) {
        return null;
      }
    }
    testDate.setDate(testDate.getDate() + 1);
  }
};

module.exports = {
  maxParking,
  convertMillis,
  parseDate,
  getExpiration,
  isCleaning
};
