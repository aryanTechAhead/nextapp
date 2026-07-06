import { getServerSession } from "next-auth";
// import { AuthOptions } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import UserModel from "@/model/user.model";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request:Request){
    await dbConnect()
    const session = await getServerSession(authOptions)
     const user:User = session?.user as User
    if(!session || !user){
        return Response.json(
            {message:'Not Authenticated',
                success:false
            },
            {status:401})
    }
    const userId=user._id
    if (!userId) {
      return Response.json(
        { message: 'User ID not found', success: false },
        { status: 400 }
      )
    }
    const {acceptMessages} = await request.json()
    try {
        const updatedUser=await UserModel.findOneAndUpdate({ _id: userId },{isAcceptingMessage:acceptMessages},{new:true})
        if(!updatedUser){
            return Response.json(
            {message:'Failed to update user to accept the message',
                success:false
            },
            {status:401})
        } 
    return Response.json(
            {message:'updated user to accept the message',
                success:true,
                updatedUser
            },
            {status:201})
    } catch (error) {
        console.log(error)
        return Response.json(
            {message:'Failed to update user to accept the message',
                success:false
            },
            {status:500})
    }




    }

export async function GET(request:Request){
    await dbConnect()
    const session = await getServerSession(authOptions)
      const user:User = session?.user as User
    if(!session || !user){
        return Response.json(
            {message:'Not Authenticated',
                success:false
            },
            {status:401})
    }
    const userId= user._id
    if (!userId) {
      return Response.json(
        { message: 'User ID not found', success: false },
        { status: 400 }
      )
    }
    try {
        const findUser= await UserModel.findById(userId)
     if(!findUser){
            return Response.json(
            {message:'Failed to Find user ',
                success:false
            },
            {status:404})
        } 
        return Response.json(
            {message:' Found user ',
                success:true,
                isAcceptingMessage:findUser.isAcceptingMessage
            },
            {status:200})
    } catch (error) {
        console.log(error)
        return Response.json(
            {message:'Failed to find user to accept the message',
                success:false
            },
            {status:500})
    }
}