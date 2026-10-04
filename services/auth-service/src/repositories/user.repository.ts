import { getPool } from "../loaders/postgresLoader.js";
import { USER_STATUS } from "../constants/user.constants.js";

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

export async function getUserById(userId: string) {
    const pool = getPool();

    const result = await pool.query(
        `
        SELECT id, email_verified
        FROM users
        WHERE id = $1
        `,
        [userId]
    );

    return result.rows[0];
}

export async function verifyUser(userId: string) {
    const pool = getPool();

    await pool.query(
        `
        UPDATE users
        SET
            email_verified = TRUE,
            status = $2,
            updated_at = NOW()
        WHERE id = $1
        `,
        [userId, USER_STATUS.ACTIVE]
    );
}