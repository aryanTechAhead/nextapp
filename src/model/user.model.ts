import mongoose, { Document, Schema } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verificationCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  message: Message[];
}

const MessageSchema: Schema<Message> = new Schema({
  content: { type: String, required: true },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});
const userSchema:Schema<User> = new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true

    },
    email:{
        type:String,
        required:true,
        unique:true,
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']

    },
    password:{
        type:String,
        required:true
    },
    verificationCode:{
        type:String,
        required:true
    },
    verifyCodeExpiry:{
        type:Date,
        required:true,

    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAcceptingMessage:{
        type:Boolean,
        default:true
    },
    message:[MessageSchema]
})

// const UserModel=(mongoose.models.Users as mongoose.Model<User>)||(mongoose.Model<User>('User', userSchema))
const UserModel = (mongoose.models.Users as mongoose.Model<User>) || mongoose.model<User>('User', userSchema);

export default UserModel;