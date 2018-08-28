String.prototype.hashCode = function() {
  var hash = 0;
  if (this.length == 0) {
    return hash;
  }
  for (var i = 0; i < this.length; i++) {
    var char = this.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
};

const userLoginEndpoint = "http://localhost:3000/api/users/login";
const userCreateEndpoint = "http://localhost:3000/api/users/create";
const backgroundImageUrl =
  "https://i0.wp.com/gifrific.com/wp-content/uploads/2015/03/Reverse-Spinning-Parralel-Park.gif?resize=425%2C219&ssl=1";

const parkingInfoEndpoint = "http://localhost:3000/api/parking";
const userParkingEndpoint = "http://localhost:3000/api/users";

const days = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];

const colors = {
  yes: "#0f0",
  no: "#f00"
};

const extractCoordinates = coordinates => {
  return (
    (coordinates.latitude &&
      coordinates.longitude && {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude
      }) ||
    null
  );
};

const millisPerMinute = 60 * 1000;
const millisPerHour = 60 * millisPerMinute;
const maxParking = 72 * millisPerHour;

const defaultDimension = 0.02;

const defaultRegion = {
  latitude: 0,
  longitude: 0,
  latitudeDelta: defaultDimension,
  longitudeDelta: 0.5 * defaultDimension
};

const convertMillis = millis => {
  let hours = Math.floor(millis / millisPerHour);
  millis %= millisPerHour;
  let minutes = Math.floor(millis / millisPerMinute);
  millis %= millisPerMinute;
  let seconds = Math.floor(millis / 1000);
  return `${hours}hr, ${minutes}min, ${seconds}s`;
};

const getBoundary = region => {
  const viewDimension = Math.min(defaultDimension, region.latitudeDelta);
  return {
    llLatitude: region.latitude - 0.5 * viewDimension,
    llLongitude: region.longitude - 0.5 * viewDimension,
    urLatitude: region.latitude + 0.5 * viewDimension,
    urLongitude: region.longitude + 0.5 * viewDimension
  };
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
  userLoginEndpoint,
  userCreateEndpoint,
  backgroundImageUrl,
  parkingInfoEndpoint,
  userParkingEndpoint,
  days,
  colors,
  millisPerMinute,
  millisPerHour,
  maxParking,
  defaultRegion,
  convertMillis,
  extractCoordinates,
  getBoundary,
  getExpiration
};
