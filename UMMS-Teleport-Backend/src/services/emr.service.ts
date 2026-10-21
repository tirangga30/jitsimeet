import { prisma } from "../config/prisma.js";

export interface CreateEmrImageInput {
  patientId: string;
  imageUrl: string;
  fileName: string;
  sendToEMR?: boolean;
}

export async function createEmrImageRecord(input: CreateEmrImageInput) {
  return await prisma.emrImage.create({
    data: {
      patientId: input.patientId,
      imageUrl: input.imageUrl,
      fileName: input.fileName,
      sendToEMR: input.sendToEMR ?? false,
    },
  });
}

export async function getEmrImageRecords(patientId?: string) {
  if (patientId) {
    return await prisma.emrImage.findMany({
      where: { patientId },
      orderBy: { createdAt: "desc" },
    });
  }
  return await prisma.emrImage.findMany({
    orderBy: { createdAt: "desc" },
  });
}
