const model = require("./model.js");

const handleResponse = (err, results, res) => {
  if (err) console.error(err);
  res.statusCode = err ? 400 : 200;
  res.send(err || results);
};

const controller = {
  getParkingInfo(req, res) {
    const {
      query: { llLatitude, llLongitude, urLatitude, urLongitude }
    } = req;
    model.getBlocksForRegion(
      llLatitude,
      llLongitude,
      urLatitude,
      urLongitude,
      (err, results) => handleResponse(err, results, res)
    );
  },

  getExistingUser(req, res) {
    const {
      params: { id }
    } = req;
    model.getUser(id, (err, results) => {
      handleResponse(err, results, res);
    });
  },

  loginUser(req, res) {
    const {
      body: { username, password }
    } = req;
    model.loginUser(username, password, (err, results) => {
      handleResponse(err, results, res);
    });
  },

  createUser(req, res) {
    const {
      body: { username, password }
    } = req;
    model.createUser(username, password, (err, results) => {
      handleResponse(err, results, res);
    });
  },

  parkUser(req, res) {
    const {
      params: { id }
    } = req;
    const {
      body: { coordinates, expiration, neighborhood }
    } = req;
    model.parkAtLocation(
      id,
      coordinates,
      expiration,
      neighborhood,
      (err, results) => {
        handleResponse(err, results, res);
      }
    );
  },

  unparkUser(req, res) {
    const {
      params: { id }
    } = req;
    model.unpark(id, (err, results) => {
      handleResponse(err, results, res);
    });
  }
};

module.exports = controller;
