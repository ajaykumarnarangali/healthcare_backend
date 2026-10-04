export function verificationEmailTemplate(
    verificationUrl: string
) {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            />
            <title>Verify Your Email</title>
        </head>

        <body
            style="
                margin: 0;
                padding: 0;
                background-color: #f4f7f9;
                font-family: Arial, Helvetica, sans-serif;
                color: #1f2937;
            "
        >
            <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="background-color: #f4f7f9; padding: 40px 16px;"
            >
                <tr>
                    <td align="center">

                        <table
                            width="100%"
                            cellpadding="0"
                            cellspacing="0"
                            border="0"
                            style="
                                max-width: 560px;
                                background-color: #ffffff;
                                border: 1px solid #e2e8f0;
                                border-radius: 8px;
                            "
                        >

                            <!-- Header -->
                            <tr>
                                <td
                                    align="center"
                                    style="
                                        padding: 28px 32px;
                                        border-bottom: 1px solid #e2e8f0;
                                    "
                                >
                                    <h1
                                        style="
                                            margin: 0;
                                            color: #123b5d;
                                            font-size: 24px;
                                            font-weight: 700;
                                        "
                                    >
                                        Healthcare
                                    </h1>
                                </td>
                            </tr>

                            <!-- Content -->
                            <tr>
                                <td
                                    style="
                                        padding: 36px 40px;
                                    "
                                >

                                    <h2
                                        style="
                                            margin: 0 0 20px;
                                            color: #123b5d;
                                            font-size: 22px;
                                            font-weight: 600;
                                        "
                                    >
                                        Verify your email
                                    </h2>

                                    <p
                                        style="
                                            margin: 0 0 16px;
                                            font-size: 15px;
                                            line-height: 1.6;
                                            color: #475569;
                                        "
                                    >
                                        Thank you for creating your account.
                                        Please verify your email address to
                                        activate your account.
                                    </p>

                                    <!-- Button -->
                                    <table
                                        cellpadding="0"
                                        cellspacing="0"
                                        border="0"
                                        style="margin: 28px 0;"
                                    >
                                        <tr>
                                            <td
                                                align="center"
                                                style="
                                                    background-color: #0f766e;
                                                    border-radius: 6px;
                                                "
                                            >
                                                <a
                                                    href="${verificationUrl}"
                                                    style="
                                                        display: inline-block;
                                                        padding: 13px 24px;
                                                        color: #ffffff;
                                                        font-size: 15px;
                                                        font-weight: 600;
                                                        text-decoration: none;
                                                    "
                                                >
                                                    Verify Email
                                                </a>
                                            </td>
                                        </tr>
                                    </table>

                                    <p
                                        style="
                                            margin: 0 0 12px;
                                            font-size: 14px;
                                            line-height: 1.6;
                                            color: #64748b;
                                        "
                                    >
                                        This verification link will expire
                                        in <strong>15 minutes</strong>.
                                    </p>

                                    <p
                                        style="
                                            margin: 0;
                                            font-size: 14px;
                                            line-height: 1.6;
                                            color: #64748b;
                                        "
                                    >
                                        If you didn't create this account,
                                        you can safely ignore this email.
                                    </p>

                                </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                                <td
                                    style="
                                        padding: 20px 40px;
                                        background-color: #f8fafc;
                                        border-top: 1px solid #e2e8f0;
                                    "
                                >
                                    <p
                                        style="
                                            margin: 0;
                                            font-size: 13px;
                                            line-height: 1.5;
                                            color: #64748b;
                                        "
                                    >
                                        Regards,<br />
                                        <strong style="color: #334155;">
                                            Healthcare Team
                                        </strong>
                                    </p>
                                </td>
                            </tr>

                        </table>

                        <p
                            style="
                                margin: 20px 0 0;
                                font-size: 12px;
                                color: #94a3b8;
                                text-align: center;
                            "
                        >
                            This is an automated email. Please do not reply.
                        </p>

                    </td>
                </tr>
            </table>
        </body>
        </html>
    `;
}
