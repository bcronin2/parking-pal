const router = require("express").Router();
const controller = require("./controller.js");

router.get("/api/parking", controller.getParkingInfo);

router.get("/api/users/stored/:id", controller.getExistingUser);

router.post("/api/users/login", controller.loginUser);

router.post("/api/users/create", controller.createUser);

router.patch("/api/users/:id/park", controller.parkUser);

router.patch("/api/users/:id/unpark", controller.unparkUser);

module.exports = router;
