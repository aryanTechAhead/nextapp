import { resend } from "@/lib/resend";

import VerificationEmail from "../../emails/VerificationEmail";

import { ApiResponse } from "@/types/ApiResponse";

export async function SendVerificationemail(
  email: string,
  username: string,
  verifyCode: string,
): Promise<ApiResponse> {
  try {
     await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Verification code",
      react: VerificationEmail({username, otp:verifyCode }),
    });

    return { success: true, message: "Verification Email sent successfully" };
  } catch (error) {
    console.log("Error sending email", error);
    return { success: false, message: "Failed to send an email" };
  }
}
