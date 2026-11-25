export const RABBITMQ_EXCHANGE = "healthcare.events";

export const RABBITMQ_ROUTING_KEYS = {
    USER_EMAIL_VERIFICATION_REQUESTED:
        "user.email_verification.requested",

    USER_HOSPITAL_ADMIN_INVITATION_REQUESTED:
        "user.hospital_admin_invitation.requested",
} as const;