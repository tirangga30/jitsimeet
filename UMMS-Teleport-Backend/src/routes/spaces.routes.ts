import { Router } from "express";
import multer from "multer";
import {
  uploadFileController,
  listFilesController,
} from "../controllers/spaces.controller";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
});

router.post("/upload", upload.single("file"), uploadFileController);

router.get("/files", listFilesController);

export default router;
