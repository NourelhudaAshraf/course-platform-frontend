/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ForgotPasswordForm from "./ForgotPasswordForm/page";

export default function ForgotPassword() {
  const [emailSent, setEmailSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  if (emailSent) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black min-h-dvh px-4">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <MailCheck className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="font-bold text-2xl bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Check your email
            </CardTitle>
            <CardDescription className="text-base text-gray-600">
              We sent password reset instructions to{" "}
              <span className="font-medium text-gray-900">
                {submittedEmail}
              </span>
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col space-y-4">
            <p className="text-sm text-center text-gray-600">
              Didn&apos;t receive the email? Check your spam folder or try
              again.
            </p>
            <Button
              variant="outline"
              className="w-1/2 mx-auto"
              onClick={() => setEmailSent(false)}
            >
              Try again
            </Button>
            <p className="text-sm text-center text-gray-600">
              <a href="/login" className="text-blue-600 hover:underline">
                Back to login
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black min-h-dvh px-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="font-bold text-2xl bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Forgot password
          </CardTitle>
          <CardDescription className="text-base text-gray-600">
            Enter your email and we&apos;ll send you a link to reset your
            password
          </CardDescription>
        </CardHeader>
        <ForgotPasswordForm
          setEmailSent={setEmailSent}
          setSubmittedEmail={setSubmittedEmail}
        />
      </Card>
    </div>
  );
}
