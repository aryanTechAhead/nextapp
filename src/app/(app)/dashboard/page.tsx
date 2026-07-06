"use client";

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/model/user.model";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { Session, User } from "next-auth";
import { useSession } from "next-auth/react";
import { use, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
const Dashboard = () => {
  const [messages, setmessages] = useState<Message[]>([]);
  const [loading, setloading] = useState(false);
  const [isswitchLoading, setIsswitchLoading] = useState(false);

  const handleDelet = (messageId: string) => {
    // setmessages(
    //   messages.filter((message) => {
    //     message._id !== messageId;
    //   }),
    // );
    setmessages(messages.filter((message) => message._id.toString() !== messageId));
  };
   const {data:Session}=useSession()
  const form= useForm({resolver:zodResolver(acceptMessageSchema)})
  const{register, watch,setValue}=form
  const acceptMessage=watch('acceptMessage')

  const fetchAcceptMessage= useCallback(async()=>{
    setIsswitchLoading(true)
    try {
      const response= await axios.get<ApiResponse>('/api/accept-messages')
    setValue('acceptMessage', response.data.isAcceptingMessage ?? false)
    } catch (error) {
      const AxiosEror= error as AxiosError<ApiResponse>
      toast('Error',{
        description:AxiosEror.response?.data.message || "Failed to Fetch Messages"
      })
    }finally{
      setIsswitchLoading(false)
    }
  },[setValue])

  const fetchallMessages= useCallback(async(refresh:boolean=false)=>{
    setloading(true)
   
    setIsswitchLoading(false)
    try {
      const response= await axios.get<ApiResponse>('/api/get-messages')
      setmessages(response.data.messages ||[])
      console.log(response)
      if(refresh){
       
      toast('Refresh Successful',{
        description:"Showing Latest Messages"
      })
      }
    } catch (error) {
      const AxiosEror= error as AxiosError<ApiResponse>
      toast('Error',{
        description:AxiosEror.response?.data.message || "Failed to Fetch Messages"
      })
      
    }finally{
      setloading(false)
      setIsswitchLoading(false)
    }

  },[setloading, setmessages])


  useEffect(() => {
    if(!Session|| !Session.user){
      return
    }
    fetchAcceptMessage()
    fetchallMessages()
    
  }, [Session, setValue,fetchAcceptMessage, fetchallMessages])
  
  const handleSwichChange=async()=>{
    try {
     const response=  await axios.post<ApiResponse>('/api/accept-messages',{
        acceptMessage:!acceptMessage
      })
      setValue('acceptMessage', !acceptMessage)
      toast(response.data.message)

    } catch (error) {
      const AxiosEror= error as AxiosError<ApiResponse>
      toast('Error',{
        description:AxiosEror.response?.data.message || "Failed to Fetch Messages"
      })
    }
  }

  if(!Session||!Session.user){
    return <div>Please Login</div>
  } 
  const { username } = Session.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast('URL Copied!',{
      description: 'Profile URL has been copied to clipboard.',
    });
  };

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessage')}
          checked={acceptMessage}
          onCheckedChange={handleSwichChange}
          disabled={isswitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessage ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchallMessages(true);
        }}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id}
              message={message}
              OnMessageDelete={handleDelet}
            /> 
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
