import { verificationEmailTemplate } from "../templates/verification.template.js";
import { sendEmail } from "../utils/email.js";

type SendVerificationEmailParams = {
    userId: string,
    email: string;
    verificationToken: string;
};
export async function sendVerificationEmail(params: SendVerificationEmailParams) {

    const { email, verificationToken, userId } = params;
    const queryParams  = new URLSearchParams({
        userId,
        token: verificationToken,
    });
    const verificationUrl =
        `${process.env.FRONTEND_URL}/verify-email?${queryParams.toString()}`;

    const verificationHtml = verificationEmailTemplate(verificationUrl);
    await sendEmail(
        email,
        "Verify your email address",
        verificationHtml
    );
}