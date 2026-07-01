import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import UserModel from "@/model/user.model";

export async function POST(request:Request){
    await dbConnect()
    try {
        const {username, code}= await request.json()
        const decodedUsername= decodeURIComponent(username)
        const user= await UserModel.findOne({username:decodedUsername})
        if(!user){
             return Response.json({
            success:false,
            message:"User not found"
        },{status:404})
        }
        const isCodeValid= user.verificationCode===code
        const isCodeNotExpired= new Date(user.verifyCodeExpiry)>new Date()

        if(isCodeNotExpired && isCodeValid){
            user.isVerified=true
            await user.save()
            return Response.json({
            success:true,
            message:"Verification Successfull"
        },{status:200})
        }else if(!isCodeNotExpired){
            return Response.json({
            success:false,
            message:"Verification Code is Expired"
        },{status:400})
        }else{
            return Response.json({
            success:false,
            message:"Verification Code incorrect"
        },{status:400})
        }

    } catch (error) {
        console.log(error)
        return Response.json({
            success:false,
            message:"Error in verifying the code"
        },{status:400})
    }

}