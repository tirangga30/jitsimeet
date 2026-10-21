import "dotenv/config";
import type { PoolConfig } from "pg";

const ssl =
  process.env.DB_SSL === "true" ||
  process.env.DATABASE_URL?.includes("sslmode=require")
    ? { rejectUnauthorized: false }
    : false;

function fromDatabaseUrl(url: string): PoolConfig {
  const parsed = new URL(url);

  return {
    host: parsed.hostname,
    port: Number(parsed.port),
    database: parsed.pathname.slice(1),
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    ssl,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 3000,
  };
}

function fromIndividualVars(): PoolConfig {
  const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

  if (!DB_HOST || !DB_PORT || !DB_NAME || !DB_USER || !DB_PASSWORD) {
    throw new Error(
      "Missing database config. Set DATABASE_URL or DB_HOST/DB_PORT/DB_NAME/DB_USER/DB_PASSWORD.",
    );
  }

  return {
    host: DB_HOST,
    port: Number(DB_PORT),
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
    ssl,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 3000,
  };
}

export function getDatabaseConfig(): PoolConfig {
  if (process.env.DATABASE_URL) {
    return fromDatabaseUrl(process.env.DATABASE_URL);
  }

  return fromIndividualVars();
}
