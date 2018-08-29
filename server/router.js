const router = require("express").Router();
const controller = require("./controller.js");

const handleResponse = (err, results, res) => {
  if (err) console.error(err);
  res.statusCode = err ? 400 : 200;
  res.send(err || results);
};

router.get("/api/parking", controller.getParkingInfo);

router.get("/api/users/stored/:id", controller.getExistingUser);

router.post("/api/users/login", controller.loginUser);

router.post("/api/users/create", controller.createUser);

router.patch("/api/users/:id/park", controller.parkUser);

router.patch("/api/users/:id/unpark", controller.unparkUser);

module.exports = router;
