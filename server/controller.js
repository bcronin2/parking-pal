const router = require("express").Router();
const model = require("./model.js");

const handleResponse = (err, results, res) => {
  if (err) console.error(err);
  res.statusCode = err ? 400 : 200;
  res.send(err || results);
};

router.get("/api/parking", (req, res) => {
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
});

router.post("/api/users/login", (req, res) => {
  const {
    body: { username, password }
  } = req;
  model.loginUser(username, password, (err, results) => {
    handleResponse(err, results, res);
  });
});

router.post("/api/users/create", (req, res) => {
  const {
    body: { username, password }
  } = req;
  model.createUser(username, password, (err, results) => {
    handleResponse(err, results, res);
  });
});

router.patch("/api/users/:id/park", (req, res) => {
  const {
    params: { id }
  } = req;
  const {
    body: { coordinates, expiration }
  } = req;
  model.parkAtLocation(id, coordinates, expiration, (err, results) => {
    handleResponse(err, results, res);
  });
});

router.patch("/api/users/:id/unpark", (req, res) => {
  const {
    params: { id }
  } = req;
  model.unpark(id, (err, results) => {
    handleResponse(err, results, res);
  });
});

module.exports = router;
