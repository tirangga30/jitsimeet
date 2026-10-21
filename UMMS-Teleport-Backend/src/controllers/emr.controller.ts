import type { Request, Response } from "express";

import { config } from "dotenv";
import axios from "axios";
import { uploadToSpaces, listSpacesFiles } from "../services/spaces.service";
import {
  createEmrImageRecord,
  getEmrImageRecords,
} from "../services/emr.service";

config();
const EMR_URL = process.env.EMR_URL || "";

export async function uploadImageToEmrController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const {
      patientId,
      patientDbId,
      firstName,
      lastName,
      dob,
      gender,
      visitId,
      imageBase64,
      fileType = "PNG",
    } = req.body;

    if (!patientId || !firstName || !lastName || !imageBase64) {
      res.status(400).json({
        message: "patientId, firstName, lastName and imageBase64 are required",
      });
      return;
    }

    const timestamp = Date.now();

    // 1. Process base64 string to buffer
    const matches = imageBase64.match(/^data:([^;]+);base64,(.+)$/);
    let buffer: Buffer;
    let mimeType = "image/png";
    if (matches && matches[1] && matches[2]) {
      mimeType = matches[1];
      buffer = Buffer.from(matches[2], "base64");
    } else {
      buffer = Buffer.from(imageBase64, "base64");
    }

    const extension = mimeType.split("/")[1] || fileType.toLowerCase() || "png";
    const fileName = `emr-${patientId}-${timestamp}.${extension}`;

    // 2. Upload to DigitalOcean Spaces under the 'emrs' folder
    const uploaded = await uploadToSpaces(buffer, fileName, mimeType, "emrs");

    // 3. Store EMR record in PostgreSQL database
    // patientDbId is the UUID FK; patientId (MRN) is used for HL7 messaging only
    const dbRecord = await createEmrImageRecord({
      patientId: patientDbId || patientId,
      imageUrl: uploaded.url,
      fileName: uploaded.name,
      sendToEMR: false,
    });

    const payload = {
      timestamp,
      eventType: "send_EMR",
      jsondata: {
        HL7Message: {
          MSH: {
            "MSH.1": "|",
            "MSH.2": "^~\\&",
            "MSH.4": {
              "MSH.4.1": "Teleport",
            },
            "MSH.9": {
              "MSH.9.1": "MDM",
              "MSH.9.2": "T02",
            },
            "MSH.11": {
              "MSH.11.1": "T",
            },
            "MSH.12": {
              "MSH.12.1": "2.3",
            },
          },

          PID: {
            "PID.1": patientId,
            "PID.2": {
              "PID.2.1": patientId,
            },
            "PID.5": {
              "PID.5.1": lastName,
              "PID.5.2": firstName,
            },
            "PID.7": {
              "PID.7.1": dob,
            },
            "PID.8": {
              "PID.8.1": gender,
            },
          },

          PV1: {
            "PV1.19": {
              "PV1.19.1": visitId,
            },
          },

          TXA: {
            "TXA.2": {
              "TXA.2.1": "172771",
            },
            "TXA.4": {
              "TXA.4.1": new Date().toISOString(),
            },
            "TXA.5": {
              "TXA.5.1": timestamp,
            },
            "TXA.12": {
              "TXA.12.1": `${lastName}${timestamp}`,
            },
            "TXA.17": {
              "TXA.17.1": "AU",
            },
            "TXA.19": {
              "TXA.19.1": "AV",
            },
          },

          OBX: {
            "OBX.1": {
              "OBX.1.1": 1,
            },
            "OBX.2": {
              "OBX.2.1": "ED",
            },
            "OBX.3": {
              "OBX.3.1": "IMAGE",
              "OBX.3.2": "TELEPORTIMAGE",
            },
            "OBX.4": {
              "OBX.4.1": 1,
            },
            "OBX.5": {
              "OBX.5.1": "",
              "OBX.5.2": "",
              "OBX.5.3": fileType,
              "OBX.5.4": "DOCUMENT",
              "OBX.5.5": imageBase64,
            },
          },

          NTE: {
            "NTE.3": {
              "NTE.3.1": `${firstName} ${lastName} image.`,
            },
          },
        },
      },
    };

    // const response = await axios.post(
    //   "http://localhost:4000/api/emr/upload",
    //   payload,
    // );

    res.json({
      success: true,
      message: "File has been successfully sent to EMR and stored in DB.",
      dbRecord,
      // data: response.data,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to upload image to EMR",
    });
  }
}

export async function getEmrImagesController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const patientId = req.query.patientId as string | undefined;

    // Retrieve database records for EMR images
    const dbRecords = await getEmrImageRecords(patientId);

    // Retrieve file assets from DigitalOcean Spaces 'emrs' folder
    const spacesFiles = await listSpacesFiles("emrs");

    // Filter Spaces files to only show those belonging to this patient
    let filteredSpacesFiles = spacesFiles;
    if (patientId) {
      filteredSpacesFiles = spacesFiles.filter(
        (file) => file.name.includes(patientId) || file.key.includes(patientId),
      );
    }

    // Map the sendToEMR boolean state from the database to the spacesFiles output
    const mappedSpacesFiles = filteredSpacesFiles.map((file) => {
      const match = dbRecords.find(
        (rec) => rec.fileName === file.name || rec.imageUrl === file.url,
      );
      return {
        ...file,
        sendToEMR: match ? match.sendToEMR : false,
      };
    });

    res.json({
      success: true,
      data: {
        databaseRecords: dbRecords,
        spacesFiles: mappedSpacesFiles,
      },
    });
  } catch (error: any) {
    console.error("getEmrImagesController error:", error);
    res.status(500).json({
      success: false,
      message: error?.message || "Failed to retrieve EMR images",
    });
  }
}
