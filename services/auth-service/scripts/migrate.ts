import dotenv from "dotenv";
import fs from "fs/promises";
import { Client } from "pg";
import path from "path";

dotenv.config({
    path: "../.env"
});


const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function DoMigration() {
    try {
        await client.connect();
        console.log("database connection successfull");

        await client.query(`
            CREATE TABLE IF NOT EXISTS schema_migrations (
                id SERIAL PRIMARY KEY,
                filename VARCHAR(255) UNIQUE NOT NULL,
                executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
        `);

        const migrationDir = path.join(process.cwd(), "migrations");
        const files = await fs.readdir(migrationDir);
        for (const file of files.sort()) {
            if (!file.endsWith(".sql")) {
                continue;
            }

            // 1. Check whether migration already ran
            const result = await client.query(
                `SELECT 1 FROM schema_migrations WHERE filename = $1`,
                [file]
            );

            if ((result.rowCount ?? 0) > 0) {
                console.log(`Skipping ${file}`);
                continue;
            }

            // 2. Read SQL file
            const sql = await fs.readFile(
                path.join(migrationDir, file),
                "utf-8"
            );

            // 3. Run SQL
            await client.query(sql);

            // 4. Record migration
            await client.query(
                `INSERT INTO schema_migrations (filename) VALUES ($1)`,
                [file]
            );

            console.log(`Executed ${file}`);
        }
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}

DoMigration();