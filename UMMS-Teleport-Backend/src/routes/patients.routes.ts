import { Router } from "express";
import {
  createPatientController,
  getPatientController,
  listPatientMeetingsController,
  listPatientsController,
  updatePatientController,
} from "../controllers/patients.controller.js";

const router = Router();

router.post("/", createPatientController);
router.get("/", listPatientsController);
router.get("/:id", getPatientController);
router.patch("/:id", updatePatientController);
router.get("/:id/meetings", listPatientMeetingsController);

export default router;
