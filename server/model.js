const database = require("./database.js");

const handleResults = (err, results, callback) => {
  if (err) {
    console.error(err);
    callback(err);
  } else {
    callback(null, results.rows);
  }
};

const getBlocksForRegion = (
  llLatitude,
  llLongitude,
  urLatitude,
  urLongitude,
  callback
) => {
  const selectBlocks = `SELECT * FROM parking_info WHERE
    ll_lat > ${llLatitude} AND ll_lon > ${llLongitude} AND ur_lat < ${urLatitude} AND ur_lon < ${urLongitude}`;
  database.query(selectBlocks, (err, results) =>
    handleResults(err, results, callback)
  );
};

const loginUser = (username, password, callback) => {
  const selectUser = `SELECT * FROM user_info WHERE username='${username}' AND password='${password}'`;
  database.query(selectUser, (err, results) =>
    handleResults(err, results, callback)
  );
};

const createUser = (username, password, callback) => {
  const insertUser = `INSERT INTO user_info (username, password) VALUES ('${username}', '${password}')`;
  database.query(insertUser, (err, results) =>
    handleResults(err, results, callback)
  );
}

const parkAtLocation = (userId, coordinates, expiration, callback) => {
  const updateParkingStatus = `UPDATE user_info SET is_parked=1, latitude=${coordinates.latitude}, longitude=${coordinates.longitude}, expiration=${expiration} WHERE id=${userId}`;
  database.query(updateParkingStatus, (err, results) =>
    handleResults(err, results, callback)
  );
}

const unpark = (userId, callback) => {
  const updateParkingStatus = `UPDATE user_info SET is_parked=0, latitude=null, longitude=null, expiration=null WHERE id=${userId}`;
  database.query(updateParkingStatus, (err, results) =>
    handleResults(err, results, callback)
  );
}

module.exports = { getBlocksForRegion, loginUser, createUser, parkAtLocation, unpark };
