// "use client";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Controller, useForm } from "react-hook-form";
// import * as z from "zod";
// import Link from "next/link";
// import { useDebounceValue } from "usehooks-ts";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
// import { BugReportForm } from "@/components/ui/form";
// import axios, { AxiosError } from "axios";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { signUpSchema } from "@/schemas/signUpSchema";
// import { ApiResponse } from "@/types/ApiResponse";
// import {
//   Field,
//   FieldGroup,
//   FieldLabel,
//   FieldError
// } from "@/components/ui/field"
// import { Input } from "@/components/ui/input"

// const page = () => {
//   const [username, setusername] = useState("");
//   const [usernameMessage, setusernameMessage] = useState("");
//   const [isCheckingusername, setisCheckingusername] = useState(false);
//   const [isSubmitting, setisSubmitting] = useState(false);
//   const debouncedUsername = useDebounceValue(username, 300);
//   const router = useRouter();

//   const form = useForm<z.infer<typeof signUpSchema>>({
//     resolver: zodResolver(signUpSchema),
//     defaultValues: {
//       username: "",
//       email: "",
//       password: "",
//     },
//   });
//   useEffect(() => {
//     const checkUsernameUnique = async () => {
//       if (debouncedUsername) {
//         setisCheckingusername(true);
//         setusernameMessage("");
//         try {
//           const response = await axios.get(
//             `/api/check-username-unique?username=${debouncedUsername}`,
//           );
//           setusernameMessage(response.data.message);
//         } catch (error) {
//           console.log(error);
//         } finally {
//           setisCheckingusername(false);
//         }
//       }
//     };
//     checkUsernameUnique();
//   }, [debouncedUsername]);

//   const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
//     setisSubmitting(true);
//     try {
//       const response = await axios.post(`/api/sign-up`, data);
//       if (response) {
//         toast("Success", {
//           description: response.data.message,
//         });
//         router.replace(`/verify/${username}`);
//       }
//     } catch (error) {
//       console.log(error, "error in signin user");
//       const axiosError = error as AxiosError<ApiResponse>;
//       let errorMessg = axiosError.response?.data.message;
//       toast.error("signin failed", {
//         description: errorMessg,
//       });
//     } finally {
//       setisSubmitting(false);
//     }
//   };

//   return<div className="flex justify-center items-center min-h-screen bg-gray-800">
//       <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
//         <div className="text-center">
//           <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
//             Welcome Back to True Feedback
//           </h1>
//           <p className="mb-4">Sign in to continue your secret conversations</p>
//         </div>

//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//           <FieldGroup className="gap-6">

//             {/* Email/Username Field */}
//             <Controller
//               name="identifier"
//               control={form.control}
//               render={({ field, fieldState }) => (
//                 <Field data-invalid={fieldState.invalid}>
//                   <FieldLabel htmlFor={field.name}>Email/Username</FieldLabel>
//                   <Input
//                     {...field}
//                     id={field.name}
//                     aria-invalid={fieldState.invalid}
//                   />
//                   {fieldState.invalid && (
//                     <FieldError errors={[fieldState.error]} />
//                   )}
//                 </Field>
//               )}
//             />

//             {/* Password Field */}
//             <Controller
//               name="password"
//               control={form.control}
//               render={({ field, fieldState }) => (
//                 <Field data-invalid={fieldState.invalid}>
//                   <FieldLabel htmlFor={field.name}>Password</FieldLabel>
//                   <Input
//                     {...field}
//                     id={field.name}
//                     type="password"
//                     aria-invalid={fieldState.invalid}
//                   />
//                   {fieldState.invalid && (
//                     <FieldError errors={[fieldState.error]} />
//                   )}
//                 </Field>
//               )}
//             />

//           </FieldGroup>

//           <Button className="w-full" type="submit">Sign In</Button>
//         </form>

//         <div className="text-center mt-4">
//           <p>
//             Not a member yet?{' '}
//             <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
//               Sign up
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
// };

// export default page;

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useDebounceValue, useDebounceCallback } from "usehooks-ts";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react"; // Useful for loading states

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // FIXED: useDebounceValue returns an array [value, setValue]
  const debounced = useDebounceCallback(setUsername, 300);
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    mode: 'onTouched',
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get<ApiResponse>(
            `/api/check-username-unique?username=${username}`,
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message || "Error checking username",
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/sign-up`, data);
      toast.success("Success", {
        description: response.data.message,
      });
      // FIXED: Using data.username ensures reliable value routing
      router.replace(`/verify/${data.username}`);
    } catch (error) {
      console.error("Error in registering user:", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data.message || "Registration failed";
      toast.error("Sign up failed", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800 p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-2">
            Join True Feedback
          </h1>
          <p className="mb-4 text-gray-600">
            Sign up to start your secret conversations
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup className="gap-6">
            {/* Username Field with Unique API Check */}
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    onChange={(e) => {
                      field.onChange(e);
                     debounced(e.target.value); // Syncs local state for debounce check
                    }}
                  />
                  {isCheckingUsername && (
                    <p className="text-xs text-gray-400 mt-1">Checking...</p>
                  )}
                  {usernameMessage && (
                    <p
                      className={`text-xs mt-1 ${usernameMessage=='username is unique' ? "text-green-600" : "text-red-600"}`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Email Field */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="email"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Password Field */}
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="password"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already a member?{" "}
            <Link
              href="/sign-in"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
