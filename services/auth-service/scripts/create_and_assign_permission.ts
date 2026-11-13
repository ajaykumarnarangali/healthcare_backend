import dotenv from "dotenv";
import { Client } from "pg";
import type { UserRole } from "../src/constants/user.constants.js";

dotenv.config({
    path: "../.env"
});


const client = new Client({
    connectionString: process.env.DATABASE_URL_SCRIPT,
});

const hospitalAdminPermissions = [
    'dashboard:view',
    'hospital:view',
    'hospital:update',
    'department:view',
    'department:manage',
    'doctor:view',
    'doctor_assignment:view',
    'doctor_assignment:manage',
    'schedule:view',
    'schedule:manage',
    'leave:view',
    'leave:manage',
    'appointment:view',
    'appointment:manage',
    'payment:view',
    'payment:manage',
    'notification:view',
    'notification:manage',
    'profile:view',
    'profile:update',
    'settings:view',
    'settings:update',
] as const;

const globalAdminPermissions = [
    'dashboard:view',
    'hospital:view',
    'hospital:manage',
    'hospital_admin:view',
    'hospital_admin:manage',
    'doctor:view',
    'doctor:manage',
    'patient:view',
    'patient:manage',
    'appointment:view',
    'appointment:manage',
    'payment:view',
    'payment:manage',
    'notification:view',
    'notification:manage',
    'report:view',
    'profile:view',
    'profile:update',
    'settings:view',
    'settings:update',
] as const;

const doctorPermissions = [
    'dashboard:view',
    'appointment:view',
    'appointment:manage',
    'patient:view',
    'consultation:view',
    'consultation:manage',
    'schedule:view',
    'schedule:manage',
    'independent_practice:view',
    'independent_practice:manage',
    'hospital_assignment:view',
    'hospital_assignment:manage',
    'leave:view',
    'leave:manage',
    'message:view',
    'message:send',
    'notification:view',
    'earning:view',
    'earning:manage',
    'profile:view',
    'profile:update',
    'settings:view',
    'settings:update',
] as const;

const patientPermissions = [
    'dashboard:view',
    'doctor:view',
    'hospital:view',
    'appointment:view',
    'appointment:create',
    'appointment:manage',
    'payment:view',
    'payment:create',
    'consultation:view',
    'consultation:join',
    'message:view',
    'message:send',
    'notification:view',
    'profile:view',
    'profile:update',
    'settings:view',
    'settings:update',
] as const;

async function checking_permission_mapping(role: UserRole, dbPermission: any) {
    let checkingArray;
    switch (role) {
        case "PATIENT":
            checkingArray = patientPermissions;
            break;

        case "DOCTOR":
            checkingArray = doctorPermissions;
            break;

        case "HOSPITAL_ADMIN":
            checkingArray = hospitalAdminPermissions;
            break;

        case "GLOBAL_ADMIN":
            checkingArray = globalAdminPermissions;
            break;

        default:
            throw new Error("Invalid role");
    }

    const expected = [...checkingArray].sort();
    const actual = [...dbPermission].sort();
    const isMatching =
        JSON.stringify(expected) === JSON.stringify(actual);

    return isMatching;
}

async function create_and_assign_permission() {

    const totalPermissions = [
        ...globalAdminPermissions,
        ...hospitalAdminPermissions,
        ...doctorPermissions,
        ...patientPermissions
    ].filter((permission, ind, arr) => {
        return arr.indexOf(permission) == ind
    });

    const values = totalPermissions.map((_, index) => `($${index + 1})`).join(", ");

    const add_permission_query = `
        INSERT INTO permissions (name)
        VALUES ${values}
        ON CONFLICT (name) DO NOTHING
    `;

    await client.connect();
    console.log("database connection successfull");

    await client.query(add_permission_query, totalPermissions);
    console.log("updated permissions");

    // The values selected by the query below are inserted into the role_permissions table.

    // Creates a derived result set named 'roles' with two columns:
    // 'role' → Table column alias (PATIENT, DOCTOR, etc.)
    // 'permission_names' → Array of permission names belonging to each role.

    // CROSS JOIN combines every row from the permissions table with every row
    // from the derived 'roles' result set, creating all possible combinations.

    // WHERE runs logically after the CROSS JOIN and filters the generated combinations.
    // It checks whether p.name exists in the permission_names array of each role.
    // Only matching role-permission combinations are selected and inserted
    // into the role_permissions table.

    const add_permission_to_user_query = `
        INSERT INTO role_permissions (role, permission_id)
        SELECT roles.role, p.permission_id
        FROM permissions AS p
        CROSS JOIN (
            VALUES
                ('PATIENT', $1::TEXT[]),
                ('DOCTOR', $2::TEXT[]),
                ('HOSPITAL_ADMIN', $3::TEXT[]),
                ('GLOBAL_ADMIN', $4::TEXT[])
        ) AS roles(role, permission_names)
        WHERE p.name = ANY(roles.permission_names);
    `
    await client.query(add_permission_to_user_query, [
        patientPermissions,
        doctorPermissions,
        hospitalAdminPermissions,
        globalAdminPermissions]
    );
    console.log("added role_permission data");

    const get_user_permission_query = `
        SELECT p.name
        FROM permissions AS p
        INNER JOIN role_permissions AS rp
            ON p.permission_id = rp.permission_id
        WHERE rp.role = $1;
    `;

    const patientPermission = await client.query(get_user_permission_query, ["PATIENT"]);
    const isPatientPermissionMatching = await checking_permission_mapping(
        "PATIENT",
        patientPermission.rows.map(row => row.name)
    );
    console.log("patient permission match", isPatientPermissionMatching);

    const doctorPermission = await client.query(get_user_permission_query, ["DOCTOR"]);
    const isDoctorPermissionMatching = await checking_permission_mapping(
        "DOCTOR",
        doctorPermission.rows.map(row => row.name)
    );
    console.log("doctor permission match", isDoctorPermissionMatching);

    const hospitalAdminPermission = await client.query(get_user_permission_query, ["HOSPITAL_ADMIN"]);
    const isHospitalAdminPermissionMatching = await checking_permission_mapping(
        "HOSPITAL_ADMIN",
        hospitalAdminPermission.rows.map(row => row.name)
    );
    console.log("hospital admin permission match", isHospitalAdminPermissionMatching);

    const globalAdminPermission = await client.query(get_user_permission_query, ["GLOBAL_ADMIN"]);
    const isGlobalAdminPermissionMatching = await checking_permission_mapping(
        "GLOBAL_ADMIN",
        globalAdminPermission.rows.map(row => row.name)
    );
    console.log("global admin permission match", isGlobalAdminPermissionMatching);
}

create_and_assign_permission();


