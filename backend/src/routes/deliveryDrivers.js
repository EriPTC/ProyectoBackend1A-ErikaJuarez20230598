import express from "express";
import deliveryDriverController from "../controller/deliveryDriversController.js";
import uploader from "../utils/cloudinaryConfig.js";

const router = express.Router();

router.route("/")
  .get(deliveryDriverController.getAllDrivers)
  .post(uploader.single("image"), deliveryDriverController.insertDrivers);

router.route("/:id")
  .put(uploader.single("image"), deliveryDriverController.updateDriver)
  .delete(deliveryDriverController.deleteDrivers)
  .get(deliveryDriverController.getDriverById);

export default router;
