import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "./config/swagger";
import invitationsRouter from "./routes/invitations.routes";
import emrRouter from "./routes/emr.routes";
import spacesRouter from "./routes/spaces.routes";
import patientsRouter from "./routes/patients.routes";
import providersRouter from "./routes/providers.routes";
import familyFriendsRouter from "./routes/family-friends.routes";

import { setupWebSocket } from "./websocket";

dotenv.config();

const app = express();
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
  : ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"];

// Security headers
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  }),
);

app.get("/health", (_req, res) => {
  res.json({ ok: true, status: "healthy", timestamp: new Date().toISOString() });
});

app.get("/api-docs.json", (_req, res) => res.json(swaggerDocument));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/invitations", invitationsRouter);
app.use("/api/emr", emrRouter);
app.use("/api/spaces", spacesRouter);
app.use("/api/patients", patientsRouter);
app.use("/api/providers", providersRouter);
app.use("/api/family-friends", familyFriendsRouter);

// Centralized error handler
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled error:", err);
  const errorObj = err as { status?: number; message?: string };
  const status = typeof errorObj?.status === "number" ? errorObj.status : 500;
  res.status(status).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : errorObj?.message || "Internal server error",
  });
});

const server = http.createServer(app);
setupWebSocket(server);

const PORT = Number(process.env.PORT || 4000);

async function start() {
  try {
    const { prisma } = await import("./config/prisma.js");
    await prisma.$connect();
    console.log("Database connected");

    server.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();

async function shutdown() {
  const { prisma } = await import("./config/prisma.js");
  await prisma.$disconnect();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

export default app;
