import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { getDatabaseConfig } from "./database.js";

const adapter = new PrismaPg(getDatabaseConfig());

export const prisma = new PrismaClient({ adapter });
