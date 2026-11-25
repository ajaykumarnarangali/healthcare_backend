import { adminInvitationTemplate } from "../templates/adminInvitation.template.js";
import { verificationEmailTemplate } from "../templates/verification.template.js";
import { sendEmail } from "../utils/email.js";

type SendVerificationEmailParams = {
    userId: string,
    email: string;
    verificationToken: string;
};
export async function sendVerificationEmail(params: SendVerificationEmailParams) {

    const { email, verificationToken, userId } = params;
    const queryParams = new URLSearchParams({
        userId,
        token: verificationToken,
    });
    const verificationUrl =
        `${process.env.FRONTEND_ADMIN_URL}/verify-email?${queryParams.toString()}`;

    const verificationHtml = verificationEmailTemplate(verificationUrl);
    await sendEmail(
        email,
        "Verify your email address",
        verificationHtml
    );
}

type SendHospitalAdminInvitationEmailParms = {
    name: string,
    email: string;
    token: string;
};
export async function sendHospitalAdminInvitationEmail(params: SendHospitalAdminInvitationEmailParms) {

    const { name, email, token } = params;
    const queryParams = new URLSearchParams({
        token
    });
    const invitationAcceptUrl =
        `${process.env.FRONTEND_ADMIN_URL}/accept-invitation?${queryParams.toString()}`;

    const invitationHtml = adminInvitationTemplate(name, email, invitationAcceptUrl);
    await sendEmail(
        email,
        "You're Invited to Join MediConnect as a Hospital Administrator",
        invitationHtml
    );
}