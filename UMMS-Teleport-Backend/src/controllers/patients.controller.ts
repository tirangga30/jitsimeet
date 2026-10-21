import type { Request, Response } from "express";
import {
  createPatient,
  getPatientDetailById,
  listMeetingsByPatient,
  listPatients,
  updatePatient,
} from "../services/patients.service.js";
import type { Gender } from "../types/patient.js";

const GENDERS: Gender[] = ["Male", "Female", "Other"];
const DEFAULT_MEETING_PAGE_SIZE = 20;
const MAX_MEETING_PAGE_SIZE = 100;

const REQUIRED_FIELDS = [
  "firstName",
  "lastName",
  "gender",
  "age",
  "dob",
  "medicareNumber",
  "MRN",
  "CBEN",
  "phone",
  "currentStatus",
  "deviceAssociated",
];

export async function createPatientController(
  req: Request,
  res: Response,
): Promise<void> {
  const body = req.body ?? {};
  const missing = REQUIRED_FIELDS.filter(
    (field) =>
      body[field] === undefined || body[field] === null || body[field] === "",
  );

  if (missing.length > 0) {
    res.status(400).json({
      message: `${missing.join(", ")} are required`,
    });
    return;
  }

  if (!GENDERS.includes(body.gender)) {
    res.status(400).json({
      message: "gender must be one of: Male, Female, Other",
    });
    return;
  }

  if (!Array.isArray(body.providerIds) || body.providerIds.length === 0) {
    res.status(400).json({
      message: "providerIds is required",
    });
    return;
  }

  if (!Array.isArray(body.familyIds) || body.familyIds.length === 0) {
    res.status(400).json({
      message: "familyIds is required",
    });
    return;
  }

  try {
    const patient = await createPatient({
      firstName: String(body.firstName),
      lastName: String(body.lastName),
      gender: body.gender,
      age: Number(body.age),
      dob: String(body.dob),
      medicareNumber: String(body.medicareNumber),
      MRN: String(body.MRN),
      CBEN: String(body.CBEN),
      phone: String(body.phone),
      currentStatus: String(body.currentStatus),
      deviceAssociated: String(body.deviceAssociated),

      imageUrl: body.imageUrl,

      providerIds: body.providerIds,
      familyIds: body.familyIds,
    });

    res.status(201).json(patient);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to create patient";
    const status = message.includes("Foreign key constraint") ? 400 : 500;
    res.status(status).json({ message });
  }
}

export async function getPatientController(
  req: Request,
  res: Response,
): Promise<void> {
  const patient = await getPatientDetailById(String(req.params.id));
  if (!patient) {
    res.status(404).json({ message: "Patient not found" });
    return;
  }

  res.json(patient);
}

export async function listPatientsController(
  _req: Request,
  res: Response,
): Promise<void> {
  const patients = await listPatients();
  res.json(patients);
}

export async function updatePatientController(
  req: Request,
  res: Response,
): Promise<void> {
  const body = req.body ?? {};

  if (body.gender !== undefined && !GENDERS.includes(body.gender)) {
    res.status(400).json({
      message: "gender must be one of: Male, Female, Other",
    });
    return;
  }

  if (body.providerIds !== undefined && !Array.isArray(body.providerIds)) {
    res.status(400).json({
      message: "providerIds must be an array",
    });
    return;
  }

  if (body.familyIds !== undefined && !Array.isArray(body.familyIds)) {
    res.status(400).json({
      message: "familyIds must be an array",
    });
    return;
  }

  try {
    const patient = await updatePatient(String(req.params.id), {
      ...(body.firstName !== undefined && {
        firstName: String(body.firstName),
      }),

      ...(body.lastName !== undefined && {
        lastName: String(body.lastName),
      }),

      ...(body.gender !== undefined && {
        gender: body.gender,
      }),

      ...(body.age !== undefined && {
        age: Number(body.age),
      }),

      ...(body.dob !== undefined && {
        dob: String(body.dob),
      }),

      ...(body.medicareNumber !== undefined && {
        medicareNumber: String(body.medicareNumber),
      }),

      ...(body.MRN !== undefined && {
        MRN: String(body.MRN),
      }),

      ...(body.CBEN !== undefined && {
        CBEN: String(body.CBEN),
      }),

      ...(body.phone !== undefined && {
        phone: String(body.phone),
      }),

      ...(body.currentStatus !== undefined && {
        currentStatus: String(body.currentStatus),
      }),

      ...(body.deviceAssociated !== undefined && {
        deviceAssociated: String(body.deviceAssociated),
      }),

      ...(body.imageUrl !== undefined && {
        imageUrl: String(body.imageUrl),
      }),

      ...(body.providerIds !== undefined && {
        providerIds: body.providerIds,
      }),

      ...(body.familyIds !== undefined && {
        familyIds: body.familyIds,
      }),
    });

    if (!patient) {
      res.status(404).json({
        message: "Patient not found",
      });
      return;
    }

    res.json(patient);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to update patient";

    res.status(500).json({
      message,
    });
  }
}

export async function listPatientMeetingsController(
  req: Request,
  res: Response,
): Promise<void> {
  const patient = await getPatientDetailById(String(req.params.id));
  if (!patient) {
    res.status(404).json({ message: "Patient not found" });
    return;
  }

  const rawLimit = req.query.limit;
  const limit =
    rawLimit === undefined ? DEFAULT_MEETING_PAGE_SIZE : Number(rawLimit);

  if (!Number.isInteger(limit) || limit < 1 || limit > MAX_MEETING_PAGE_SIZE) {
    res.status(400).json({
      message: `limit must be an integer between 1 and ${MAX_MEETING_PAGE_SIZE}`,
    });
    return;
  }

  const cursor =
    typeof req.query.cursor === "string" && req.query.cursor.length > 0
      ? req.query.cursor
      : undefined;

  const meetings = await listMeetingsByPatient(patient.id, limit, cursor);

  if (!meetings) {
    res.status(400).json({ message: "Invalid meeting cursor" });
    return;
  }

  res.json(meetings);
}
