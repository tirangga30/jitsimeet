import { prisma } from "../config/prisma.js";
import type {
  CreateProviderInput,
  ProviderAndStaff,
  UpdateProviderInput,
} from "../types/patient.js";

function toProvider(record: {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  designation: string;
  department: string | null;
  providerType: string | null;
  location: string | null;
  status: string;
}): ProviderAndStaff {
  return {
    id: record.id,
    firstName: record.firstName,
    lastName: record.lastName,
    email: record.email,
    phone: record.phone,
    designation: record.designation,
    department: record.department,
    providerType: record.providerType,
    location: record.location,
    status: record.status,
  };
}

export async function createProvider(
  input: CreateProviderInput,
): Promise<ProviderAndStaff> {
  const record = await prisma.providerAndStaff.create({ data: input });
  return toProvider(record);
}

export async function getProviderById(
  id: string,
): Promise<ProviderAndStaff | null> {
  const record = await prisma.providerAndStaff.findUnique({ where: { id } });
  return record ? toProvider(record) : null;
}

export async function listProviders(): Promise<ProviderAndStaff[]> {
  const records = await prisma.providerAndStaff.findMany({
    orderBy: { firstName: "asc" },
  });
  return records.map(toProvider);
}

export async function updateProvider(
  id: string,
  input: UpdateProviderInput,
): Promise<ProviderAndStaff | null> {
  try {
    const record = await prisma.providerAndStaff.update({
      where: { id },
      data: input,
    });
    return toProvider(record);
  } catch {
    return null;
  }
}
