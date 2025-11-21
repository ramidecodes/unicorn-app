import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL environment variable is not set");
}

const client = postgres(process.env.DATABASE_URL, { max: 1 });
const db = drizzle(client, { schema });

async function runMigrations() {
	console.log("Running migrations...");
	await migrate(db, { migrationsFolder: "./supabase/migrations" });
	console.log("Migrations completed!");
	await client.end();
}

runMigrations().catch((error) => {
	console.error("Migration failed:", error);
	process.exit(1);
});

