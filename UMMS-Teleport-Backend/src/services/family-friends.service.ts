import { prisma } from "../config/prisma.js";
import type {
  CreateFamilyAndFriendsInput,
  FamilyAndFriends,
  UpdateFamilyAndFriendsInput,
} from "../types/patient.js";

function toFamilyAndFriends(record: {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  relation: string;
  status: string;
}): FamilyAndFriends {
  return {
    id: record.id,
    firstName: record.firstName,
    lastName: record.lastName,
    email: record.email,
    phone: record.phone,
    relation: record.relation,
    status: record.status,
  };
}

export async function createFamilyAndFriends(
  input: CreateFamilyAndFriendsInput,
): Promise<FamilyAndFriends> {
  const record = await prisma.familyAndFriends.create({ data: input });
  return toFamilyAndFriends(record);
}

export async function getFamilyAndFriendsById(
  id: string,
): Promise<FamilyAndFriends | null> {
  const record = await prisma.familyAndFriends.findUnique({ where: { id } });
  return record ? toFamilyAndFriends(record) : null;
}

export async function listFamilyAndFriends(): Promise<FamilyAndFriends[]> {
  const records = await prisma.familyAndFriends.findMany({
    orderBy: { firstName: "asc" },
  });
  return records.map(toFamilyAndFriends);
}

export async function updateFamilyAndFriends(
  id: string,
  input: UpdateFamilyAndFriendsInput,
): Promise<FamilyAndFriends | null> {
  const existing = await prisma.familyAndFriends.findUnique({ where: { id } });
  if (!existing) return null;

  const record = await prisma.familyAndFriends.update({
    where: { id },
    data: input,
  });

  return toFamilyAndFriends(record);
}
