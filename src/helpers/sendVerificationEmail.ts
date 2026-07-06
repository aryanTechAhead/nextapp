import { sendEmail } from "@/lib/email";
import { ApiResponse } from "@/types/ApiResponse";

export async function SendVerificationemail(
  email: string,
  username: string,
  verifyCode: string,
): Promise<ApiResponse> {
  try {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Verification Code</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
          <div style="max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 8px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 16px;">Hello ${username},</h2>
            <p style="color: #555; line-height: 1.6; margin-bottom: 24px;">
              Thank you for registering. Please use the following verification code to complete your registration:
            </p>
            <div style="text-align: center; margin: 24px 0;">
              <span style="display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #111; background: #f0f0f0; padding: 12px 24px; border-radius: 6px;">${verifyCode}</span>
            </div>
            <p style="color: #888; font-size: 14px; line-height: 1.5;">
              If you did not request this code, please ignore this email.
            </p>
          </div>
        </body>
      </html>
    `;

    await sendEmail(email, "Verification code", html);

    return { success: true, message: "Verification Email sent successfully" };
  } catch (error) {
    console.log("Error sending email", error);
    return { success: false, message: "Failed to send an email" };
  }
}
