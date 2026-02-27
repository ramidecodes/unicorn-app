import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// For serverless (Next.js): use max: 1 connection per instance
// Neon's pooler handles connection management for pooled connections
// SSL is required for Neon connections (sslmode=require in connection string)
const client = postgres(process.env.DATABASE_URL, {
  max: 1, // Single connection for serverless functions
  ssl: "require", // Ensure SSL is enabled for Neon
});

export const db = drizzle(client, { schema });
// another comment
export { schema };
export { unicorns, llamas, cats } from "./schema";
// another comment
