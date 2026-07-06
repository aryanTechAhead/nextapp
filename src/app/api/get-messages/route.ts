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
  // console.log(session)
  const user: User = session?.user as User;
  // console.log(user)
  if (!session || !user) {
    return Response.json(
      { message: "Not Authenticated", success: false },
      { status: 401 },
    );
  }
  // const userId = new mongoose.Types.ObjectId(user._id);
  // try {
  //   const user = await UserModel.aggregate([
  //     { $match: { id: userId } },
  //     { $unwind: "$messages" },
  //     { $sort: { "messsages.createdAt": -1 } },
  //     { $group: { _id: "$_id", messages: { $push: "$messages" } } },
  //   ]);
  //   console.log(user)
  //   if (user.length === 0 || !user) {
  //     return Response.json(
  //       { message: "User Not found", success: false },
  //       { status: 401 },
  //     );
  //   }
 
  //     return Response.json(
  //       { message: "User Found", success: true , messages:user[0].messages},
  //       { status: 200 },
  //     );
    
  // } catch (error) {
  //   console.log(error)
  //   return Response.json(
  //     {
  //       success: false,
  //       message: "encountered an error in getting the messages",
  //     },
  //     { status: 500 },
  //   );
  // }
 


  if (!user._id || !mongoose.Types.ObjectId.isValid(user._id)) {
    return Response.json(
      { message: "Invalid User ID format supplied", success: false },
      { status: 400 }
    );
  }

  const objectId = new mongoose.Types.ObjectId(user._id);
try {
  // 1. Defensively validate if the userId string is a valid 24-character hex string
 

  const user = await UserModel.aggregate([
    { 
      $match: { _id: objectId } 
    },
    {
      // FIXED: Keeps the document alive in the pipeline even if messages array is empty
      $unwind: {
        path: "$message",
        preserveNullAndEmptyArrays: true
      }
    },
    { 
      // Handle potential null values when sorting if no messages exist
      $sort: { "message.createdAt": -1 } 
    },
    { 
      $group: { 
        _id: "$_id", 
        // Using $push on an empty/null unwound field creates a clean array structure
        message: { 
          $push: {
            $cond: {
              if: { $eq: [{ $type: "$message" }, "missing"] },
              then: "$$REMOVE", // Completely skips pushing if the field is empty
              else: "$message"
            }
          }
        } 
      } 
    },
  ]);

  console.log("AGGREGATION RESULT:", user);
  console.log("DETAILED MESSAGES:", user[0].message);

  // If the array is still empty [] here, the user document truly does not exist in your DB
  if (!user || user.length === 0) {
    return Response.json(
      { message: "User not found in database", success: false },
      { status: 404 }
    );
  }

  return Response.json(
    { message: "Messages fetched successfully", success: true, messages: user[0].message || [] },
    { status: 200 }
  );

} catch (error) {
  console.error("Aggregation crash trace:", error);
  return Response.json(
    { message: "Internal server error", success: false },
    { status: 500 }
  );
}


}
