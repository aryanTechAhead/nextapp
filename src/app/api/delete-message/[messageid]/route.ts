import { getServerSession } from "next-auth";
// import { AuthOptions } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import UserModel from "@/model/user.model";
import { authOptions } from "../../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function DELETE(request: Request, {params}:{ params: Promise<{ messageid: string }> }) {
  // const messageId=await params.messageid

  const resolvedParams = await params;
  const messageId = resolvedParams.messageid;
  await dbConnect();
  const session = await getServerSession(authOptions);
  // console.log(session)
  const user: User = session?.user as User;
  // console.log(user)
  if (!session || !user) {
    return Response.json(
      { message: "Not Authenticated", success: false },
      { status: 401 },
    );
  }
  try {
    const updatedresult= await UserModel.updateOne({_id:user._id},
      {$pull:{message:{_id:messageId}}}
     )
     if(updatedresult.modifiedCount==0){
      return Response.json({
        success:false,
        message:"Message not found"
      },{status:404})
     }
     return Response.json({
        success:true,
        message:"Message deleted successfully"
      },{status:200})
  } catch (error) {
    console.log(error)
    return Response.json({
        success:false,
        message:"Error deleting the message"
      },{status:500})
  }
}