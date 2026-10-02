import { getPool } from "../loaders/postgresLoader.js";

export async function getUser(email: string) {
    const pool = getPool();

    const result = await pool.query(
        `SELECT * FROM users
        WHERE email = $1`,
        [email]
    );

    return result.rows[0];
}

export async function createUser(
    email: string,
    passwordHash: string,
    role: string
) {
    const pool = getPool();

    const result = await pool.query(
        `INSERT INTO users (email, password_hash,role)
        VALUES ($1, $2, $3)
        RETURNING id, email`,
        [email, passwordHash, role]
    );

    return result.rows[0];
}