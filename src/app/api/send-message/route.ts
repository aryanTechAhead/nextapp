import dbConnect from "@/lib/dbConnect";

import UserModel from "@/model/user.model";

import { Message } from "@/model/user.model";

export async function POST(request: Request) {
  await dbConnect();
  const { username, content } = await request.json();
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          message: "User not found",
          success: false,
        },
        { status: 404 },
      );
    }
    if(!user.isAcceptingMessage){
        return Response.json(
        {
          message: "User is not accepting Messages",
          success: false,
        },
        { status: 403 },
      );
    }
    const newMessage = {content, createdAt:new Date()}
    user.message.push(newMessage as Message)
    await user.save()
    return Response.json(
        {
          message: "Message sent Successfully",
          success: true,
        },
        { status: 201 },
      );
  } catch (error) {
    console.log(error)
    return Response.json(
        {
          message: "Unable to send message",
          success: false,
        },
        { status: 500 },
      );
  }
}
