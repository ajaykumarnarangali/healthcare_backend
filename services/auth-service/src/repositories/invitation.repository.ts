import { getPool } from "../loaders/postgresLoader.js";


export async function getAdminAssociatedHospitals() {

    const pool = getPool();
    const query = `
        SELECT hospital_id
        FROM admin_invitations
        WHERE status IN ('PENDING', 'ACCEPTING', 'ACCEPTED');
    `
    const result = await pool.query(query);
    return result.rows.map((row) => row.hospital_id);
}

export async function getInvitationByEmailOrHospitalId(
    email: string,
    hospital_id: string
) {
    const pool = getPool();

    const query = `
        SELECT *
        FROM admin_invitations
        WHERE (email = $1 OR hospital_id = $2)
        AND status IN ('PENDING', 'ACCEPTING', 'ACCEPTED')
        LIMIT 1
    `;

    const values = [email, hospital_id];

    const result = await pool.query(query, values);

    return result.rows[0] ?? null;
}

export async function getInvitationByToken(
    token: string
) {
    const pool = getPool();

    const query = `
        SELECT *
        FROM admin_invitations
        WHERE token_hash=$1
        AND status = 'PENDING'
        LIMIT 1
    `;

    const values = [token];

    const result = await pool.query(query, values);

    return result.rows[0] ?? null;
}

export type CreateInvitationInput = {
    name: string;
    email: string;
    token_hash: string;
    invited_by: string;
    hospital_id: string;
    expires_at: Date;
};
export async function createInvitation(invitationData: CreateInvitationInput) {

    const pool = getPool();
    const query = `
        INSERT INTO admin_invitations (
            name,
            email,
            token_hash,
            invited_by,
            hospital_id,
            expires_at  
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, name, email, hospital_id, invited_by, status, expires_at, created_at
    `;

    const values = [
        invitationData.name,
        invitationData.email,
        invitationData.token_hash,
        invitationData.invited_by,
        invitationData.hospital_id,
        invitationData.expires_at
    ];

    const result = await pool.query(query, values);

    return result.rows[0];

}

export async function updateInvitationStatus(id: string, status: "ACCEPTED" | "FAILED" | "REVOKED") {
    const pool = getPool();
    const acceptedAt = status === "ACCEPTED" ? new Date() : null;
    const query = `
        UPDATE admin_invitations
        SET status = $1,
            accepted_at = $2
        WHERE id = $3
        RETURNING id, status, accepted_at
    `;

    const result = await pool.query(query, [status, acceptedAt, id]);

    return result.rows[0] ?? null;
}