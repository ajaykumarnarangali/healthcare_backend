import nodemailer from "nodemailer";
import { retry } from "./retry.js";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});


export async function sendEmail(email: string, subject: string, html: string) {
    await retry(
        () => transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject,
            html,
        }),
        3,
        2000,
        "Sending account verification email"
    );
    
}