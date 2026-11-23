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