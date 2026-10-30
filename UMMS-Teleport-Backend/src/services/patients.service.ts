import { prisma } from "../config/prisma.js";
import type {
  CreatePatientInput,
  FamilyAndFriends,
  Gender,
  Meeting,
  MeetingPage,
  Patient,
  PatientDetail,
  ProviderAndStaff,
  UpdatePatientInput,
} from "../types/patient.js";

function toPatient(record: any): Patient {
  return {
    id: record.id,
    firstName: record.firstName,
    lastName: record.lastName,
    gender: record.gender,
    age: record.age,
    dob: record.dob.toISOString(),
    medicareNumber: record.medicareNumber,
    MRN: record.MRN,
    CBEN: record.CBEN,
    phone: record.phone,
    currentStatus: record.currentStatus,
    deviceAssociated: record.deviceAssociated,
    imageUrl: record.imageUrl,
    createdAt: record.createdAt.toISOString(),

    providers: record.providers?.map((p: any) => p.provider) ?? [],

    families: record.families?.map((f: any) => f.family) ?? [],
  };
}

function toMeeting(record: {
  id: string;
  roomId: string;
  patientId: string;
  createdAt: Date;
}): Meeting {
  return {
    id: record.id,
    roomId: record.roomId,
    patientId: record.patientId,
    createdAt: record.createdAt.toISOString(),
  };
}

export async function createPatient(
  data: CreatePatientInput,
): Promise<PatientDetail> {
  const patient = await prisma.patient.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
      age: data.age,
      dob: new Date(data.dob),
      medicareNumber: data.medicareNumber,
      MRN: data.MRN,
      CBEN: data.CBEN,
      phone: data.phone,
      currentStatus: data.currentStatus,
      deviceAssociated: data.deviceAssociated,
      imageUrl: data.imageUrl ?? null,
      providers: {
        create: data.providerIds.map((providerId) => ({
          provider: {
            connect: { id: providerId },
          },
        })),
      },

      families: {
        create: data.familyIds.map((familyId) => ({
          family: {
            connect: { id: familyId },
          },
        })),
      },
    },

    include: {
      providers: {
        include: {
          provider: true,
        },
      },

      families: {
        include: {
          family: true,
        },
      },
    },
  });

  return {
    ...toPatient(patient),
    providers: patient.providers.map((p) => p.provider),
    families: patient.families.map((f) => f.family),
    latestMeeting: null,
    meetingCount: 0,
  };
}

export async function getPatientById(id: string): Promise<Patient | null> {
  const patient = await prisma.patient.findFirst({
    where: {
      OR: [{ id }, { CBEN: id }, { MRN: id }],
    },
  });

  return patient ? toPatient(patient) : null;
}
export async function getPatientDetailById(
  id: string,
): Promise<PatientDetail | null> {
  const patient = await prisma.patient.findFirst({
    where: {
      OR: [{ id }, { CBEN: id }, { MRN: id }],
    },

    include: {
      providers: {
        include: {
          provider: true,
        },
      },

      families: {
        include: {
          family: true,
        },
      },

      meetings: {
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        take: 1,
      },
      _count: {
        select: { meetings: true },
      },
    },
  });

  if (!patient) {
    return null;
  }

  return {
    ...toPatient(patient),

    providers: patient.providers.map((p) => p.provider),

    families: patient.families.map((f) => f.family),

    latestMeeting: patient.meetings[0]
      ? toMeeting(patient.meetings[0])
      : null,
    meetingCount: patient._count.meetings,
  };
}
export async function listPatients(): Promise<Patient[]> {
  const records = await prisma.patient.findMany({
    include: {
      providers: {
        include: {
          provider: true,
        },
      },
      families: {
        include: {
          family: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return records.map(toPatient);
}
export async function updatePatient(
  id: string,
  input: UpdatePatientInput,
): Promise<Patient | null> {
  const existing = await prisma.patient.findUnique({
    where: { id },
  });

  if (!existing) {
    return null;
  }

  const record = await prisma.patient.update({
    where: {
      id,
    },

    data: {
      ...(input.firstName !== undefined && {
        firstName: input.firstName,
      }),

      ...(input.lastName !== undefined && {
        lastName: input.lastName,
      }),

      ...(input.gender !== undefined && {
        gender: input.gender,
      }),

      ...(input.age !== undefined && {
        age: input.age,
      }),

      ...(input.dob !== undefined && {
        dob: new Date(input.dob),
      }),

      ...(input.medicareNumber !== undefined && {
        medicareNumber: input.medicareNumber,
      }),

      ...(input.MRN !== undefined && {
        MRN: input.MRN,
      }),

      ...(input.CBEN !== undefined && {
        CBEN: input.CBEN,
      }),

      ...(input.phone !== undefined && {
        phone: input.phone,
      }),

      ...(input.currentStatus !== undefined && {
        currentStatus: input.currentStatus,
      }),

      ...(input.deviceAssociated !== undefined && {
        deviceAssociated: input.deviceAssociated,
      }),

      ...(input.imageUrl !== undefined && {
        imageUrl: input.imageUrl,
      }),

      ...(input.providerIds && {
        providers: {
          deleteMany: {},
          create: input.providerIds.map((providerId) => ({
            provider: {
              connect: {
                id: providerId,
              },
            },
          })),
        },
      }),

      ...(input.familyIds && {
        families: {
          deleteMany: {},
          create: input.familyIds.map((familyId) => ({
            family: {
              connect: {
                id: familyId,
              },
            },
          })),
        },
      }),
    },
  });

  return toPatient(record);
}

export async function recordMeeting(
  patientId: string,
  roomId: string,
): Promise<Meeting | null> {
  const patient = await prisma.patient.findUnique({ where: { id: patientId } });
  if (!patient) {
    console.warn(
      `Skipping meeting record — patient ${patientId} not found in database`,
    );
    return null;
  }

  const record = await prisma.meeting.upsert({
    where: { roomId },
    update: {},
    create: { patientId, roomId },
  });

  if (record.patientId !== patientId) {
    throw new Error("Meeting room is already assigned to another patient");
  }

  return toMeeting(record);
}

export async function listMeetingsByPatient(
  patientId: string,
  limit: number,
  cursor?: string,
): Promise<MeetingPage | null> {
  if (cursor) {
    const cursorMeeting = await prisma.meeting.findFirst({
      where: { id: cursor, patientId },
      select: { id: true },
    });

    if (!cursorMeeting) {
      return null;
    }
  }

  const records = await prisma.meeting.findMany({
    where: { patientId },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: limit + 1,
    ...(cursor && {
      cursor: { id: cursor },
      skip: 1,
    }),
  });

  const hasMore = records.length > limit;
  const pageRecords = hasMore ? records.slice(0, limit) : records;

  return {
    items: pageRecords.map(toMeeting),
    nextCursor: hasMore ? pageRecords.at(-1)?.id ?? null : null,
    hasMore,
  };
}
