import { Router } from "express";
import {
  createFamilyAndFriendsController,
  getFamilyAndFriendsController,
  listFamilyAndFriendsController,
  updateFamilyAndFriendsController,
} from "../controllers/family-friends.controller.js";

const router = Router();

router.post("/", createFamilyAndFriendsController);
router.get("/", listFamilyAndFriendsController);
router.get("/:id", getFamilyAndFriendsController);
router.patch("/:id", updateFamilyAndFriendsController);

export default router;
