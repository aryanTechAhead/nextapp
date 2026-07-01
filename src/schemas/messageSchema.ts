import {z} from 'zod';

export const MessageSchema= z.object({
   content:z.string().min(3, {message:'Content must be atleast 3 characters'}).max(300, {message:'Content can not be longer than 300 characters'})
})