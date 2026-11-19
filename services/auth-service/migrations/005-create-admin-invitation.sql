CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE invitation_status AS ENUM (
    'PENDING',
    'ACCEPTING',
    'ACCEPTED',
    'REVOKED',
    'EXPIRED',
    'FAILED'
);

CREATE TABLE admin_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,

    token_hash TEXT NOT NULL UNIQUE,

    invited_by UUID NOT NULL REFERENCES users(id),
    hospital_id UUID NOT NULL UNIQUE,

    status invitation_status NOT NULL DEFAULT 'PENDING',

    expires_at TIMESTAMP NOT NULL,
    accepted_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);