import ResetPasswordForm from "./ResetPasswordForm/page";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ResetPassword({ token }: { readonly token: string }) {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black min-h-dvh px-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="font-bold text-2xl bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Reset password
          </CardTitle>
          <CardDescription className="text-base text-gray-600">
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <ResetPasswordForm token={token} />
      </Card>
    </div>
  );
}
