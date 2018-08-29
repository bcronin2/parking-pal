const defaultDimension = 0.02;

const defaultRegion = {
  latitude: 37.7836839,
  longitude: -122.40898609999999,
  latitudeDelta: defaultDimension,
  longitudeDelta: 0.5 * defaultDimension
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

const getBoundary = region => {
  const viewDimension = Math.min(defaultDimension, region.latitudeDelta);
  return {
    llLatitude: region.latitude - 0.5 * viewDimension,
    llLongitude: region.longitude - 0.5 * viewDimension,
    urLatitude: region.latitude + 0.5 * viewDimension,
    urLongitude: region.longitude + 0.5 * viewDimension
  };
};

const getSquareForRegion = region => {
  const viewDimension = Math.min(defaultDimension, region.latitudeDelta);
  return [
    {
      latitude: region.latitude - 0.5 * viewDimension,
      longitude: region.longitude - 0.5 * viewDimension
    },
    {
      latitude: region.latitude - 0.5 * viewDimension,
      longitude: region.longitude + 0.5 * viewDimension
    },
    {
      latitude: region.latitude + 0.5 * viewDimension,
      longitude: region.longitude + 0.5 * viewDimension
    },
    {
      latitude: region.latitude + 0.5 * viewDimension,
      longitude: region.longitude - 0.5 * viewDimension
    }
  ];
};

module.exports = {
  defaultRegion,
  extractCoordinates,
  getBoundary,
  getSquareForRegion
};
