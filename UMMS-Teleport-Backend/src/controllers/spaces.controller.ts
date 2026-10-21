import type { Request, Response } from "express";
import { uploadToSpaces, listSpacesFiles } from "../services/spaces.service";

export async function uploadFileController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    let buffer: Buffer;
    let fileName: string;
    let mimeType: string;

    if (req.file) {
      buffer = req.file.buffer;
      fileName = req.file.originalname;
      mimeType = req.file.mimetype;
    } else if (req.body?.base64) {
      const dataUrl: string = req.body.base64;
      const matches = dataUrl.match(/^data:([^;]+);base64,(.+)$/);

      if (!matches || !matches[1] || !matches[2]) {
        res
          .status(400)
          .json({ success: false, message: "Invalid base64 data URL" });
        return;
      }

      mimeType = matches[1];
      const rawBase64 = matches[2];
      buffer = Buffer.from(rawBase64, "base64");
      fileName =
        req.body.name ||
        `upload-${Date.now()}.${mimeType.split("/")[1] || "bin"}`;
    } else {
      res.status(400).json({
        success: false,
        message: "No file provided. Send multipart 'file' or JSON 'base64'",
      });
      return;
    }

    const folder =
      req.body?.folder || (req.query?.folder as string | undefined);

    const uploaded = await uploadToSpaces(buffer, fileName, mimeType, folder);

    res.json({ success: true, data: uploaded });
  } catch (error: any) {
    console.error("uploadFileController error:", error);
    res
      .status(500)
      .json({ success: false, message: error?.message || "Upload failed" });
  }
}

export async function listFilesController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    if (!req.query.folder) {
      res
        .status(404)
        .json({
          success: false,
          message: "Upload folder name is required in query!.",
        });
    }
    const files = await listSpacesFiles(req.query.folder);
    res.json({ success: true, data: files });
  } catch (error: any) {
    console.error("listFilesController error:", error);
    res.status(500).json({
      success: false,
      message: error?.message || "Failed to list files",
    });
  }
}
