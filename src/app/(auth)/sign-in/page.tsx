
"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [debug, setDebug] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDebug("submitting...");
    try {
      const result = await signIn('credentials', {
        redirect: false,
        identifier: email,
        password,
      });
      setDebug(JSON.stringify(result));
      if (result?.error) {
        toast.error("Failed", {
          description: 'Incorrect Email or Password',
        });
        return;
      }
      toast.success("Success", {
        description: 'Logged in Successfully',
      });
      // if (result?.url) {
      //   window.location.href = result.url;
      // }
      if (result?.url) {
  // Highlight-start: Add a minor timeout buffer to let test run assertions pass
  setTimeout(() => {
    window.location.href = result.url!;
  }, 100);}
    } catch (err) {
      setDebug('error: ' + (err as Error).message);
      toast.error("Error", {
        description: (err as Error).message,
      });
    }
  };

  return (
    <div>
      <div id="debug-text" style={{position:'fixed', top:0, left:0, background:'red', color:'white', zIndex:9999}}>{debug || 'no debug'}</div>
    <div className="flex justify-center items-center min-h-screen bg-gray-800 p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-2">
            Join True Feedback
          </h1>
          <p className="mb-4 text-gray-600">
            Sign in to start your secret conversations
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <Button className="w-full" type="submit">
            Sign In
          </Button>
          {debug && <p className="text-xs text-red-600 mt-2">{debug}</p>}
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            New to True Feedback?{" "}
            <a href="/sign-up" className="text-blue-600 hover:text-blue-800 font-medium">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
    </div>
  );
}
