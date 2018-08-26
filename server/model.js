const database = require("./database.js");

const handleResults = (err, results, callback) => {
  if (err) {
    console.error(err);
    callback(err);
  } else {
    callback(null, results);
  }
};

const getBlocksByPosition = (
  llLatitude,
  llLongitude,
  urLatitude,
  urLongitude,
  callback
) => {
  const selectBlocks = `SELECT * FROM parking_info WHERE
    ll_lat > ${llLatitude} AND ll_lon > ${llLongitude} AND ur_lat < ${urLatitude} AND ur_lon < ${urLongitude}`;
  console.log(selectBlocks);
  database.query(selectBlocks, (err, results) =>
    handleResults(err, results.rows, callback)
  );
};

module.exports = { getBlocksByPosition };
