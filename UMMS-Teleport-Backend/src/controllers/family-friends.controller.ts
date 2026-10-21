import type { Request, Response } from "express";
import {
  createFamilyAndFriends,
  getFamilyAndFriendsById,
  listFamilyAndFriends,
  updateFamilyAndFriends,
} from "../services/family-friends.service.js";

const REQUIRED_FIELDS = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "relation",
  "status",
] as const;

export async function createFamilyAndFriendsController(
  req: Request,
  res: Response,
): Promise<void> {
  const body = req.body ?? {};
  const missing = REQUIRED_FIELDS.filter((field) => !body[field]);

  if (missing.length > 0) {
    res.status(400).json({
      message: `${missing.join(", ")} are required`,
    });
    return;
  }

  try {
    const contact = await createFamilyAndFriends({
      firstName: String(body.firstName),
      lastName: String(body.lastName),
      email: String(body.email),
      phone: String(body.phone),
      relation: String(body.relation),
      status: String(body.status),
    });

    res.status(201).json(contact);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to create family/friend";
    const status = message.includes("Unique constraint") ? 409 : 500;
    res.status(status).json({ message });
  }
}

export async function getFamilyAndFriendsController(
  req: Request,
  res: Response,
): Promise<void> {
  const contact = await getFamilyAndFriendsById(String(req.params.id));
  if (!contact) {
    res.status(404).json({ message: "Family/friend contact not found" });
    return;
  }

  res.json(contact);
}

export async function listFamilyAndFriendsController(
  _req: Request,
  res: Response,
): Promise<void> {
  const contacts = await listFamilyAndFriends();
  res.json(contacts);
}

export async function updateFamilyAndFriendsController(
  req: Request,
  res: Response,
): Promise<void> {
  const body = req.body ?? {};

  try {
    const contact = await updateFamilyAndFriends(String(req.params.id), {
      ...(body.firstName !== undefined
        ? { firstName: String(body.firstName) }
        : {}),
      ...(body.lastName !== undefined
        ? { lastName: String(body.lastName) }
        : {}),
      ...(body.email !== undefined ? { email: String(body.email) } : {}),
      ...(body.phone !== undefined ? { phone: String(body.phone) } : {}),
      ...(body.relation !== undefined
        ? { relation: String(body.relation) }
        : {}),
      ...(body.status !== undefined ? { status: String(body.status) } : {}),
      ...(body.invite !== undefined ? { invite: body.invite } : {}),
    });

    if (!contact) {
      res.status(404).json({ message: "Family/friend contact not found" });
      return;
    }

    res.json(contact);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to update family/friend";
    const status = message.includes("Unique constraint") ? 409 : 500;
    res.status(status).json({ message });
  }
}
