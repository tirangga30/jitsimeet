import type { Request, Response } from "express";
import {
  createProvider,
  getProviderById,
  listProviders,
  updateProvider,
} from "../services/providers.service.js";

const REQUIRED_FIELDS = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "designation",
  "status",
] as const;

export async function createProviderController(
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
    const provider = await createProvider({
      firstName: String(body.firstName),
      lastName: String(body.lastName),
      email: String(body.email),
      phone: String(body.phone),
      designation: String(body.designation),
      ...(body.department !== undefined
        ? { department: String(body.department) }
        : {}),
      ...(body.providerType !== undefined
        ? { providerType: String(body.providerType) }
        : {}),
      ...(body.location !== undefined ? { location: String(body.location) } : {}),
      status: String(body.status),
    });

    res.status(201).json(provider);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to create provider";
    const status = message.includes("Unique constraint") ? 409 : 500;
    res.status(status).json({ message });
  }
}

export async function getProviderController(
  req: Request,
  res: Response,
): Promise<void> {
  const provider = await getProviderById(String(req.params.id));
  if (!provider) {
    res.status(404).json({ message: "Provider not found" });
    return;
  }

  res.json(provider);
}

export async function listProvidersController(
  _req: Request,
  res: Response,
): Promise<void> {
  const providers = await listProviders();
  res.json(providers);
}

export async function updateProviderController(
  req: Request,
  res: Response,
): Promise<void> {
  const body = req.body ?? {};

  try {
    const provider = await updateProvider(String(req.params.id), {
      ...(body.firstName !== undefined
        ? { firstName: String(body.firstName) }
        : {}),
      ...(body.lastName !== undefined
        ? { lastName: String(body.lastName) }
        : {}),
      ...(body.email !== undefined ? { email: String(body.email) } : {}),
      ...(body.phone !== undefined ? { phone: String(body.phone) } : {}),
      ...(body.designation !== undefined
        ? { designation: String(body.designation) }
        : {}),
      ...(body.department !== undefined
        ? { department: String(body.department) }
        : {}),
      ...(body.providerType !== undefined
        ? { providerType: String(body.providerType) }
        : {}),
      ...(body.location !== undefined ? { location: String(body.location) } : {}),
      ...(body.status !== undefined ? { status: String(body.status) } : {}),
      ...(body.invite !== undefined ? { invite: body.invite } : {}),
    });

    if (!provider) {
      res.status(404).json({ message: "Provider not found" });
      return;
    }

    res.json(provider);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to update provider";
    const status = message.includes("Unique constraint") ? 409 : 500;
    res.status(status).json({ message });
  }
}
