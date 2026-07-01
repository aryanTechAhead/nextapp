import { getServerSession } from "next-auth";
// import { AuthOptions } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import UserModel from "@/model/user.model";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session || !user) {
    return Response.json(
      { message: "Not Authenticated", success: false },
      { status: 401 },
    );
  }
  const userId = new mongoose.Types.ObjectId(user._id);
  try {
    const user = await UserModel.aggregate([
      { $match: { id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messsages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);
    if (user.length === 0 || !user) {
      return Response.json(
        { message: "User Not found", success: false },
        { status: 401 },
      );
    }
 
      return Response.json(
        { message: "User Found", success: true , messages:user[0].messages},
        { status: 200 },
      );
    
  } catch (error) {
    console.log(error)
    return Response.json(
      {
        success: false,
        message: "encountered an error in getting the messages",
      },
      { status: 500 },
    );
  }
}
