import {z} from 'zod';

export const userNameValidation = z
.string()
.min(3,'username must be atleast 3 characters')
.max(20,'Username can not be more than 20 char')
.regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores');

export const signUpSchema= z.object({
    username: userNameValidation,
    email:z.string().email({message:'Invalid Email'}),
    password: z.string().min(6,{message:'Password must be atleast 6 characters'}),
})