import "dotenv/config";
import { prisma } from "../src/config/prisma.js";

async function main() {
  console.log("Seeding UMMS Teleport development database...");

  // 1. Create or update sample providers
  const provider1 = await prisma.providerAndStaff.upsert({
    where: { email: "dr.sarah.johnson@example.com" },
    update: {},
    create: {
      firstName: "Sarah",
      lastName: "Johnson",
      email: "dr.sarah.johnson@example.com",
      phone: "+15551000001",
      designation: "MD, Attending Physician",
      department: "Internal Medicine",
      providerType: "Physician",
      location: "Main Hospital - Floor 3",
      status: "Available",
      invite: false,
    },
  });

  const provider2 = await prisma.providerAndStaff.upsert({
    where: { email: "dr.michael.chen@example.com" },
    update: {},
    create: {
      firstName: "Michael",
      lastName: "Chen",
      email: "dr.michael.chen@example.com",
      phone: "+15551000002",
      designation: "Cardiologist",
      department: "Cardiology",
      providerType: "Specialist",
      location: "Cardio Wing - Suite 102",
      status: "Available",
      invite: false,
    },
  });

  const provider3 = await prisma.providerAndStaff.upsert({
    where: { email: "emily.davis@example.com" },
    update: {},
    create: {
      firstName: "Emily",
      lastName: "Davis",
      email: "emily.davis@example.com",
      phone: "+15551000003",
      designation: "RN, Lead Telehealth Nurse",
      department: "Inpatient Care",
      providerType: "Nurse",
      location: "Inpatient Ward 3B",
      status: "Available",
      invite: false,
    },
  });

  // 2. Create or update sample family members
  const family1 = await prisma.familyAndFriends.upsert({
    where: { email: "simon.testpatient@example.com" },
    update: {},
    create: {
      firstName: "Simon",
      lastName: "Testpatient",
      email: "simon.testpatient@example.com",
      phone: "+15552000001",
      relation: "Father",
      status: "Available",
      invite: false,
    },
  });

  const family2 = await prisma.familyAndFriends.upsert({
    where: { email: "daniel.lawrence@example.com" },
    update: {},
    create: {
      firstName: "Daniel",
      lastName: "Lawrence",
      email: "daniel.lawrence@example.com",
      phone: "+15552000002",
      relation: "Friend",
      status: "Available",
      invite: false,
    },
  });

  // 3. Create or update default sample patient
  // CSN / ID band: 5080483241, MRN: 3001330978
  const existingPatient = await prisma.patient.findFirst({
    where: {
      OR: [
        { CBEN: "5080483241" },
        { MRN: "3001330978" },
      ],
    },
  });

  let patientId = existingPatient?.id;

  if (!existingPatient) {
    const patient = await prisma.patient.create({
      data: {
        firstName: "Ashley",
        lastName: "Testpatient",
        dob: new Date("1989-08-02T00:00:00.000Z"),
        medicareNumber: "MED-987654-A",
        phone: "+15553000001",
        CBEN: "5080483241",
        MRN: "3001330978",
        age: 33,
        currentStatus: "Admitted",
        deviceAssociated: "iPad-Room-302",
        gender: "Female",
        imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300",
        providers: {
          create: [
            { provider: { connect: { id: provider1.id } } },
            { provider: { connect: { id: provider2.id } } },
            { provider: { connect: { id: provider3.id } } },
          ],
        },
        families: {
          create: [
            { family: { connect: { id: family1.id } } },
            { family: { connect: { id: family2.id } } },
          ],
        },
      },
    });
    patientId = patient.id;
    console.log(`Created default patient Ashley Testpatient (ID: ${patient.id}, CSN: 5080483241)`);
  } else {
    console.log(`Default patient already exists (ID: ${existingPatient.id}, CSN: ${existingPatient.CBEN})`);
  }

  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
