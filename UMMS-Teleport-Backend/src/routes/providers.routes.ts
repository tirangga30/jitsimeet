import { Router } from "express";
import {
  createProviderController,
  getProviderController,
  listProvidersController,
  updateProviderController,
} from "../controllers/providers.controller.js";

const router = Router();

router.post("/", createProviderController);
router.get("/", listProvidersController);
router.get("/:id", getProviderController);
router.patch("/:id", updateProviderController);

export default router;
