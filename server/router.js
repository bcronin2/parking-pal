const router = require("express").Router();
const controller = require("./controller.js");

const handleResponse = (err, results, res) => {
  if (err) console.error(err);
  res.statusCode = err ? 400 : 200;
  res.send(err || results);
};

router.get(controller.getParkingInfo);

router.get(controller.getExistingUser);

router.post(controller.loginUser);

router.post(controller.createUser);

router.patch(controller.parkUser);

router.patch(controller.unparkUser);

module.exports = router;
