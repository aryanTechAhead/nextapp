import dbConnect from "@/lib/dbConnect";
import {z} from 'zod'
import UserModel from "@/model/user.model";
import { userNameValidation } from "@/schemas/signUpSchema";

const userNameQuerySchema= z.object({
    username:userNameValidation
})

export async function GET(request:Request){

    await dbConnect()

    try {
        const {searchParams}=new URL(request.url)
        const queryParam= {
            username:searchParams.get('username')
        }
        const reuslt= userNameQuerySchema.safeParse(queryParam)
        console.log(reuslt)
        if(!reuslt.success){
            const usernameError= reuslt.error.format().username?._errors|| []
            return Response.json({
                success:false, 
                message: usernameError?.length>0?usernameError.join(', '):'Invalid query Parameters'
            },{status:400})
        }
    const {username} = reuslt.data
    const existingVerifiedUser = await UserModel.findOne({username, isVerified:true})
    if(existingVerifiedUser){
        return Response.json({
                success:false, 
                message: 'username is already taken'
            },{status:400})
    }
    return Response.json({
                success:true, 
                message: 'username is unique'
            },{status:200})

    } catch (error) {
        console.log(error)
        return Response.json({
            success:false,
            message:"Error Checking the username"

        },{
            status:500
        })
    }
}