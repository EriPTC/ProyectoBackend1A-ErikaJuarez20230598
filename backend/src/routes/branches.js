import express from "express";
import {
  getBranches,
  insertBranches,
  deleteBranches,
  updateBranches,
} from "../controller/branchesController.js";

import { validateAuthCookie } from "../middlewares/authMiddleware.js";

//Router() nos ayuda a colocar los métodos
//que tendrá mi endpoint

const router = express.Router();

router
  .route("/")
  .get(validateAuthCookie(["customer","admin"]), getBranches)
  .post(validateAuthCookie(["admin"]),insertBranches);

router
  .route("/:id")
  .put(validateAuthCookie(["admin"]),updateBranches)
  .delete(validateAuthCookie(["admin"]),deleteBranches);

export default router;


