import { Router } from "express";
import { uploadImageToEmrController, getEmrImagesController } from "../controllers/emr.controller";
const router = Router();

router.post("/upload-image", uploadImageToEmrController);
router.get("/images", getEmrImagesController);

export default router;
