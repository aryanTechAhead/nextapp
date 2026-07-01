import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import bcrypt from "bcryptjs";
import { SendVerificationemail } from "@/helpers/sendVerificationEmail";
import { success } from "zod";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();
    const ExistingUserVerifiedbyUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (ExistingUserVerifiedbyUsername) {
      return Response.json(
        {
          message: "Username is already taken",
          success: false,
        },
        {
          status: 400,
        },
      );
    }

    const existingUserByEmail = await UserModel.findOne({
      email,
    });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exists with this email",
          },
          {
            status: 400,
          },
        );
      }else{
        const hashedpass= await bcrypt.hash(password,10)
        existingUserByEmail.password= hashedpass
        existingUserByEmail.verificationCode= verifyCode
        existingUserByEmail.verifyCodeExpiry= new Date(Date.now()+3600000)
        await existingUserByEmail.save()
      }
    } else {
      const hashedpass = await bcrypt.hash(password, 10);
      const expirydate = new Date();
      expirydate.setHours(expirydate.getHours() + 1);
      const newUser = new UserModel({
        username,
        email,
        password: hashedpass,
        verificationCode: verifyCode,
        verifyCodeExpiry: expirydate,
        isVerified: false,
        isAcceptingMessage: true,
        message: [],
      });
      await newUser.save();
    }

    const emailResponse = await SendVerificationemail(
      email,
      username,
      verifyCode,
    );
    console.log(emailResponse)
    if (!emailResponse) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        {
          status: 500,
        },
      );
    }
    return Response.json(
      {
        success: true,
        message: "User Registered Successfully, Verification is still pending",
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.log("Error in registering user", error);
    return Response.json(
      {
        success: false,
        message: "Error in registering the user",
      },
      {
        status: 500,
      },
    );
  }
}
