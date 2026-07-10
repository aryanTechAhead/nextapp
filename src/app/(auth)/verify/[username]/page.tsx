"use client";

import React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"; // FIXED: Correct library UI import path
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

export default function VerifyPage() { // FIXED: Changed variable signature to standard PascalCase
  const router = useRouter();
  const params = useParams<{ username: string }>();
  
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    mode: 'onTouched',
    defaultValues: {
      code: "",
    },
  });

  // Extract isSubmitting directly from formState context
  const { isSubmitting } = form.formState;

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    console.log("SENDING TO BACKEND:", {
    username: params.username,
    code: data.code,
  });
    try {
      const response = await axios.post('/api/verify-code', {
        username: params.username,
        code: data.code,
      });
      
      toast.success("Success", {
        description: response.data.message,
      });
      
      router.replace("/sign-in"); // FIXED: Absolute path string mapping ensures proper routing
    } catch (error) {
      console.error("Error in registering user:", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data.message || "Verification failed";
      
      toast.error("Verification Failed", {
        description: errorMessage,
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-2">
            Verify Your Account
          </h1>
          <p className="mb-4 text-gray-600">
            Enter the verification code sent to your email
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
            {/* Verification Code Field */}
            <Controller
              name="code"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Verification Code
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="Enter 6-digit code"
                    aria-invalid={fieldState.invalid}
                    disabled={isSubmitting} // Lock entry input while submitting
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          {/* FIXED: Conditional UI spinner elements logic attached */}
          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
