import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SignupForm from "./SignupForm/page";

export default function Signup() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black min-h-dvh px-4">
      <Card className="w-full max-w-md mx-auto py-4">
        <CardHeader>
          <CardTitle className="font-bold text-2xl bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create an account
          </CardTitle>
          <CardDescription className="text-base text-gray-600">
            Sign up to get started with our platform
          </CardDescription>
        </CardHeader>
        <SignupForm />
      </Card>
    </div>
  );
}
