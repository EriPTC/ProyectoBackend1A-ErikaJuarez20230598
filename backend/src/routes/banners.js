import express from "express";
import bannerController from "../controller/bannersController.js";
import upload from "../utils/cloudinaryConfig.js";

const router = express.Router();

router.route("/")
  .get(bannerController.getAllBanners)
  .post(upload.single("image"), bannerController.insertBanner);

router.route("/:id")
  .put(upload.single("image"), bannerController.updateBanners)
  .delete(bannerController.deleteBanner);

export default router;


