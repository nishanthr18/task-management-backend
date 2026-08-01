import fs from "node:fs/promises";
import path from "node:path";
import { pool } from "./db.js";

const MIGRATION_DIR = path.join(process.cwd(), "migration");

const CREATE_MIGRATIONS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS migrations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    executed_at TIMESTAMP NOT NULL DEFAULT NOW()
);
`;

async function getExecutedMigrations() {
    const result = await pool.query(
        "SELECT name FROM migrations ORDER BY name"
    );

    return result.rows.map((row) => row.name);
}

async function migrate() {
    // 1. Create migrations table if it doesn't exist
    await pool.query(CREATE_MIGRATIONS_TABLE_SQL);

    // 2. Get already executed migrations
    const executed = new Set(await getExecutedMigrations());

    // 3. Read all migration files
    const files = await fs.readdir(MIGRATION_DIR);

    // 4. Sort files so they run in order
    files.sort();

    // 5. Execute pending migrations
    for (const file of files) {
        if (!file.endsWith(".sql")) {
            continue;
        }

        if (executed.has(file)) {
            console.log(`Skipping ${file}`);
            continue;
        }

        console.log(`Running ${file}`);

        const filePath = path.join(MIGRATION_DIR, file);

        const sql = await fs.readFile(filePath, "utf-8");

        await pool.query(sql);

        await pool.query(
            "INSERT INTO migrations(name) VALUES($1)",
            [file]
        );

        console.log(`${file} completed`);
    }

    console.log("All migrations are up to date.");
}

migrate().catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
}).finally(() => pool.end());